/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Email verification and password reset endpoints using 6-digit codes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VerificationCodeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Verification code sent successfully. Please check your email.
 *         data:
 *           type: object
 *           properties:
 *             expiresIn:
 *               type: number
 *               example: 15
 *               description: Expiration time in minutes
 *             codeLength:
 *               type: number
 *               example: 6
 *               description: Length of the verification code
 *     VerificationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: INVALID_CODE
 *             message:
 *               type: string
 *               example: Invalid verification code
 *     EmailRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *           description: User's email address
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - email
 *         - code
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *           description: User's email address
 *         code:
 *           type: string
 *           pattern: '^[0-9]{6}$'
 *           example: "123456"
 *           description: 6-digit verification code
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - email
 *         - code
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *           description: User's email address
 *         code:
 *           type: string
 *           pattern: '^[0-9]{6}$'
 *           example: "123456"
 *           description: 6-digit password reset code
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: newSecurePassword123!
 *           description: New password (minimum 8 characters)
 */

/**
 * @swagger
 * /api/verification/send-code:
 *   post:
 *     summary: Send email verification code
 *     description: Send a 6-digit verification code to the user's email address
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
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationCodeResponse'
 *       400:
 *         description: Email already verified or validation error
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
 *       500:
 *         description: Failed to send verification email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

/**
 * @swagger
 * /api/verification/verify-email:
 *   post:
 *     summary: Verify email with 6-digit code
 *     description: Verify user's email address using the 6-digit code received in email
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid code, expired code, or validation error
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

/**
 * @swagger
 * /api/verification/reset-password/request:
 *   post:
 *     summary: Request password reset code
 *     description: Send a 6-digit password reset code to the user's email address
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
 *         description: Password reset code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationCodeResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 *       500:
 *         description: Failed to send password reset email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

/**
 * @swagger
 * /api/verification/reset-password/verify:
 *   post:
 *     summary: Reset password with 6-digit code
 *     description: Reset user's password using the 6-digit code received in email
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *         description: Invalid code, expired code, or validation error
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificationError'
 */

export{}