import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Types } from "mongoose";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: Types.ObjectId) {
    const data = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data,
    };
  }
}
