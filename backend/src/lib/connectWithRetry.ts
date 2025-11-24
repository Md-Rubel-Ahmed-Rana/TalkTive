/* eslint-disable prettier/prettier */
import mongoose from "mongoose";

export const connectWithRetry = async (retryCount = 5, retryDelay = 3000) => {
  console.log("📡 Database connecting...");

  return new Promise<void>((resolve, reject) => {
    const attemptConnection = (attempt: number) => {
      mongoose
        .connect(process.env.DATABASE_URL as string)
        .then(() => {
          console.log("✅ Database connected successfully");
          resolve();
        })
        .catch((err) => {
          console.error(
            `❌ Database connection failed (Attempt ${attempt}): ${err.message}`
          );

          if (attempt >= retryCount) {
            console.error(
              "⛔ Max retry attempts reached. Exiting application."
            );
            reject(err);
            process.exit(1);
          }

          console.log(`🔁 Retrying in ${retryDelay / 1000} seconds...`);
          setTimeout(() => attemptConnection(attempt + 1), retryDelay);
        });
    };

    attemptConnection(1);
  });
};
