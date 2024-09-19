import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import RootController from "./rootController";
import httpStatus from "http-status";
import { cookieManager } from "../utils/cookie";

class Controller extends RootController {
  register = this.catchAsync(async (req: Request, res: Response) => {
    await UserService.register(req.body);
    this.apiResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registration successful!",
      data: null,
    });
  });
  getUsers = this.catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getUsers();
    this.apiResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users found!",
      data: users,
    });
  });
  getSortedUsersToChat = this.catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.params.userId;
      const users = await UserService.getSortedUsersToChat(userId);
      this.apiResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users found!",
        data: users,
      });
    }
  );
  getSingleUserInfo = this.catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await UserService.getSingleUserInfo(userId);
    this.apiResponse(res, {
      statusCode: 200,
      success: true,
      message: "User info found!",
      data: user,
    });
  });
  updateProfilePicture = this.catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.params.id;
      console.log(req.body);
      await UserService.updateProfilePicture(userId, req.body.image);
      this.apiResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile picture updated!",
        data: null,
      });
    }
  );
  updateUserInfo = this.catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    await UserService.updateUserInfo(userId, req.body);
    this.apiResponse(res, {
      statusCode: 200,
      success: true,
      message: "User info updated!",
      data: null,
    });
  });
  updatePassword = this.catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    await UserService.updatePassword(userId, req.body.password);
    cookieManager.clearTokens(res);
    this.apiResponse(res, {
      statusCode: 200,
      success: true,
      message: "Your password was changed!",
      data: null,
    });
  });
}

export const UserController = new Controller();
