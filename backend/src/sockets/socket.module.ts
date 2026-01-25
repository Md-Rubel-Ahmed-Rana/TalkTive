import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { AudioGateway } from './audio/audio.gateway';
import { VideoGateway } from './video/video.gateway';
import { ChatService } from './chat/chat.service';
import { AudioService } from './audio/audio.service';
import { VideoService } from './video/video.service';

@Module({
  providers: [
    ChatGateway,
    AudioGateway,
    VideoGateway,
    ChatService,
    AudioService,
    VideoService,
  ],
})
export class SocketModule {}
