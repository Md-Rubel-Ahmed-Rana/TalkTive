import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { ConfigService } from "@nestjs/config";
import { ChangePasswordDto } from "./dto/password.dto";
import { User } from "src/users/users.schema";
import { GoogleLoginDto } from "./dto/create-google.dto";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
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

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post("register")
  async registerUser(
    @Body() data: any,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const { accessToken, refreshToken } =
      await this.authService.registerUser(data);
    console.log({ accessToken, refreshToken });

    res.cookie(this.cookieNames.accessToken, accessToken, this.cookieOptions);
    res.cookie(this.cookieNames.refreshToken, refreshToken, this.cookieOptions);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "User registered successfully",
    };
  }

  @Post("login")
  async loginUser(
    @Body() data: any,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const { accessToken, refreshToken } = await this.authService.loginUser(
      data.email,
      data.password
    );
    res.cookie(this.cookieNames.accessToken, accessToken, this.cookieOptions);
    res.cookie(this.cookieNames.refreshToken, refreshToken, this.cookieOptions);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User logged in successfully",
    };
  }

  @Post("google/onetap")
  async googleOneTapLogin(
    @Body("idToken") idToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } =
      await this.authService.googleOneTapLogin(idToken);

    res.cookie(this.cookieNames.accessToken, accessToken, this.cookieOptions);
    res.cookie(this.cookieNames.refreshToken, refreshToken, this.cookieOptions);

    return res.redirect(this.configService.get<string>("GOOGLE_REDIRECT_URL"));
  }

  @UseGuards(PassportAuthGuard("oauth2"))
  @Get("google/login")
  async googleLogin() {}

  @UseGuards(PassportAuthGuard("oauth2"))
  @Get("callback/google")
  async googleAuthRedirect(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = req.user;

    const { accessToken, refreshToken } =
      await this.authService.googleLogin(user);

    res.cookie(this.cookieNames.accessToken, accessToken, this.cookieOptions);
    res.cookie(this.cookieNames.refreshToken, refreshToken, this.cookieOptions);

    return res.redirect(this.configService.get<string>("GOOGLE_REDIRECT_URL"));
  }

  @UseGuards(AuthGuard)
  @Get("")
  async getProfile(@Request() req: any) {
    const data = await this.authService.getLoggedInUser(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Patch("change-password")
  async changePassword(@Request() req: any, @Body() body: ChangePasswordDto) {
    await this.authService.changePassword(body, req.user.email);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Password has been changed successfully",
      data: null,
    };
  }

  @UseGuards(AuthGuard)
  @Patch("")
  async updateUserInfo(@Request() req: any, @Body() body: User) {
    await this.authService.updateUserInfo(body, req.user.id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User profile info updated successfully",
      data: null,
    };
  }

  @Delete("logout")
  async logoutUser(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.cookieNames.accessToken, this.cookieOptions);
    res.clearCookie(this.cookieNames.refreshToken, this.cookieOptions);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    };
  }
}
