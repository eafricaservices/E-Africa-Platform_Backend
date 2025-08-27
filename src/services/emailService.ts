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

/** Send verification code email to new users */
export const sendVerificationCodeEmail = async (
    email: string,
    verificationCode: string,
    fullName: string
): Promise<EmailResponse> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'E-Africa Platform',
                address: config.smtp.from
            },
            to: email,
            subject: 'Your Email Verification Code - E-Africa Platform',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Code</title>
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
                        .verification-code {
                            background: #f8f9ff;
                            border: 2px solid #667eea;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px;
                            margin: 25px 0;
                        }
                        .code-text {
                            font-size: 32px;
                            font-weight: bold;
                            color: #667eea;
                            letter-spacing: 8px;
                            font-family: 'Courier New', monospace;
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
                            color: #6c757d;
                            font-size: 14px;
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #dee2e6;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Email Verification</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${fullName}!</h2>
                            
                            <p>Thank you for registering with E-Africa Platform. To complete your account verification, please use the 6-digit code below:</p>
                            
                            <div class="verification-code">
                                <p><strong>Your Verification Code:</strong></p>
                                <div class="code-text">${verificationCode}</div>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul>
                                    <li>This code will expire in <strong>15 minutes</strong></li>
                                    <li>Never share this code with anyone</li>
                                    <li>If you didn't request this verification, please ignore this email</li>
                                </ul>
                            </div>
                            
                            <p>Simply enter this code on the verification page to activate your account and start exploring opportunities on E-Africa Platform.</p>
                            
                            <p>Welcome to the future of work in Africa! 🌍</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} E-Africa Platform<br>
                            This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Hello ${fullName}!
                
                Thank you for registering with E-Africa Platform.
                
                Your verification code is: ${verificationCode}
                
                This code will expire in 15 minutes.
                
                If you didn't request this verification, please ignore this email.
                
                © ${new Date().getFullYear()} E-Africa Platform
                This is an automated message, please do not reply.
            `
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Verification code email sent successfully', {
            email,
            messageId: result.messageId
        });

        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error('Error sending verification code email', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { success: false, error: 'Failed to send verification code email' };
    }
};

/** Send password reset code email */
export const sendPasswordResetCodeEmail = async (
    email: string,
    resetCode: string,
    fullName: string
): Promise<EmailResponse> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'E-Africa Platform',
                address: config.smtp.from
            },
            to: email,
            subject: 'Your Password Reset Code - E-Africa Platform',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Code</title>
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
                            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
                        .verification-code {
                            background: #fff5f5;
                            border: 2px solid #dc3545;
                            padding: 20px;
                            text-align: center;
                            border-radius: 8px;
                            margin: 25px 0;
                        }
                        .code-text {
                            font-size: 32px;
                            font-weight: bold;
                            color: #dc3545;
                            letter-spacing: 8px;
                            font-family: 'Courier New', monospace;
                        }
                        .warning {
                            background: #f8d7da;
                            border: 1px solid #f5c6cb;
                            padding: 15px;
                            border-radius: 4px;
                            margin: 15px 0;
                            color: #721c24;
                        }
                        .footer {
                            color: #6c757d;
                            font-size: 14px;
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #dee2e6;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔑 Password Reset</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${fullName}!</h2>
                            
                            <p>We received a request to reset your password for your E-Africa Platform account. Use the 6-digit code below to reset your password:</p>
                            
                            <div class="verification-code">
                                <p><strong>Your Reset Code:</strong></p>
                                <div class="code-text">${resetCode}</div>
                            </div>
                            
                            <div class="warning">
                                <strong>🛡️ Security Notice:</strong>
                                <ul>
                                    <li>This code will expire in <strong>30 minutes</strong></li>
                                    <li>Never share this code with anyone</li>
                                    <li>E-Africa Platform will never ask for your password via email</li>
                                    <li>If you didn't request this reset, please secure your account immediately</li>
                                </ul>
                            </div>
                            
                            <p>Enter this code along with your new password to complete the reset process.</p>
                            
                            <p><strong>If you didn't request this password reset, please ignore this email or contact our support team if you're concerned about your account security.</strong></p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} E-Africa Platform<br>
                            This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Hello ${fullName}!
                
                We received a request to reset your password for your E-Africa Platform account.
                
                Your password reset code is: ${resetCode}
                
                This code will expire in 30 minutes.
                
                If you didn't request this password reset, please ignore this email.
                
                © ${new Date().getFullYear()} E-Africa Platform
                This is an automated message, please do not reply.
            `
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Password reset code email sent successfully', {
            email,
            messageId: result.messageId
        });

        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error('Error sending password reset code email', {
            email,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return { success: false, error: 'Failed to send password reset code email' };
    }
};
