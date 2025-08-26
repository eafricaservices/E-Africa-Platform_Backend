import { Router } from 'express';
import {
    login,
    googleAuth,
    googleCallback,
    getCurrentUser,
    logout,
    refreshToken
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Test endpoint to verify OAuth config
router.get('/test', (req, res) => {
    const config = require('../config/config').default;
    const logger = require('../config/logger').default;

    logger.info('Test endpoint accessed', {
        timestamp: new Date().toISOString(),
        ip: req.ip
    });

    res.json({
        success: true,
        message: 'Auth routes working',
        googleAuthUrl: '/api/auth/google',
        callbackUrl: '/api/auth/google/callback',
        fullCallbackUrl: `http://localhost:5000/api/auth/google/callback`,
        config: {
            googleClientIdPresent: !!config.googleClientId,
            googleClientIdPrefix: config.googleClientId ? config.googleClientId.substring(0, 10) + '...' : 'NOT_SET',
            frontendUrl: config.frontendUrl,
            nodeEnv: config.nodeEnv,
            port: config.port
        },
        instructions: {
            step1: 'Go to https://console.cloud.google.com/apis/credentials',
            step2: 'Edit your OAuth 2.0 Client',
            step3: 'Add http://localhost:5000/api/auth/google/callback to Authorized redirect URIs',
            step4: 'Save and try again'
        }
    });
});

router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/me', authenticate, getCurrentUser);
router.post('/refresh', authenticate, refreshToken);
router.post('/logout', logout);

export default router;
