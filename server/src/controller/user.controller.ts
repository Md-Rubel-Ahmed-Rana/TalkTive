import { Request, Response } from "express";
import { UserService } from "../service/user.service";

const register = async (req: Request, res: Response) => {
  try {
    await UserService.register(req.body);
    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Successfully register",
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Failed to register",
      error: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const token = await UserService.login(req.body);
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Successfully logged in",
      data: token,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Failed to login",
      error: error?.message,
    });
  }
};

const auth = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const user = await UserService.auth(token);
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Authentication success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Failed to authenticate",
      data: null,
    });
  }
};

export const UserController = {
  register,
  login,
  auth,
};
