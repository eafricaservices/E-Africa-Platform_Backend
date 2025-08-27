import crypto from 'crypto';
import logger from '../config/logger';

/**
 * Generate a 6-digit verification code
 * @returns 6-digit string code
 */
export const generateSixDigitCode = (): string => {
    // Generate a random number between 100000 and 999999
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
};

/**
 * Generate a secure 6-digit verification code using crypto
 * @returns 6-digit string code
 */
export const generateSecureSixDigitCode = (): string => {
    // Generate 3 random bytes and convert to a 6-digit code
    const randomBytes = crypto.randomBytes(3);
    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    const code = (randomNumber % 900000) + 100000;
    return code.toString();
};

/**
 * Generate expiration date for verification code (15 minutes from now)
 * @returns Date object 15 minutes in the future
 */
export const generateCodeExpiration = (): Date => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15);
    return expiration;
};

/**
 * Generate expiration date for password reset code (30 minutes from now)
 * @returns Date object 30 minutes in the future
 */
export const generatePasswordResetExpiration = (): Date => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30);
    return expiration;
};

/**
 * Check if a verification code has expired
 * @param expirationDate - The expiration date to check
 * @returns true if expired, false if still valid
 */
export const isCodeExpired = (expirationDate: Date): boolean => {
    const now = new Date();
    return now > expirationDate;
};

/**
 * Validate a 6-digit code format
 * @param code - The code to validate
 * @returns true if valid format, false otherwise
 */
export const isValidCodeFormat = (code: string): boolean => {
    // Check if it's exactly 6 digits
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
};

/**
 * Log verification code generation for security audit
 * @param userId - User ID for audit trail
 * @param email - Email for audit trail
 * @param type - Type of verification (email or password_reset)
 */
export const logVerificationCodeGenerated = (
    userId: string, 
    email: string, 
    type: 'email' | 'password_reset'
): void => {
    logger.info('Verification code generated', {
        userId,
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email for privacy
        type,
        timestamp: new Date().toISOString()
    });
};

/**
 * Log verification code verification attempt
 * @param userId - User ID for audit trail
 * @param email - Email for audit trail
 * @param type - Type of verification (email or password_reset)
 * @param success - Whether verification was successful
 */
export const logVerificationAttempt = (
    userId: string, 
    email: string, 
    type: 'email' | 'password_reset',
    success: boolean
): void => {
    logger.info('Verification code attempt', {
        userId,
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email for privacy
        type,
        success,
        timestamp: new Date().toISOString()
    });
};
