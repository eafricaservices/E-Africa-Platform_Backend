import nodemailer from 'nodemailer';
import logger from '../config/logger';
import config from '../config/config';

/** Email service response type */
interface EmailResponse {
    success: boolean;
    messageId?: string;
    message?: string;
    error?: string;
}

/** Configure and create nodemailer transport */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass
        },
        tls: {
            // Required for Gmail
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        }
    });
};

/** Send verification email to new users */
export const sendVerificationEmail = async (
    email: string,
    token: string,
    fullName: string
): Promise<EmailResponse> => {
    try {
        const transporter = createTransporter();
        const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;

        const mailOptions = {
            from: {
                name: 'E-Africa Platform',
                address: config.smtp.from
            },
            to: email,
            subject: 'Verify Your Email - E-Africa Platform',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            background: #ffffff;
                            padding: 30px;
                            border-radius: 0 0 8px 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .button {
                            display: inline-block;
                            background: #667eea;
                            color: white !important;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                            font-weight: bold;
                        }
                        .button:hover {
                            background: #5a6fd6;
                        }
                        .warning {
                            background: #fff3cd;
                            border: 1px solid #ffeeba;
                            padding: 15px;
                            border-radius: 4px;
                            margin: 15px 0;
                            color: #856404;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 14px;
                        }
                        .link-box {
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 4px;
                            word-break: break-all;
                            margin: 15px 0;
                            border: 1px solid #e9ecef;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚀 Welcome to E-Africa Platform!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${fullName}!</h2>
                            <p>Thank you for joining the E-Africa Platform. We're excited to have you as part of our community!</p>
                            
                            <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                            
                            <div style="text-align: center;">
                                <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong> This verification link will expire in 24 hours for security purposes.
                            </div>
                            
                            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                            <div class="link-box">
                                ${verificationUrl}
                            </div>
                            
                            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                            
                            <h3>🌍 What's Next?</h3>
                            <ul>
                                <li><strong>Explore Opportunities:</strong> Browse training programs and job opportunities</li>
                                <li><strong>Build Your Profile:</strong> Complete your profile to get personalized recommendations</li>
                                <li><strong>Connect:</strong> Join our community of talents and companies across Africa</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} E-Africa Platform. All rights reserved.</p>
                            <p>Building bridges across Africa, one connection at a time.</p>
                            <p>If you didn't create this account, please ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Hello ${fullName}!
                
                Welcome to E-Africa Platform! Thank you for joining our community.
                
                To complete your registration and activate your account, please verify your email address by clicking the following link:
                ${verificationUrl}
                
                Important: This verification link will expire in 24 hours.
                
                What's Next?
                • Explore Opportunities: Browse training programs and job opportunities
                • Build Your Profile: Complete your profile to get personalized recommendations
                • Connect: Join our community of talents and companies across Africa
                
                If you didn't create this account, please ignore this email.
                
                © ${new Date().getFullYear()} E-Africa Platform
                Building bridges across Africa, one connection at a time.
            `
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Verification email sent successfully', {
            email,
            messageId: result.messageId
        });

        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error('Error sending verification email', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { success: false, error: 'Failed to send verification email' };
    }
};

/** Send password reset email to users */
export const sendPasswordResetEmail = async (
    email: string,
    token: string,
    fullName: string
): Promise<EmailResponse> => {
    try {
        const transporter = createTransporter();
        const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

        const mailOptions = {
            from: {
                name: 'E-Africa Platform',
                address: config.smtp.from
            },
            to: email,
            subject: 'Password Reset Request - E-Africa Platform',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            background: #ffffff;
                            padding: 30px;
                            border-radius: 0 0 8px 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .button {
                            display: inline-block;
                            background: #ff6b6b;
                            color: white !important;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                            font-weight: bold;
                        }
                        .button:hover {
                            background: #ff5252;
                        }
                        .warning {
                            background: #ffe6e6;
                            border: 1px solid #ffcccc;
                            padding: 15px;
                            border-radius: 4px;
                            margin: 15px 0;
                            color: #cc0000;
                        }
                        .security {
                            background: #e7f5fe;
                            border: 1px solid #b8e3ff;
                            padding: 15px;
                            border-radius: 4px;
                            margin: 15px 0;
                            color: #0066cc;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 14px;
                        }
                        .link-box {
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 4px;
                            word-break: break-all;
                            margin: 15px 0;
                            border: 1px solid #e9ecef;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${fullName}!</h2>
                            <p>We received a request to reset the password for your E-Africa Platform account.</p>
                            
                            <p>If you requested this password reset, click the button below to set a new password:</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">🔑 Reset Password</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong> This password reset link will expire in 30 mins for security purposes.
                            </div>
                            
                            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                            <div class="link-box">
                                ${resetUrl}
                            </div>
                            
                            <div class="security">
                                <h4>🛡️ Security Tips:</h4>
                                <ul>
                                    <li>Use a strong, unique password</li>
                                    <li>Never share your login credentials</li>
                                    <li>Enable two-factor authentication if available</li>
                                    <li>Always log out from shared devices</li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} E-Africa Platform. All rights reserved.</p>
                            <p>If you didn't request this password reset, please ignore this email.</p>
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Hello ${fullName}!
                
                We received a request to reset the password for your E-Africa Platform account.
                
                If you requested this password reset, please click the following link to set a new password:
                ${resetUrl}
                
                Important: This password reset link will expire in 30 mins for security purposes.
                
                Security Tips:
                • Use a strong, unique password
                • Never share your login credentials
                • Enable two-factor authentication if available
                • Always log out from shared devices
                
                If you didn't request this password reset, please ignore this email.
                
                © ${new Date().getFullYear()} E-Africa Platform
                This is an automated message, please do not reply.
            `
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Password reset email sent successfully', {
            email,
            messageId: result.messageId
        });

        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error('Error sending password reset email', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { success: false, error: 'Failed to send password reset email' };
    }
};

/** Test the email service configuration */
export const testEmailConfig = async (): Promise<EmailResponse> => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        logger.info('Email configuration verified successfully');
        return { success: true, message: 'Email service is configured correctly' };
    } catch (error) {
        logger.error('Email configuration test failed', {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { success: false, error: 'Email service configuration failed' };
    }
};
