import { Request, Response } from 'express';
import User from '../model/user';
import { generateVerificationToken, generatePasswordResetToken, verifyEmailToken, verifyPasswordResetToken } from '../helpers/emailVerification';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import logger from '../config/logger';

// Send verification email
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

        const verificationToken = generateVerificationToken(user.userId, user.email);
        await sendVerificationEmail(user.email, verificationToken, user.fullName);

        logger.info('Verification email sent', {
            userId: user.userId,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });
    } catch (error) {
        logger.error('Send verification email error', {
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

// Verify email with token
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const decoded = verifyEmailToken(token);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        const user = await User.findOne({ userId: decoded.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        user.isVerified = true;
        await user.save();

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
            token: req.body.token
        });
        res.status(500).json({
            success: false,
            message: 'Email verification failed. Please try again or request a new verification link.'
        });
    }
};

// Request password reset
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

        const resetToken = generatePasswordResetToken(user.userId, user.email);
        await sendPasswordResetEmail(user.email, resetToken, user.fullName);

        logger.info('Password reset email sent', {
            userId: user.userId,
            email: user.email
        });

        res.json({
            success: true,
            message: 'Password reset email sent successfully'
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
// Update password with reset token
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'Token and new password are required'
                }
            });
        }

        // Verify the reset token
        const decoded = verifyPasswordResetToken(token);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired reset token'
                }
            });
        }

        // Find user and update password
        const user = await User.findOne({ userId: decoded.userId, email: decoded.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

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
            token: req.params.token
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
