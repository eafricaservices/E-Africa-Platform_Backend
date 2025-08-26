import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

// Extend Request interface to store logging context
declare global {
    namespace Express {
        interface Request {
            logContext?: {
                startTime: number;
                requestId: string;
                ip: string;
                userAgent: string;
                method: string;
                endpoint: string;
            };
        }
    }
}

// Generate unique request ID
const generateRequestId = (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = generateRequestId();

    // Store context in request for later use
    req.logContext = {
        startTime,
        requestId,
        ip: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        method: req.method,
        endpoint: req.originalUrl
    };

    // Log incoming request
    logger.info('Incoming Request', {
        requestId,
        method: req.method,
        endpoint: req.originalUrl,
        ip: req.logContext.ip,
        userAgent: req.logContext.userAgent,
        body: req.method !== 'GET' ? req.body : undefined,
        query: Object.keys(req.query).length > 0 ? req.query : undefined
    });

    // Override res.json to capture response
    const originalJson = res.json;
    res.json = function (data: any) {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        // Log response based on status
        if (statusCode >= 400) {
            logger.error('Request Failed', {
                requestId,
                method: req.method,
                endpoint: req.originalUrl,
                statusCode,
                duration: `${duration}ms`,
                ip: req.logContext?.ip,
                response: data,
                error: statusCode >= 500 ? 'Server Error' : 'Client Error'
            });
        } else {
            logger.info('Request Completed', {
                requestId,
                method: req.method,
                endpoint: req.originalUrl,
                statusCode,
                duration: `${duration}ms`,
                ip: req.logContext?.ip,
                success: true
            });
        }

        return originalJson.call(this, data);
    };

    next();
};

// Validation logging helper (to be used in controllers)
export const logValidation = (req: Request, validationResult: { errors: any; isValid: boolean }, operation: string) => {
    if (!validationResult.isValid) {
        logger.warn('Validation Failed', {
            requestId: req.logContext?.requestId,
            operation,
            endpoint: req.originalUrl,
            ip: req.logContext?.ip,
            errors: validationResult.errors,
            inputData: req.body
        });
    } else {
        logger.info('Validation Passed', {
            requestId: req.logContext?.requestId,
            operation,
            endpoint: req.originalUrl,
            ip: req.logContext?.ip
        });
    }
};

// Database operation logging helper
export const logDatabaseOperation = (
    req: Request,
    operation: string,
    result: 'success' | 'error',
    data?: any,
    error?: any
) => {
    if (result === 'error') {
        logger.error('Database Operation Failed', {
            requestId: req.logContext?.requestId,
            operation,
            endpoint: req.originalUrl,
            ip: req.logContext?.ip,
            error: error?.message || error,
            stack: error?.stack
        });
    } else {
        logger.info('Database Operation Success', {
            requestId: req.logContext?.requestId,
            operation,
            endpoint: req.originalUrl,
            ip: req.logContext?.ip,
            dataType: typeof data,
            recordCount: Array.isArray(data) ? data.length : data ? 1 : 0
        });
    }
};

// Controller wrapper to maintain your clean architecture
export const withLogging = (controllerName: string, actionName: string) => {
    return (originalFunction: (req: Request, res: Response) => Promise<any>) => {
        return async (req: Request, res: Response) => {
            logger.info('Controller Action Started', {
                requestId: req.logContext?.requestId,
                controller: controllerName,
                action: actionName,
                endpoint: req.originalUrl,
                ip: req.logContext?.ip
            });

            try {
                return await originalFunction(req, res);
            } catch (error) {
                logger.error('Controller Action Failed', {
                    requestId: req.logContext?.requestId,
                    controller: controllerName,
                    action: actionName,
                    endpoint: req.originalUrl,
                    ip: req.logContext?.ip,
                    error: (error as Error).message,
                    stack: (error as Error).stack
                });

                if (!res.headersSent) {
                    return res.status(500).json({
                        message: "Internal server error",
                        requestId: req.logContext?.requestId
                    });
                }
            }
        };
    };
};
