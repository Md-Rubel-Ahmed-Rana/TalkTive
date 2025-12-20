import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

export const socketAuthMiddleware =
  (jwtService: JwtService) =>
  async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = await jwtService.verifyAsync(token);

      socket.data.user = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
      };

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  };
