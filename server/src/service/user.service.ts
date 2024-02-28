import { ILogin, IUser } from "../interfaces/user.interface";
import { sendResponse } from "../middleware/sendResponse";
import { Message } from "../models/message.model";
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
  const users = await User.find({}).select({ name: 1, image: 1, email: 1 });
  return users;
};

const getSortedUsersToChat = async (userId: string): Promise<IUser[]> => {
  // Find all distinct users the current user has communicated with
  console.log({ userId });
  const distinctUsers = await Message.distinct("sender", { receiver: userId });
  distinctUsers.push(
    ...(await Message.distinct("receiver", { sender: userId }))
  );

  // Find the latest message for each user
  const latestMessages = await Promise.all(
    distinctUsers.map(async (user) => {
      const latestMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: user },
          { sender: user, receiver: userId },
        ],
      }).sort({ createdAt: -1 });
      return latestMessage;
    })
  );

  // Sort users based on the latest message's creation date
  const users = await User.find({ _id: { $in: distinctUsers } }).select({
    name: 1,
    image: 1,
  });

  users.sort((a, b) => {
    const messageA: any = latestMessages.find(
      (message: any) =>
        message.sender.toString() === a._id.toString() ||
        message.receiver.toString() === a._id.toString()
    );
    const messageB: any = latestMessages.find(
      (message: any) =>
        message.sender.toString() === b._id.toString() ||
        message.receiver.toString() === b._id.toString()
    );
    return messageB?.createdAt - messageA?.createdAt;
  });

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
    const user = await User.findById(verifyUser?.id).select({
      name: 1,
      email: 1,
      image: 1,
    });
    return user;
  }
};

export const UserService = {
  register,
  login,
  auth,
  getUsers,
  getSortedUsersToChat,
};
