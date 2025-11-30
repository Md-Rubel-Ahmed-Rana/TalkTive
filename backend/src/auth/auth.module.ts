import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OAuth2Strategy } from "./oauth2.strategy";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuth2Strategy],
})
export class AuthModule {}
