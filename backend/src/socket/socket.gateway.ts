import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./socket.service";
import { JwtService } from "@nestjs/jwt";
import { socketAuthMiddleware } from "./socket-auth.middleware";

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly jwtService: JwtService
  ) {}

  afterInit(server: Server) {
    server.use(socketAuthMiddleware(this.jwtService));
  }

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket, this.server);
  }
}
