import winston from 'winston';
import path from 'path';

const logDir = 'logs';

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Define which logs to print in development vs production
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

// Define different formats for console and file logging
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => {
            const { timestamp, level, message, ...meta } = info;
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} ${level}: ${message} ${metaStr}`;
        }
    ),
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
);

// Define transports
const transports = [
    // Console transport for development
    new winston.transports.Console({
        level: level(),
        format: consoleFormat,
    }),
    // File transport for errors
    new winston.transports.File({
        filename: path.join(logDir, 'error.logs'),
        level: 'error',
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // File transport for all logs
    new winston.transports.File({
        filename: path.join(logDir, 'request.logs'),
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// Create the logger
const logger = winston.createLogger({
    level: level(),
    levels,
    format: fileFormat,
    transports,
    exitOnError: false,
});

// In development, we want BOTH console AND file logging
if (process.env.NODE_ENV === 'development') {
    // Clear the default console transport and add our enhanced one
    logger.transports.forEach((transport) => {
        if (transport instanceof winston.transports.Console) {
            logger.remove(transport);
        }
    });

    // Add enhanced console transport for development
    logger.add(new winston.transports.Console({
        level: 'debug',
        format: consoleFormat,
    }));
}

export default logger;
