import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../model/user';
import logger from '../config/logger';
import config from '../config/config';

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

// Extend Express Request to use our IUser type
declare global {
    namespace Express {
        interface User extends IUser { }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'NO_TOKEN',
                message: 'Access token required'
            }
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
        const user = await User.findById(decoded.userId); if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Token verification error', {
            error: error instanceof Error ? error.message : error,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        return res.status(403).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid or expired token'
            }
        });
    }
};


// Helper function to generate JWT token
export const generateToken = (user: IUser): string => {
    return jwt.sign(
        {
            userId: user.userId, // Using the custom UUID
            email: user.email,
            role: user.role
        },
        config.jwtSecret,
        { expiresIn: '7d' }
    );
};
