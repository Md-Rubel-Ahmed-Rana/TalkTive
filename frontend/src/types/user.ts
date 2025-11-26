export type IUser = {
  id: string;
  _id: string;
  name: string;
  email: string;
  password?: string;
  hasPassword?: boolean;
  profilePicture?: string;
  provider: "email" | "google" | "facebook" | "twitter";
  dateOfBirth?: Date;
  gender?: "male" | "female";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
