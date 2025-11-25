import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register")
  async registerUser(@Body() data: any): Promise<any> {
    return this.authService.registerUser(data);
  }
}
