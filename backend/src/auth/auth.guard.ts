import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  // cookie config
  private readonly cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };
  private readonly cookieNames = {
    accessToken: "talktive_access_token",
    refreshToken: "talktive_refresh_token",
  };

  private readonly tokenExpiration = {
    accessToken: "3d",
    refreshToken: "7d",
  };

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("Hello, I am from Auth Guard");
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const { accessToken, refreshToken } = this.extractTokens(request);
    console.log({ accessToken, refreshToken });

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException("Unauthorized");
    }

    try {
      // Try normal access token
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      request["user"] = payload;
      return true;
    } catch (error) {
      // Access token expired → try refresh token
      if (error?.name !== "TokenExpiredError") {
        throw new UnauthorizedException();
      }

      if (!refreshToken) throw new UnauthorizedException();

      // Rotate tokens using refresh token
      return this.rotateTokens(response, request, refreshToken);
    }
  }

  private async rotateTokens(
    response: Response,
    request: Request,
    refreshToken: string
  ) {
    // Validate refresh token
    try {
      const refreshPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      const { id, email, name, provider } = refreshPayload;

      // ROTATE TOKENS (GENERATE NEW TOKENS)
      const newAccessToken = await this.jwtService.signAsync(
        { id, email, name, provider },
        {
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: this.tokenExpiration.accessToken as any,
        }
      );

      const newRefreshToken = await this.jwtService.signAsync(
        { id, email, name, provider },
        {
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: this.tokenExpiration.refreshToken as any,
        }
      );

      // SET NEW TOKENS IN COOKIES
      response.cookie(
        this.cookieNames.accessToken,
        newAccessToken,
        this.cookieOptions
      );
      response.cookie(
        this.cookieNames.refreshToken,
        newRefreshToken,
        this.cookieOptions
      );

      // Attach user to request
      request["user"] = refreshPayload;

      console.log("🔥 Tokens rotated automatically!");

      return true;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private extractTokens(request: Request) {
    // TypeError: Cannot read properties of undefined (reading 'talktive_access_token')
    const accessToken = request.cookies?.[this.cookieNames.accessToken];
    const refreshToken = request.cookies?.[this.cookieNames.refreshToken];

    return {
      accessToken: accessToken?.startsWith("Bearer ")
        ? accessToken.split(" ")[1]
        : accessToken,
      refreshToken: refreshToken?.startsWith("Bearer ")
        ? refreshToken.split(" ")[1]
        : refreshToken,
    };
  }
}
