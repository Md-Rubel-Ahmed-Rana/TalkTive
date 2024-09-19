import { Request, Response } from "express";
import httpStatus from "http-status";
import RootController from "./rootController";
import { AuthService } from "../service/auth.service";
import { cookieManager } from "../utils/cookie";

class Controller extends RootController {
  auth = this.catchAsync(async (req: Request, res: Response) => {
    const id: any = req?.id;
    const result = await AuthService.auth(id);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetched  successfully",
      data: result,
    });
  });
  login = this.catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );
    cookieManager.setTokens(res, accessToken, refreshToken);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
      data: null,
    });
  });
  logout = this.catchAsync(async (req: Request, res: Response) => {
    cookieManager.clearTokens(res);
    this.apiResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logout successful",
      data: null,
    });
  });
}

export const AuthController = new Controller();
