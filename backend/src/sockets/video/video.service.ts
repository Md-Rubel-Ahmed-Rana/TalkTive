import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { WebRtcSignal, VideoSession } from './video.types';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private sessions = new Map<string, VideoSession>();

  constructor(
    @Optional() @Inject('REDIS_CLIENT') private readonly redisClient?: any,
    @Optional() @Inject('MEDIA_STORAGE') private readonly storage?: any,
    @Optional() @Inject('SIGNALING_QUEUE') private readonly signalingQueue?: any, // e.g. Bull queue for heavy ops
  ) {}

  async startOrJoinSession(room: string, userId: string | number, metadata?: any): Promise<VideoSession> {
    let session = this.sessions.get(room);
    if (!session) {
      session = {
        id: uuidv4(),
        room,
        startedAt: Date.now(),
        participants: [{ id: userId, joinedAt: Date.now() }],
        metadata,
      };
      this.sessions.set(room, session);
      this.logger.log(`Video session created room=${room} session=${session.id}`);
    } else {
      if (!session.participants.find(p => p.id === userId)) {
        session.participants.push({ id: userId, joinedAt: Date.now() });
      }
    }

    // Optionally notify other instances of session creation/join
    if (this.redisClient?.publish) {
      try { this.redisClient.publish('video:session:join', JSON.stringify({ room, userId })); } catch (err) { this.logger.warn('Redis publish failed', err); }
    }

    return session;
  }

 
  async handleSignal(signal: WebRtcSignal): Promise<void> {
    // Light validation
    if (!signal.room || !signal.from) {
      throw new Error('Invalid signaling payload');
    }

    // If you want persistent logs of offers/answers for debug purposes:
    if (this.signalingQueue?.add) {
      try {
        await this.signalingQueue.add('webrtc-signal', signal, { removeOnComplete: true, removeOnFail: true });
      } catch (err) {
        this.logger.warn('Failed to enqueue signaling event', err);
      }
    }

    // Optionally broadcast via redis channel for other instances
    if (this.redisClient?.publish) {
      try { this.redisClient.publish('video:signal', JSON.stringify(signal)); } catch (err) {}
    }
  }

  /**
   * End video session and optionally record/assemble any blobs
   */
  async endSession(room: string): Promise<{ session: VideoSession | null; recordingUrl?: string | null }> {
    const session = this.sessions.get(room) ?? null;
    if (!session) {
      this.logger.warn(`endSession called for non-existing room=${room}`);
      return { session: null, recordingUrl: null };
    }
    session.endedAt = Date.now();
    this.sessions.delete(room);

    // Attempt recording assembly if stored
    let recordingUrl: string | null = null;
    try {
      if (this.storage?.assembleAndUpload) {
        recordingUrl = await this.storage.assembleAndUpload(room, session.id);
      }
    } catch (err) {
      this.logger.error('Failed to assemble video recording', err);
    }

    if (this.redisClient?.publish) {
      try { this.redisClient.publish('video:session:end', JSON.stringify(session)); } catch (err) {}
    }

    return { session, recordingUrl };
  }

  /**
   * Helper to validate offers/answers shape if you want to reject big payloads
   */
  validateSdpSize(sdp: any): void {
    const approxSize = Buffer.byteLength(JSON.stringify(sdp || {}), 'utf8');
    const limit = Number(process.env.WEBRTC_SDP_MAX_BYTES || 512 * 1024); // default 512KB
    if (approxSize > limit) {
      throw new Error(`SDP size exceeds limit (${approxSize} > ${limit})`);
    }
  }

  getSession(room: string): VideoSession | undefined {
    return this.sessions.get(room);
  }
}
