import { Request, Response } from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/auth';
import logger from '../config/logger';
import config from '../config/config';
import User, { IUser } from '../model/user';

// Login with email/password
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email and ensure it's a local account
        const user = await User.findOne({ 
            email,
            provider: 'local' // Only find users who registered with email/password
        });

        if (!user) {
            // Check if user exists but used Google to sign up
            const googleUser = await User.findOne({ email, provider: 'google' });
            if (googleUser) {
                return res.status(401).json({
                    success: false,
                    message: 'This email is registered with Google. Please use Google Sign In.'
                });
            }
            
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = generateToken(user);
        console.log(token);// remove later

        // Log successful login
        logger.info('User logged in successfully', {
            userId: user.userId,
            email: user.email,
            ip: req.ip
        });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    userId: user.userId,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    isVerified: user.isVerified
                }
            }
        });
    } catch (error) {
        // Log error
        logger.error('Login error', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : null,
            ip: req.ip
        });

        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Initiate Google OAuth
export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

// Handle Google OAuth callback
export const googleCallback = (req: Request, res: Response) => {
    logger.info('Google OAuth callback initiated', {
        url: req.url,
        path: req.path,
        query: req.query,
        headers: {
            host: req.get('host'),
            referer: req.get('referer'),
            userAgent: req.get('user-agent')
        },
        ip: req.ip
    });

    passport.authenticate('google', { session: false }, async (err: any, userFromGoogle: IUser | false, info: any) => {
        if (err) {
            // Enhanced error logging with more context
            logger.error('Google OAuth callback error', {
                error: err instanceof Error ? err.message : err,
                stack: err instanceof Error ? err.stack : null,
                errorName: err instanceof Error ? err.name : 'Unknown',
                info: info,
                ip: req.ip,
                query: req.query,
                url: req.url,
                fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                headers: {
                    host: req.get('host'),
                    origin: req.get('origin'),
                    referer: req.get('referer')
                },
                troubleshooting: {
                    expectedCallbackUrl: 'http://localhost:5000/api/auth/google/callback',
                    actualRequestUrl: req.url,
                    suggestedFix: 'Check Google Console OAuth2 redirect URIs configuration'
                }
            });
            return res.redirect(`${config.frontendUrl}/auth/error?error=Google authentication failed`);
        }

        if (!userFromGoogle) {
            logger.warn('No user returned from Google OAuth', {
                ip: req.ip,
                info: info,
                query: req.query,
                url: req.url
            });
            return res.redirect(`${config.frontendUrl}/auth/error?error=Authentication failed`);
        }

        try {
            // Find or update the user in our database
            const user = await User.findOneAndUpdate(
                { userId: userFromGoogle.userId },
                { $set: { provider: 'google' } },
                { new: true }
            );

            if (!user) {
                logger.error('User not found after Google OAuth', {
                    userId: userFromGoogle.userId,
                    email: userFromGoogle.email,
                    ip: req.ip
                });
                return res.redirect(`${config.frontendUrl}/auth/error?error=User not found`);
            }

            // Generate JWT token
            const token = generateToken(user);
            console.log(token) // remove later

            logger.info('OAuth successful', {
                userId: user.userId,
                email: user.email,
                provider: 'google',
                ip: req.ip
            });

            // Redirect to frontend with token
            res.redirect(`${config.frontendUrl}/auth/success?token=${token}`);
        } catch (error) {
            logger.error('Token generation error', {
                error: error instanceof Error ? error.message : error,
                originalUserId: userFromGoogle.userId,
                ip: req.ip
            });
            return res.redirect(`${config.frontendUrl}/auth/error?error=Token generation failed`);
        }
    })(req, res);
};

// Get current authenticated user
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as IUser;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        res.json({
            success: true,
            data: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                provider: user.provider,
                isVerified: user.isVerified,
                country: user.country,
                phone: user.phone,
                linkedIn: user.linkedIn,
                desiredRole: user.desiredRole
            }
        });
    } catch (error) {
        logger.error('Get current user error', {
            error: error instanceof Error ? error.message : error,
            ip: req.ip
        });
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to get user information'
            }
        });
    }
};

// Logout user (client-side token removal)
export const logout = (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Logout successful. Please remove the token from client storage.'
    });
};

// Refresh token (generate new token for authenticated user)
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as IUser;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            data: { token },
            message: 'Token refreshed successfully'
        });
    } catch (error) {
        logger.error('Token refresh error', {
            error: error instanceof Error ? error.message : error,
            userId: (req as any).user?.userId,
            ip: req.ip
        });
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token'
        });
    }
};
