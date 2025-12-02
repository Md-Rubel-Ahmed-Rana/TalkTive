import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserPayload, AudioChunkPayload, CallSession } from './audio.types';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);
  private activeSessions = new Map<string, CallSession>();
  // Optional Redis client for pub/sub across cluster
  constructor(
    @Optional() @Inject('REDIS_CLIENT') private readonly redisClient?: any,
    @Optional() @Inject('MEDIA_STORAGE') private readonly storage?: any, // e.g. S3 wrapper
  ) {}

  /**
   * Start a call session for a given room.
   * Returns session info (id) to use for tracking.
   */
  async startCall(room: string, initiator: UserPayload, metadata?: any): Promise<CallSession> {
    const session: CallSession = {
      id: uuidv4(),
      room,
      participants: [{ id: initiator.id, joinedAt: Date.now() }],
      startedAt: Date.now(),
      metadata,
    };

    this.activeSessions.set(room, session);
    this.logger.log(`Audio call started: room=${room} session=${session.id}`);

    // publish to redis so other instances know
    if (this.redisClient?.publish) {
      try { this.redisClient.publish('audio:session:start', JSON.stringify(session)); } catch (err) { this.logger.warn('Redis publish failed', err); }
    }

    return session;
  }

  /**
   * Add participant to session
   */
  async joinCall(room: string, user: UserPayload): Promise<void> {
    const session = this.activeSessions.get(room);
    if (!session) {
      this.logger.warn(`joinCall called on non-existing session room=${room}`);
      return;
    }

    if (!session.participants.find(p => p.id === user.id)) {
      session.participants.push({ id: user.id, joinedAt: Date.now() });
    }
  }

  /**
   * Handle inbound audio chunk
   * - store or forward chunk to a media pipeline
   * - optionally persist chunk for reassembly/recording
   */
  async handleAudioChunk(payload: AudioChunkPayload): Promise<void> {
    // basic validation
    if (!payload.room || !payload.userId || !payload.chunk) {
      throw new Error('Invalid audio chunk payload');
    }

    // Rate-limiting hook: add your logic here (per-user/per-room)
    // e.g. if (isRateLimited(payload.userId)) throw new Error('Rate limit');

    // Forward to Redis pub/sub for cluster-wide streaming if available
    if (this.redisClient?.publish) {
      try {
        // NOTE: chunk should be encoded (base64) or stored and referenced
        const encoded = Buffer.isBuffer(payload.chunk) ? payload.chunk.toString('base64') : Buffer.from(payload.chunk as ArrayBuffer).toString('base64');
        await this.redisClient.publish('audio:chunk', JSON.stringify({
          room: payload.room,
          userId: payload.userId,
          sequence: payload.sequence,
          ts: payload.timestamp || Date.now(),
          chunkB64: encoded,
        }));
      } catch (err) {
        this.logger.warn('Redis publish audio chunk failed', err);
      }
    }

    // Optionally persist to temporary store for assembling recording or transcription
    try {
      if (this.storage?.putTempChunk) {
        // Implement storage.putTempChunk(room, userId, sequence, chunkBuffer)
        await this.storage.putTempChunk(payload.room, `${payload.userId}-${payload.sequence}`, payload.chunk);
      }
    } catch (err) {
      this.logger.warn('Failed to persist audio chunk', err);
    }

    // Hook: push to real-time processing/transcription queue
    // e.g. this.transcriptionQueue.add({room, userId, chunk})
  }

  /**
   * Stop / end call -> optionally assemble chunks, finalize recording
   */
  async endCall(room: string): Promise<{ session: CallSession | null; recordingUrl?: string | null }> {
    const session = this.activeSessions.get(room) ?? null;
    if (!session) {
      this.logger.warn(`endCall for non-existing session room=${room}`);
      return { session: null, recordingUrl: null };
    }

    session.endedAt = Date.now();
    this.activeSessions.delete(room);

    // attempt to stitch recording and upload to storage (S3) - placeholder
    let recordingUrl: string | null = null;
    try {
      if (this.storage?.assembleAndUpload) {
        recordingUrl = await this.storage.assembleAndUpload(room, session.id);
      }
    } catch (err) {
      this.logger.error('Failed to assemble/upload recording', err);
    }

    // publish event
    if (this.redisClient?.publish) {
      try { this.redisClient.publish('audio:session:end', JSON.stringify(session)); } catch (err) {}
    }

    this.logger.log(`Audio call ended: room=${room} session=${session.id}`);
    return { session, recordingUrl };
  }

  /**
   * Save final recording (if you assembled it externally)
   */
  async saveRecording(room: string, sessionId: string, buffer: Buffer, opts?: { contentType?: string; filename?: string; metadata?: any }) {
    if (!this.storage?.upload) {
      throw new Error('No storage provider configured');
    }
    const filename = opts?.filename ?? `${room}-${sessionId}-${Date.now()}.webm`;
    return this.storage.upload(filename, buffer, { contentType: opts?.contentType, metadata: opts?.metadata });
  }

  /**
   * Utility to get session
   */
  getSession(room: string): CallSession | undefined {
    return this.activeSessions.get(room);
  }
}
