import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Types } from "mongoose";
import { User } from "./users.schema";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: Types.ObjectId,
    @Body() updateUserDto: Partial<User>
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
