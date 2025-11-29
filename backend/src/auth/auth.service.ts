import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/users/users.schema";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { GoogleLoginDto } from "./dto/create-google.dto";
import { ChangePasswordDto } from "./dto/password.dto";

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

  async changePassword(data: ChangePasswordDto, email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException("User was not found", HttpStatus.NOT_FOUND);
    }

    // compare old password
    const isMatched = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatched) {
      throw new HttpException(
        "Your old password is wrong. Please provide your old password to change",
        HttpStatus.BAD_REQUEST
      );
    }
    const newPassword = await bcrypt.hash(data.newPassword, this.saltOrRounds);

    await this.usersService.update(user._id, { password: newPassword });
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
