import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async storeMessage(userId: number, data: any) {
    // Save to DB in production
    return {
      userId,
      message: data.message,
      room: data.room,
      at: new Date(),
    };
  }
}
