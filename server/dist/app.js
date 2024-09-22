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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const root_routes_1 = require("./routes/root.routes");
const notFoundError_1 = __importDefault(require("./errors/notFoundError"));
const globalErrorHandler_1 = require("./errors/globalErrorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://talktive-beryl.vercel.app"],
    credentials: true,
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
app.use(root_routes_1.RootRoutes);
// 404 not found error
(0, notFoundError_1.default)(app);
// global error handler
app.use(globalErrorHandler_1.ErrorInstance.globalErrorHandler);
exports.default = server;
