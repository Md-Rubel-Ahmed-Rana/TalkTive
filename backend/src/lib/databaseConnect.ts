import mongoose from "mongoose";

export const databaseConnect = async () => {
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Database disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 Database reconnected");
  });

  mongoose.connection.on("timeout", () => {
    console.error("⏳ Database connection timeout");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Database error:", err.message);
  });
};
