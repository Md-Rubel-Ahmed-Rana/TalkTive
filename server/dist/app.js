"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const root_routes_1 = require("./routes/root.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://talktive-beryl.vercel.app"],
    },
});
// health check
app.get("/", (req, res) => {
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: "TalkTive server is working fine!!",
    });
});
// routes
app.use(root_routes_1.RootRoutes);
// Connecting to Socket.IO
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("message-room", (userId) => {
        socket.join(userId);
    });
    socket.on("message", (data) => {
        io.to(data.receiver.id).emit("message", data);
    });
    socket.on("callUser", (data) => {
        console.log("callUser", data);
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            to: data.userToCall,
        });
    });
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
exports.default = server;
