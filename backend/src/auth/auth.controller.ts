import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  // cookie config
  private readonly cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };

  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async registerUser(
    @Body() data: any,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const { accessToken, refreshToken } =
      await this.authService.registerUser(data);
    console.log({ accessToken, refreshToken });

    res.cookie("talktive_access_token", accessToken, this.cookieOptions);
    res.cookie("talktive_refresh_token", refreshToken, this.cookieOptions);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "User registered successfully",
    };
  }
}
