import { HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/users/users.schema";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  // inject user service
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  async registerUser(data: User): Promise<any> {
    const user = await this.usersService.create(data);

    const tokens = await this.generateTokens(user);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: { user, tokens },
    };
  }

  // generate jwt tokens (access and refresh)
  async generateTokens(
    user: any
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    };
    // expired in 3 days
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });
    // expired in 7 days
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
