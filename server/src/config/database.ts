import mongoose from "mongoose";

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Database is connected");
  } catch (error) {
    console.log("Database is not connected");
  }
};

export default databaseConnection;
