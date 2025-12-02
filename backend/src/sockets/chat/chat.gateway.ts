import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    console.log('Chat user connected:', socket.id);
  }

  async handleDisconnect(socket: Socket) {
    console.log('Chat user disconnected:', socket.id);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    socket.join(room);
  }

  @SubscribeMessage('typing')
  typing(@MessageBody() data: any) {
    this.server.to(data.room).emit('typing', data);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { room: string; message: string },
  ) {
    const msg = await this.chatService.storeMessage(socket.data.user.id, body);
    this.server.to(body.room).emit('message', msg);
    return msg;
  }
}
