import { HttpException, Injectable } from "@nestjs/common";
import { User } from "./users.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(data: User) {
    // check if user with the same email already exists
    const existingUser = this.userModel.findOne({ email: data.email });
    if (existingUser) {
      // http conflict exception
      throw new HttpException("User with this email already exists", 409);
    }
    return await this.userModel.create(data);
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: Types.ObjectId) {
    return await this.userModel.findById(id).exec();
  }

  async update(id: Types.ObjectId, data: Partial<User>) {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }
}
