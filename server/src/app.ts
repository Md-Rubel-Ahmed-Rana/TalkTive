import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { RootRoutes } from "./routes/root.routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// health check
app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Server is working fine",
  });
});

// routes
app.use(RootRoutes);

// Connecting to Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message-room", (userId: string) => {
    socket.join(userId);
  });

  socket.on("message", (data) => {
    io.to(data.receiver.id).emit("message", data);
  });

  // calling feature
  socket.on("videoCall", (data) => {
    socket.to(data.to).emit("videoCall", data);
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export default server;
