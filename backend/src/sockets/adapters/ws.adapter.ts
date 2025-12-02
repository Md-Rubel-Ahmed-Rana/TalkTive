import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplication } from "@nestjs/common";
import { ServerOptions } from "socket.io";

export class WsAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    console.log({
      from: "WsAdapter",
      message: "I am from WsAdapter => IoAdapter",
      port: port,
    });
    const server = super.createIOServer(port, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      pingTimeout: 20000,
      pingInterval: 15000,
      maxHttpBufferSize: 5e7, // 50MB for audio/video chunks
      ...options,
    });

    return server;
  }
}
