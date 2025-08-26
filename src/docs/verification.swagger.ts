/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Email verification and password reset endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VerificationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Email verified successfully
 *     VerificationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Invalid verification token
 *     EmailRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *     PasswordUpdateRequest:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           format: password
 *           example: newSecurePassword123
 */

/**
 * @swagger
 * /api/verification/verify/{token}:
 *   get:
 *     summary: Verify email address
 *     description: Verify user's email address using the token received in email
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Email verification token received in email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationResponse'
 *       400:
 *         description: Invalid token or email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

/**
 * @swagger
 * /api/verification/send:
 *   post:
 *     summary: Request new verification email
 *     description: Send a new verification email to the user
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationResponse'
 *       400:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

/**
 * @swagger
 * /api/verification/reset-password:
 *   post:
 *     summary: Request password reset
 *     description: Send a password reset email to the user
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

/**
 * @swagger
 * /api/verification/reset-password/{token}:
 *   post:
 *     summary: Update password using reset token
 *     description: Update user's password using the token received in the password reset email
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token received in email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordUpdateRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Invalid token or missing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INVALID_TOKEN
 *                     message:
 *                       type: string
 *                       example: Invalid or expired reset token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

export {};