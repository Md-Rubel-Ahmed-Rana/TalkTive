import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  private readonly logger = new Logger(SocketService.name);

  handleConnection(socket: Socket): void {
    const clientId = socket.id;

    this.connectedClients.set(clientId, socket);

    this.logger.log(`Socket connected successfully: ${clientId}`);

    socket.on("disconnect", (reason) => {
      this.connectedClients.delete(clientId);

      this.logger.warn(`Socket disconnected: ${clientId} | Reason: ${reason}`);
    });
  }
}
