import jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../config/logger';

interface TokenPayload {
    userId: string;
    email: string;
    type: 'email_verification' | 'password_reset';
    timestamp: number;
}

interface TokenVerificationResult {
    userId: string;
    email: string;
    type: 'email_verification' | 'password_reset';
}

/**
 * Generate an email verification token
 * @param userId - The user's UUID
 * @param email - The user's email address
 * @returns JWT token that expires in 24 hours
 */
export const generateVerificationToken = (userId: string, email: string): string => {
    const payload: TokenPayload = {
        userId,
        email,
        type: 'email_verification',
        timestamp: Date.now()
    };

    return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
};

/**
 * Generate a password reset token
 * @param userId - The user's UUID
 * @param email - The user's email address
 * @returns JWT token that expires in 30 minutes
 */
export const generatePasswordResetToken = (userId: string, email: string): string => {
    const payload: TokenPayload = {
        userId,
        email,
        type: 'password_reset',
        timestamp: Date.now()
    };

    return jwt.sign(payload, config.jwtSecret, { expiresIn: '30m' });
};

/**
 * Verify an email verification token
 * @param token - The JWT token to verify
 * @returns Token verification result or null if invalid
 */
export const verifyEmailToken = (token: string): TokenVerificationResult | null => {
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
        
        if (decoded.type !== 'email_verification') {
            logger.warn('Invalid token type for email verification', { 
                tokenType: decoded.type,
                expectedType: 'email_verification'
            });
            return null;
        }

        return {
            userId: decoded.userId,
            email: decoded.email,
            type: decoded.type
        };
    } catch (error) {
        logger.error('Email token verification failed', {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return null;
    }
};

/**
 * Verify a password reset token
 * @param token - The JWT token to verify
 * @returns Token verification result or null if invalid
 */
export const verifyPasswordResetToken = (token: string): TokenVerificationResult | null => {
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
        
        if (decoded.type !== 'password_reset') {
            logger.warn('Invalid token type for password reset', { 
                tokenType: decoded.type,
                expectedType: 'password_reset'
            });
            return null;
        }

        return {
            userId: decoded.userId,
            email: decoded.email,
            type: decoded.type
        };
    } catch (error) {
        logger.error('Password reset token verification failed', {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return null;
    }
};

export default {
    generateVerificationToken,
    generatePasswordResetToken,
    verifyEmailToken,
    verifyPasswordResetToken
};
