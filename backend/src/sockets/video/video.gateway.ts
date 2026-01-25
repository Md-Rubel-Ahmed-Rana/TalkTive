// sockets/video/video.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VideoService } from './video.service';

@WebSocketGateway({ namespace: '/video' })
export class VideoGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly videoService: VideoService) {}

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    socket.join(room);
    socket.to(room).emit('userJoined', { userId: socket.data.user.id });
  }

  @SubscribeMessage('offer')
  async offer(@MessageBody() data: any) {
    this.server.to(data.room).emit('offer', data);
  }

  @SubscribeMessage('answer')
  async answer(@MessageBody() data: any) {
    this.server.to(data.room).emit('answer', data);
  }

  @SubscribeMessage('iceCandidate')
  async iceCandidate(@MessageBody() data: any) {
    this.server.to(data.room).emit('iceCandidate', data);
  }
}
