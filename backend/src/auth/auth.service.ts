import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/users/users.schema";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { GoogleLoginDto } from "./dto/create-google.dto";

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 12;
  private readonly client: OAuth2Client;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.client = new OAuth2Client(
      this.configService.get<string>("GOOGLE_CLIENT_ID")
    );
  }

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

  async googleOneTapLogin(idToken: string): Promise<any> {
    if (!idToken)
      throw new HttpException("ID Token required", HttpStatus.BAD_REQUEST);

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.configService.get<string>("GOOGLE_CLIENT_ID"),
    });

    const payload = ticket.getPayload();
    if (!payload)
      throw new HttpException("Invalid Google token", HttpStatus.UNAUTHORIZED);

    const credentials = {
      email: payload.email,
      name: payload.name,
      profilePicture: payload.picture,
    } as GoogleLoginDto;
    const user = await this.usersService.createUserWithGoogle(credentials);
    return await this.generateTokens(user);
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
