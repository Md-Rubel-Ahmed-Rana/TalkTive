import { HttpException, Injectable } from "@nestjs/common";
import { AuthProvider, User } from "./users.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GoogleLoginDto } from "src/auth/dto/create-google.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(data: User) {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new HttpException("User with this email already exists", 409);
    }
    const createdUser = await this.userModel.create(data);
    createdUser.password = undefined;
    return createdUser;
  }

  async createUserWithGoogle(data: GoogleLoginDto) {
    const isExist = await this.userModel.findOne({ email: data.email });
    if (isExist) {
      return isExist;
    }
    const payload = {
      ...data,
      provider: AuthProvider.GOOGLE,
      hasPassword: false,
      lastLoginAt: new Date(),
      isOnline: true,
    };
    return await this.userModel.create(payload);
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException("User not found", 404);
    }
    return user;
  }

  async findOne(id: Types.ObjectId) {
    return await this.userModel.findById(id).select("-password").exec();
  }

  async update(id: Types.ObjectId, data: Partial<User>) {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async toggleOnlineStatus(id: Types.ObjectId | string, isOnline: boolean) {
    return await this.userModel
      .findByIdAndUpdate(id, { isOnline }, { new: true })
      .exec();
  }
}
