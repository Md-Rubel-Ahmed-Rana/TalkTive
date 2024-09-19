import { Server as SocketIOServer } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null | any;
      images: Express.Multer.File[] | string[];
      image: Express.Multer.File | string;
      files: Express.Multer.File[] | string[];
      file: Express.Multer.File | string;
      id: string;
      email: string;
      role: string;
      link: string;
      links: string[];
    }
  }
  var io: SocketIOServer;
}
