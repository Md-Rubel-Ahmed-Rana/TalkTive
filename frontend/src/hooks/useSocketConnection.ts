import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const useSocketConnection = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
    };

    const onConnectError = (error: Error) => {
      console.error("⚠️ Socket connection error:", error.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);

      // Optional: disconnect only if you REALLY want to close globally
      socket.disconnect();
    };
  }, []);
};
