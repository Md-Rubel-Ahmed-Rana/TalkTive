import httpStatus from "http-status";
import { IGetUser, IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import ApiError from "../utils/apiError";
import { BcryptInstance } from "../utils/bcrypt";
import extractCloudinaryPublicId from "../utils/getCloudinaryFilePublicIdFromUrl";
import { deleteSingleFileFromCloudinary } from "../utils/deletePreviousFileFromCloudinary";
import { ChatService } from "./chat.service";
import { Types } from "mongoose";

class Service {
  public userSanitizer(user: any): IGetUser {
    const links = user?.links?.map((link: any) => ({
      id: link?._id && String(link?._id || link?.id),
      name: link?.name,
      url: link?.url,
    }));
    return {
      id: user?._id && String(user?._id),
      name: user?.name,
      email: user?.email,
      image: user?.image,
      title: user?.title,
      about: user?.about,
      links: links,
      status: user?.status,
      lastActive: user?.lastActive,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    };
  }

  async register(user: IUser) {
    user.password = await BcryptInstance.hash(user.password);
    await User.create(user);
  }

  async createUser(newUser: IUser): Promise<IGetUser> {
    const data = await User.create(newUser);
    const user = this.userSanitizer(data);
    return user;
  }

  async findUserById(id: string): Promise<IGetUser> {
    const data = await User.findById(id);
    const user = this.userSanitizer(data);
    return user;
  }

  async findUserByEmailWithPassword(email: string) {
    return await User.findOne({ email: email });
  }

  async getSingleUserInfo(id: string) {
    const data = await User.findById(id);
    const user = this.userSanitizer(data);
    return user;
  }

  async getUsers(): Promise<IGetUser[]> {
    const usersData = await User.find({});
    const users = usersData?.map((user) => this.userSanitizer(user));
    return users;
  }
  async getUsersExceptExistingParticipants(
    chatId: Types.ObjectId
  ): Promise<IGetUser[]> {
    const chat = await ChatService.getSingleChat(chatId);

    const participantIds = chat.participants.map(
      (participant) => participant?.id
    );

    const usersData = await User.find({
      _id: { $nin: participantIds },
    });

    const users = usersData?.map((user) => this.userSanitizer(user));

    return users;
  }

  async updateProfilePicture(id: string, imageLink: string): Promise<void> {
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

  async updateUserInfo(id: string, updateData: Partial<IUser>): Promise<void> {
    await User.findByIdAndUpdate(id, { $set: { ...updateData } });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await BcryptInstance.hash(newPassword);
    await User.findByIdAndUpdate(id, { $set: { password: hashedPassword } });
  }

  async makeOnlineStatusActive(userId: Types.ObjectId) {
    console.log("Make online", userId);
    await User.findByIdAndUpdate(userId, {
      $set: { status: "online", lastActive: null },
    });
  }

  async makeOnlineStatusDeActive(userId: Types.ObjectId) {
    console.log("Make offline", userId);
    await User.findByIdAndUpdate(userId, {
      $set: { status: "offline", lastActive: new Date().toISOString() },
    });
  }
}

export const UserService = new Service();
