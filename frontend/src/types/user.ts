export type IUser = {
  id: string;
  name: string;
  username: string;
  userId: string;
  phoneNumber?: string;
  profilePicture?: string;
  email: string;
  password?: string;
  hasPassword?: boolean;
  provider: "email" | "google" | "facebook" | "twitter";
  dateOfBirth?: Date;
  gender?: "male" | "female";
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
