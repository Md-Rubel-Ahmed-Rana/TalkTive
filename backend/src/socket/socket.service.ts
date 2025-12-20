import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { GetAuthUserDTO } from "src/auth/dto/get-auth-user.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  private readonly onlineUsers = new Map<string, string>();

  constructor(private readonly usersService: UsersService) {}

  async handleConnection(socket: Socket, server: Server): Promise<void> {
    const user: GetAuthUserDTO | undefined = socket.data.user;

    if (!user) {
      this.logger.warn(`Socket ${socket.id} tried to connect without user`);
      socket.disconnect();
      return;
    }

    this.onlineUsers.set(user.id, socket.id);

    this.logger.log(
      `User connected | userId=${user.id} | socketId=${socket.id}`
    );

    server.emit("user-online", {
      userId: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });

    // update user online status in database
    await this.usersService.toggleOnlineStatus(user.id, true);

    this.logger.log(`Broadcasted user-online for userId=${user.id}`);

    socket.on("disconnect", (reason) => {
      this.handleDisconnect(socket, server, reason);
    });
  }

  private async handleDisconnect(
    socket: Socket,
    server: Server,
    reason: string
  ): Promise<void> {
    const user: GetAuthUserDTO | undefined = socket.data.user;

    if (user) {
      this.onlineUsers.delete(user.id);

      this.logger.warn(
        `User disconnected | userId=${user.id} | Reason=${reason}`
      );

      server.emit("user-offline", {
        userId: user.id,
      });

      // update user online status in database
      await this.usersService.toggleOnlineStatus(user.id, false);

      this.logger.log(`Broadcasted user-offline for userId=${user.id}`);
    } else {
      this.logger.warn(
        `Socket disconnected without user | socketId=${socket.id}`
      );
    }
  }
}
