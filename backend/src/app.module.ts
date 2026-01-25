import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { SocketModule } from "./socket/socket.module";
import mongoose from "mongoose";
import { SocketModule } from "./sockets/socket.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DATABASE_URL"),
        connectionFactory: () => mongoose,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
<<<<<<< HEAD
    SocketModule
=======
    SocketModule,
>>>>>>> 2dd8cb4f7da2634d3d9900059456a8d2298c96f5
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
