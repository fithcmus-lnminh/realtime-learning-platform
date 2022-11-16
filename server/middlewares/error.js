const { API_CODE_FAIL } = require("../constants");

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (err, req, res) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    code: API_CODE_FAIL,
    message: err.message,
    data: null
  });
};
