import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  // Default error structure
  let error = new ErrorHandler(
    err?.message || "Internal Server Error",
    err?.statusCode || 500
  );

  // Handle invalid mongoose ID error
  if (err.name === "CastError") {
    error = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  // Handle mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
    error = new ErrorHandler(message, 400);
  }
  // Handle wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }

  //Handle expired JWT Error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }

  // Send response based on environment
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // PRODUCTION mode
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
