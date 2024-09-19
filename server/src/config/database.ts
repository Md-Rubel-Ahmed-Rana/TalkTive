import mongoose from "mongoose";

const databaseConnection = async (): Promise<void> => {
  console.log("Database connecting...");
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Database connected");
  } catch (error) {
    console.log("Database not connected");
  }
};

export default databaseConnection;
