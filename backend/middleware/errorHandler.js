const errorHandler = (err, req, res, next) => {
  console.error('Error occurred in request:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
      details: err.details || null
    }
  });
};

module.exports = errorHandler;
