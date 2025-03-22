import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { connectDatabase, disconnectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

dotenv.config({ path: "backend/config/config.env" });

const app = express();

// Middleware
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Connect to database
connectDatabase();

// Graceful shutdown function
const gracefulShutdown = async (server) => {
  console.log("Shutting down gracefully...");

  try {
    // ปิด session กับฐานข้อมูล
    await disconnectDatabase();

    // ปิดเซิร์ฟเวอร์
    server.close(() => {
      console.log("Server shut down.");
      process.exit(0); // ปิดโปรแกรมสำเร็จ
    });
  } catch (error) {
    console.error(`Error during shutdown: ${error.message}`);
    process.exit(1); // ปิดโปรแกรมด้วยข้อผิดพลาด
  }
};

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error("Shutting down due to uncaught exception...");
  gracefulShutdown(server);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  console.error("Shutting down due to unhandled rejection...");
  gracefulShutdown(server);
});

// Handle SIGINT (e.g., Ctrl+C)
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  gracefulShutdown(server);
});
