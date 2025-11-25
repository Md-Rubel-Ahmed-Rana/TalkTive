import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/users/users.schema";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";

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

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async getLoggedInUser(userId: string): Promise<any> {
    const user = await this.usersService.findOne(new Types.ObjectId(userId));
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data: user,
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
