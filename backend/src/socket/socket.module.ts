import { Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { SocketGateway } from "./socket.gateway";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
