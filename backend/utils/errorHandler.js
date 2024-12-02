class ErrorHandler extends Error {
  /**
   * Custom Error Handler
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message); // Call parent class (Error) constructor
    this.statusCode = statusCode;

    // Captures the stack trace for this error instance
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
