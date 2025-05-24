const winston = require('winston');
const path = require('path');
const { yellow, green, blue, red, white } = require('nanocolors');

// Define log file path
const logFilePath = path.join(__dirname, '..', 'logs', 'app.log');

const getMethodColor = (method) => {
  switch (method.toUpperCase()) {
    case 'GET': return yellow(method);
    case 'POST': return green(method);
    case 'PUT': return blue(method);
    case 'DELETE': return red(method);
    default: return white(method);
  }
};

// Custom format that supports method coloring on console, 
// but plain text in the log file (no colors in file)
const customFormat = winston.format.printf(({ timestamp, level, message, method }) => {
  // Color method only for console logs
  const coloredMethod = method ? getMethodColor(method) : '';
  return `${timestamp} [${level.toUpperCase()}] ${coloredMethod} ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.timestamp(),
  transports: [
    // File transport uses plain format (no colors)
    new winston.transports.File({
      filename: logFilePath,
      format: winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      }),
    }),
    // Console transport uses colorized format with method colors
    new winston.transports.Console({
      format: winston.format.combine(
        customFormat
      )
    })
  ]
});

module.exports = logger;
