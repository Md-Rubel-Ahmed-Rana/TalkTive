import dotenv from "dotenv";
dotenv.config();
export const config = {
  db: {
    url: process.env.DATABASE_URL as string,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL as string,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL as string,
    appUser: process.env.GOOGLE_APP_USER as string,
    appPass: process.env.GOOGLE_APP_PASSWORD as string,
  },
  app: {
    port: Number(process.env.PORT) || (5000 as number),
    environment: process.env.NODE_ENV as string,
    frontendDomain: process.env.FRONTEND_DOMAIN as string,
  },
  cloudinary: {
    cloudinaryApi: process.env.CLOUDINARY_API as string,
    cloudinaryName: process.env.CLOUDINARY_API_NAME as string,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudinarySecretKey: process.env.CLOUDINARY_API_SECRET as string,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    accessTokenExpired: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    refreshTokenExpired: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
  },
};
