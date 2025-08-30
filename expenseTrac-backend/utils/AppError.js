class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // call parent Error constructor → sets this.message

    this.statusCode = statusCode; // e.g. 404, 500
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // mark as "trusted" error (not a bug)

    // removes constructor call from stack trace for cleaner logs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;