import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import User, { IUser } from '../model/user';
import logger from './logger';
import config from './config';

// Debug: Log configuration values (without secrets)
logger.info('Passport configuration loaded', {
    googleClientId: config.googleClientId ? `${config.googleClientId.substring(0, 10)}...` : 'NOT SET',
    googleClientSecret: config.googleClientSecret ? 'SET' : 'NOT SET',
    jwtSecret: config.jwtSecret ? 'SET' : 'NOT SET',
    callbackURL: "/api/auth/google/callback",
    fullCallbackURL: `http://localhost:${config.port}/api/auth/google/callback`
});

// Validate Google OAuth configuration
if (!config.googleClientId || !config.googleClientSecret) {
    logger.error('Google OAuth configuration missing', {
        googleClientId: !!config.googleClientId,
        googleClientSecret: !!config.googleClientSecret
    });
    throw new Error('Google OAuth configuration is incomplete. Please check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

// Google OAuth Strategy with enhanced error handling
passport.use(new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        logger.info('Google OAuth callback success - tokens received', {
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName,
            accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : 'MISSING',
            refreshToken: refreshToken ? 'PRESENT' : 'MISSING',
            callbackURL: "/api/auth/google/callback",
            profileData: {
                id: profile.id,
                emails: profile.emails,
                photos: profile.photos,
                provider: profile.provider
            }
        });

        // Check if user exists by googleId or email
        let user = await User.findOne({
            $or: [
                { googleId: profile.id },
                { email: profile.emails?.[0]?.value }
            ]
        });

        if (user) {
            // Update existing user with Google data if not present
            if (!user.googleId) {
                user.googleId = profile.id;
                user.provider = 'google';
                user.isVerified = true;
                if (profile.photos?.[0]?.value) {
                    user.avatar = profile.photos[0].value;
                }
                await user.save();
            }
            logger.info('Existing user logged in', { userId: user.userId, email: user.email });
            return done(null, user);
        }

        // Create new user
        user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName || 'Unknown',
            email: profile.emails?.[0]?.value || '',
            avatar: profile.photos?.[0]?.value || '',
            provider: 'google',
            isVerified: true,
            role: 'talent',
            country: 'Unknown', // Will be updated later by user
            phone: '' // Will be updated later by user
        });

        logger.info('New user created via OAuth', { userId: user._id, email: user.email });
        return done(null, user);
    } catch (error) {
        logger.error('Google OAuth error', { error: error instanceof Error ? error.message : error });
        return done(error, false);
    }
}));

// JWT Strategy for protecting routes
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret || 'fallback'
}, async (payload: any, done: VerifiedCallback) => {
    try {
        const user = await User.findOne({ userId: payload.userId });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
