import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const DB_URI =
      process.env.NODE_ENV === "DEVELOPMENT"
        ? process.env.DB_LOCAL_URI
        : process.env.DB_URI;

    if (!DB_URI) {
      throw new Error(
        "Database URI is not defined. Please check your environment variables."
      );
    }
    const connection = await mongoose.connect(DB_URI);
    console.log(
      `MongoDB connected: ${connection.connection.host} (${process.env.NODE_ENV})`
    );
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// ฟังก์ชันสำหรับปิดการเชื่อมต่อฐานข้อมูล
export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
  }
};
