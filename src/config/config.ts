interface Config {
    port: number;
    mongoUri: string;
    jwtSecret: string;
    googleClientId: string;
    googleClientSecret: string;
    frontendUrl: string;
    nodeEnv: string;
    jwtExpiresIn: string;
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
        from: string;
    };
}

const config: Config = {
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/e-africa-db',
    jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, ''),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.SMTP_FROM || 'no-reply@eafrica.ng'
    }
};

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM'
];

export const validateConfig = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate JWT secret strength (should be at least 64 characters for 512-bit)
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
        throw new Error('JWT_SECRET must be at least 64 characters (512 bits) for security');
    }
};

export default config;
