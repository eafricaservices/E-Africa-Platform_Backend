import { Router } from 'express';
import {
    sendEmailVerification,
    verifyEmail,
    requestPasswordReset,
    updatePassword
} from '../controllers/verificationController';

const router = Router();

// Email verification endpoints
router.post('/send-code', sendEmailVerification);
router.post('/verify-email', verifyEmail);

// Password reset endpoints
router.post('/reset-password/request', requestPasswordReset);
router.post('/reset-password/verify', updatePassword);

export default router;
