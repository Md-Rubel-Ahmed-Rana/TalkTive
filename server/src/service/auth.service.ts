import httpStatus from "http-status";
import { IUser } from "../interfaces/user.interface";
import { IJwtPayload } from "../interfaces/utils";
import { JwtInstance } from "../middleware/jwt";
import { UserService } from "./user.service";
import ApiError from "../utils/apiError";
import { BcryptInstance } from "../utils/bcrypt";

class Service {
  async checkUserExistence(
    data: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const isExist = await UserService.findUserByEmail(data?.email);
    const jwtPayload: IJwtPayload = {
      id: "",
      email: "",
    };
    if (isExist) {
      jwtPayload.id = isExist.id;
      jwtPayload.email = isExist.email;
      const accessToken = await JwtInstance.generateAccessToken(jwtPayload);
      const refreshToken = await JwtInstance.generateRefreshToken(jwtPayload);
      return { accessToken, refreshToken };
    } else {
      const result = await UserService.createUser(data);
      jwtPayload.id = result?._id;
      jwtPayload.email = result?.email;
      const accessToken = await JwtInstance.generateAccessToken(jwtPayload);
      const refreshToken = await JwtInstance.generateRefreshToken(jwtPayload);
      return { accessToken, refreshToken };
    }
  }
  async auth(id: string) {
    const user = await UserService.findUserById(id);
    return user;
  }
  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const isExist = await UserService.findUserByEmail(email);
    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    const isMatchedPassword = await BcryptInstance.compare(
      password,
      isExist?.password
    );
    if (!isMatchedPassword) {
      throw new ApiError(401, "Incorrect password");
    }

    const jwtPayload = {
      id: isExist?._id,
      email: isExist?.email,
    };

    const accessToken = await JwtInstance.generateAccessToken(jwtPayload);
    const refreshToken = await JwtInstance.generateRefreshToken(jwtPayload);

    return { accessToken, refreshToken };
  }
}

export const AuthService = new Service();
