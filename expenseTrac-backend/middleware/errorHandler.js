// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, {
    route: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  // Customize error responses
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
