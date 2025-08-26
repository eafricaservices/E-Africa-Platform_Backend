import { Router } from 'express';
import {
    sendEmailVerification,
    verifyEmail,
    requestPasswordReset,
    updatePassword
} from '../controllers/verificationController';


const router = Router();

// Email verification endpoints
router.post('/send', sendEmailVerification);
router.get('/verify/:token', verifyEmail);

// Password reset endpoints
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/:token', updatePassword);

export default router;
