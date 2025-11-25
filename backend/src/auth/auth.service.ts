import { HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/users/users.schema";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 12;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async registerUser(data: User): Promise<any> {
    // hash password before saving
    data.password = await bcrypt.hash(data.password, this.saltOrRounds);
    const user = await this.usersService.create(data);

    const tokens = await this.generateTokens(user);
    return tokens;
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
      expiresIn: "3d",
      secret: this.configService.get<string>("JWT_SECRET"),
    });
    // expired in 7 days
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
      secret: this.configService.get<string>("JWT_SECRET"),
    });

    // return with Bearer prefix
    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }
}
