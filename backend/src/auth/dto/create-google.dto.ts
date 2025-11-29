export class GoogleLoginDto {
  name: string;
  email: string;
  profilePicture: string;
}

export class ChangePasswordDto {
  newPassword: string;
  oldPassword: string;
}
