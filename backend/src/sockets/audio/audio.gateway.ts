// sockets/audio/audio.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AudioService } from './audio.service';

@WebSocketGateway({ namespace: '/audio' })
export class AudioGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly audioService: AudioService) {}

  @SubscribeMessage('joinCall')
  joinCall(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    socket.join(room);
    this.server.to(room).emit('userJoined', { user: socket.data.user });
  }

  @SubscribeMessage('audioChunk')
  async handleAudioChunk(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { room: string; chunk: ArrayBuffer },
  ) {
    this.server.to(data.room).emit('audioChunk', {
      userId: socket.data.user.id,
      chunk: data.chunk,
    });
  }
}
