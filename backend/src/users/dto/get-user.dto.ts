import { AuthProvider } from "../users.schema";

export class GetUserDTO {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  hasPassword: boolean;
  provider: AuthProvider;
  dateOfBirth?: string;
  gender?: string;
  lastLoginAt?: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}
