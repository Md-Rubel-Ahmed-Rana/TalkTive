import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OAuth2Strategy } from "./oauth2.strategy";

const configService = new ConfigService();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: configService.get<string>("JWT_SECRET"),
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, OAuth2Strategy],
})
export class AuthModule {}
