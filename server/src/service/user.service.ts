import httpStatus from "http-status";
import { GetUserProperties, IUser } from "../interfaces/user.interface";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import ApiError from "../utils/apiError";
import { BcryptInstance } from "../utils/bcrypt";
import extractCloudinaryPublicId from "../utils/getCloudinaryFilePublicIdFromUrl";
import { deleteSingleFileFromCloudinary } from "../utils/deletePreviousFileFromCloudinary";

class Service {
  async register(user: IUser) {
    user.password = await BcryptInstance.hash(user.password);
    await User.create(user);
  }

  async createUser(user: IUser) {
    return await User.create(user);
  }

  async findUserById(id: string) {
    return await User.findById(id);
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email: email });
  }

  async getSingleUserInfo(id: string) {
    return await User.findById(id).select(GetUserProperties);
  }

  async getUsers() {
    const users = await User.find({}).select(GetUserProperties);
    return users;
  }

  async updateProfilePicture(id: string, imageLink: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User was not found!");
    } else {
      const publicId = extractCloudinaryPublicId(user?.image);
      if (publicId) {
        await deleteSingleFileFromCloudinary(publicId);
      }
      await User.findByIdAndUpdate(id, { $set: { image: imageLink } });
    }
  }

  async updateUserInfo(id: string, updateData: Partial<IUser>) {
    await User.findByIdAndUpdate(id, { $set: { ...updateData } });
  }

  async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await BcryptInstance.hash(newPassword);
    await User.findByIdAndUpdate(id, { $set: { password: hashedPassword } });
  }

  async getSortedUsersToChat(userId: string): Promise<IUser[]> {
    const distinctUsers = await Message.distinct("sender", {
      receiver: userId,
    });
    distinctUsers.push(
      ...(await Message.distinct("receiver", { sender: userId }))
    );

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
    const users = await User.find({ _id: { $in: distinctUsers } });

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
  }
}

export const UserService = new Service();
