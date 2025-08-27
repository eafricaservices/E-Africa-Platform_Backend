import { Request, Response } from 'express';
import User from '../model/user';
import { 
    generateSecureSixDigitCode, 
    generateCodeExpiration, 
    generatePasswordResetExpiration,
    isCodeExpired,
    isValidCodeFormat,
    logVerificationCodeGenerated,
    logVerificationAttempt
} from '../helpers/verificationCodes';
import { sendVerificationCodeEmail, sendPasswordResetCodeEmail } from '../services/emailService';
import logger from '../config/logger';

// Send verification email with 6-digit code
export const sendEmailVerification = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'No user found with this email address'
                }
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'ALREADY_VERIFIED',
                    message: 'Email is already verified'
                }
            });
        }

        // Generate 6-digit verification code
        const verificationCode = generateSecureSixDigitCode();
        const expirationDate = generateCodeExpiration();

        // Save code to user document
        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = expirationDate;
        await user.save();

        // Send email with verification code
        await sendVerificationCodeEmail(user.email, verificationCode, user.fullName);

        // Log for audit trail
        logVerificationCodeGenerated(user.userId, user.email, 'email');

        logger.info('Verification code sent', {
            userId: user.userId,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Verification code sent successfully. Please check your email.',
            data: {
                expiresIn: 15, // minutes
                codeLength: 6
            }
        });
    } catch (error) {
        logger.error('Send verification code error', {
            error: error instanceof Error ? error.message : error,
            email: req.body.email
        });
        res.status(500).json({
            success: false,
            error: {
                code: 'EMAIL_SEND_ERROR',
                message: 'Failed to send verification email'
            }
        });
    }
};

// Verify email with 6-digit code
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_FIELDS',
                    message: 'Email and verification code are required'
                }
            });
        }

        if (!isValidCodeFormat(code)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_CODE_FORMAT',
                    message: 'Verification code must be exactly 6 digits'
                }
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            logVerificationAttempt('unknown', email, 'email', false);
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'ALREADY_VERIFIED',
                    message: 'Email is already verified'
                }
            });
        }

        if (!user.emailVerificationCode || !user.emailVerificationExpires) {
            logVerificationAttempt(user.userId, user.email, 'email', false);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'NO_VERIFICATION_CODE',
                    message: 'No verification code found. Please request a new one.'
                }
            });
        }

        if (isCodeExpired(user.emailVerificationExpires)) {
            // Clear expired code
            user.emailVerificationCode = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            logVerificationAttempt(user.userId, user.email, 'email', false);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'CODE_EXPIRED',
                    message: 'Verification code has expired. Please request a new one.'
                }
            });
        }

        if (user.emailVerificationCode !== code) {
            logVerificationAttempt(user.userId, user.email, 'email', false);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_CODE',
                    message: 'Invalid verification code'
                }
            });
        }

        // Verification successful
        user.isVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        logVerificationAttempt(user.userId, user.email, 'email', true);

        logger.info('Email verified successfully', {
            userId: user.userId,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        logger.error('Email verification error', {
            error: error instanceof Error ? error.message : error,
            email: req.body.email
        });
        res.status(500).json({
            success: false,
            error: {
                code: 'EMAIL_VERIFICATION_ERROR',
                message: 'Email verification failed. Please try again or request a new verification code.'
            }
        });
    }
};

// Request password reset with 6-digit code
export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'No user found with this email address'
                }
            });
        }

        // Generate 6-digit password reset code
        const resetCode = generateSecureSixDigitCode();
        const expirationDate = generatePasswordResetExpiration();

        // Save code to user document
        user.passwordResetCode = resetCode;
        user.passwordResetExpires = expirationDate;
        await user.save();

        // Send email with reset code
        await sendPasswordResetCodeEmail(user.email, resetCode, user.fullName);

        // Log for audit trail
        logVerificationCodeGenerated(user.userId, user.email, 'password_reset');

        logger.info('Password reset code sent', {
            userId: user.userId,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Password reset code sent successfully. Please check your email.',
            data: {
                expiresIn: 30, // minutes
                codeLength: 6
            }
        });
    } catch (error) {
        logger.error('Password reset request error', {
            error: error instanceof Error ? error.message : error,
            email: req.body.email
        });
        res.status(500).json({
            success: false,
            error: {
                code: 'EMAIL_SEND_ERROR',
                message: 'Failed to send password reset email'
            }
        });
    }
};
// Update password with 6-digit reset code
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_FIELDS',
                    message: 'Email, verification code, and new password are required'
                }
            });
        }

        if (!isValidCodeFormat(code)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_CODE_FORMAT',
                    message: 'Reset code must be exactly 6 digits'
                }
            });
        }

        // Validate password strength (you can customize this)
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'WEAK_PASSWORD',
                    message: 'Password must be at least 8 characters long'
                }
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            logVerificationAttempt('unknown', email, 'password_reset', false);
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        if (!user.passwordResetCode || !user.passwordResetExpires) {
            logVerificationAttempt(user.userId, user.email, 'password_reset', false);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'NO_RESET_CODE',
                    message: 'No password reset code found. Please request a new one.'
                }
            });
        }

        if (isCodeExpired(user.passwordResetExpires)) {
            // Clear expired code
            user.passwordResetCode = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            logVerificationAttempt(user.userId, user.email, 'password_reset', false);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'CODE_EXPIRED',
                    message: 'Reset code has expired. Please request a new one.'
                }
            });
        }

        if (user.passwordResetCode !== code) {
            logVerificationAttempt(user.userId, user.email, 'password_reset', false);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_CODE',
                    message: 'Invalid reset code'
                }
            });
        }

        // Password reset successful
        user.password = newPassword;
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        logVerificationAttempt(user.userId, user.email, 'password_reset', true);

        logger.info('Password updated successfully', {
            userId: user.userId,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        logger.error('Password update error', {
            error: error instanceof Error ? error.message : error,
            email: req.body.email
        });
        res.status(500).json({
            success: false,
            error: {
                code: 'PASSWORD_UPDATE_ERROR',
                message: 'Failed to update password'
            }
        });
    }
};
