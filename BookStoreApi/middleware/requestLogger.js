const logger = require('../handlers/ErrorHandler');

module.exports = (req, res, next) => {
  logger.info({
    message: `Incoming request to ${req.method} ${req.originalUrl}`,
    method: req.method
  });
  next();
};
