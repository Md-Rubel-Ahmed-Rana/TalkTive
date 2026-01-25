import { Socket } from "socket.io";

export const wsAuthMiddleware = async (
  socket: Socket,
  next: (err?: any) => void
) => {
  try {
    const token = socket.handshake.auth?.token;
    console.log({
      from: "wsAuthMiddleware",
      message: "I am from wsAuthMiddleware auth token check",
      token: token,
    });

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    // TODO: Verify JWT token
    // const payload = jwt.verify(token, process.env.JWT_SECRET);

    socket.data.user = { id: 123, name: "Demo User" }; // attach user data

    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};
