import { ILogin, IUser } from "../interfaces/user.interface";
import { sendResponse } from "../middleware/sendResponse";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (user: IUser) => {
  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;
  const newUser = await User.create(user);
  return newUser;
};

const getUsers = async () => {
  const users = await User.find({}).select({ name: 1, image: 1 });
  return users;
};

const login = async (credentials: ILogin) => {
  const user: any = await User.findOne({ email: credentials?.email });

  if (!user) {
    return "User not found";
  } else {
    const matchedPassword = await bcrypt.compare(
      credentials?.password,
      user?.password
    );
    if (!matchedPassword) {
      return "Invalid credentials";
    } else {
      const payload = {
        id: user?.id,
        email: user.email,
      };
      const accessToken = await jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: "3d" }
      );
      return accessToken;
    }
  }
};

const auth = async (token: string) => {
  const verifyUser: any = await jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );
  if (!verifyUser) {
    return sendResponse({
      statusCode: 400,
      success: false,
      message: "Invalid token",
      data: null,
    });
  } else {
    const user = await User.findById(verifyUser?.id);
    return user;
  }
};

export const UserService = {
  register,
  login,
  auth,
  getUsers,
};
