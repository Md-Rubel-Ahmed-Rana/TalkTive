import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google",
  FACEBOOK = "facebook",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: true })
  hasPassword: boolean;

  @Prop({ default: null })
  profilePicture: string;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.EMAIL,
  })
  provider: AuthProvider;

  @Prop()
  dateOfBirth?: string; //  DD-MM-YYYY

  @Prop({
    type: String,
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
