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
    console.log("Joined to room", userId);
    socket.join(userId);
  });

  socket.on("message", ({ roomId, message }) => {
    console.log({ roomId, message });
    socket.to(roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export default server;
