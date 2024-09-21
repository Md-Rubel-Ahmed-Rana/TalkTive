import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { RootRoutes } from "./routes/root.routes";
import handle404NotFoundError from "./errors/notFoundError";
import { ErrorInstance } from "./errors/globalErrorHandler";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://talktive-beryl.vercel.app"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://talktive-beryl.vercel.app"],
  },
});

global.io = io;

// health check
app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "TalkTive server is working fine!!",
  });
});

// routes
app.use(RootRoutes);

// 404 not found error
handle404NotFoundError(app);

// global error handler
app.use(ErrorInstance.globalErrorHandler);

export default server;
