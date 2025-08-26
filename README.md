# E-Africa Platform Backend

## Project Overview

This is the backend API for the E-Africa job board and training platform, built with Node.js, Express, TypeScript, and MongoDB. It provides comprehensive RESTful APIs for:

- 🔐 User authentication and management (with Google OAuth)
- 🏢 Company registration and management
- 💼 Job discovery and talent pool
- 📚 Training program submissions
- 📧 Contact messages and notifications
- 📱 Real-time messaging system
- 📊 Full API documentation with Swagger UI

## 🚀 Features

- **TypeScript** for type safety and better development experience
- **Express.js** web framework with modular architecture
- **MongoDB** with Mongoose ODM for data persistence
- **JWT Authentication** with Google OAuth integration
- **Email Service** with NodeMailer for notifications
- **Swagger Documentation** for interactive API testing
- **Winston Logging** for comprehensive request/error tracking
- **Form Validation** with comprehensive input sanitization
- **CORS Support** for cross-origin requests
- **Development Hot Reload** with Nodemon

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- **Git** - [Download here](https://git-scm.com/)
- **Google Cloud Console Account** (for OAuth setup)
- **Email Provider** (Gmail recommended for SMTP)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/eafricaservices/E-Africa-Platform_Backend.git
cd E-Africa-Platform_Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying from the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/e-africa-db

# JWT Configuration (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_strong_jwt_secret_here_512_bits
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development

# Email/SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=no-reply@eafrica.ng
```

### 4. Database Setup

#### Option A: Local MongoDB Installation

1. Install MongoDB Community Edition for your OS
2. Start MongoDB service:

   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs
6. Copy Client ID and Client Secret to `.env`

### 6. Email Configuration

For Gmail SMTP:

1. Enable 2FA on your Google account
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

## 🚀 Usage & Scripts

### Development Mode (with hot reload)

```bash
npm run dev
# or
npm run start:dev
```

Server will start at `http://localhost:5000` with automatic restarts on file changes.

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Build for production deployment
npm run build:prod
```

### Logging & Monitoring

```bash
# View error logs
npm run logs:error

# View request logs
npm run logs:combined

# View all logs in real-time
tail -f logs/error.logs logs/request.logs
```

## 📚 API Documentation

### Interactive Documentation

Once the server is running, access the comprehensive Swagger UI documentation:

- **Local Development**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Production**: `https://your-domain.com/api-docs`

The Swagger UI provides:

- ✅ Interactive API testing
- 📖 Complete endpoint documentation
- 🔍 Request/response schemas
- 🛠️ Example requests and responses

### Base URL

All API endpoints are prefixed with `/api`:

- **Local Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## 🔗 API Endpoints

### Authentication Endpoints

- **POST** `/api/auth/register` — Register a new user account
- **POST** `/api/auth/login` — User login with credentials
- **POST** `/api/auth/google` — Google OAuth login
- **POST** `/api/auth/refresh` — Refresh JWT token
- **POST** `/api/auth/logout` — User logout
- **POST** `/api/auth/verify-email` — Verify email address
- **POST** `/api/auth/forgot-password` — Request password reset
- **POST** `/api/auth/reset-password` — Reset password with token

### User Management

- **GET** `/api/users` — List all users (Admin only)
- **GET** `/api/users/profile` — Get current user profile
- **GET** `/api/users/:id` — Get user by ID
- **PUT** `/api/users/:id` — Update user profile
- **DELETE** `/api/users/:id` — Delete user account

### Company Management

- **POST** `/api/companies/register` — Register a new company
- **GET** `/api/companies` — List all companies (with pagination)
- **GET** `/api/companies/:id` — Get company details by ID
- **PUT** `/api/companies/:id` — Update company information
- **DELETE** `/api/companies/:id` — Delete company

### Job Discovery

- **POST** `/api/discovery/submit` — Submit a job discovery form
- **GET** `/api/discovery` — List all job discovery submissions
- **GET** `/api/discovery/:id` — Get specific discovery submission
- **PUT** `/api/discovery/:id` — Update discovery submission
- **DELETE** `/api/discovery/:id` — Delete discovery submission

### Training Programs

- **POST** `/api/trainings/submit` — Submit a training program form
- **GET** `/api/trainings` — List all training submissions
- **GET** `/api/trainings/:id` — Get specific training submission
- **PUT** `/api/trainings/:id` — Update training submission
- **DELETE** `/api/trainings/:id` — Delete training submission

### Talent Pool

- **POST** `/api/talent-pool/submit` — Submit profile to talent pool
- **GET** `/api/talent-pool` — List all talent pool submissions
- **GET** `/api/talent-pool/:id` — Get specific talent profile
- **PUT** `/api/talent-pool/:id` — Update talent profile
- **DELETE** `/api/talent-pool/:id` — Remove from talent pool

### Messaging System

- **POST** `/api/messages/send` — Send a message
- **GET** `/api/messages` — List user messages
- **GET** `/api/messages/:id` — Get specific message
- **PUT** `/api/messages/:id/read` — Mark message as read
- **DELETE** `/api/messages/:id` — Delete message

### Contact Messages

- **POST** `/api/contact-messages/submit` — Submit a contact form
- **GET** `/api/contact-messages` — List all contact messages (Admin only)
- **GET** `/api/contact-messages/:id` — Get specific contact message
- **DELETE** `/api/contact-messages/:id` — Delete contact message

### Email Verification

- **POST** `/api/verification/send` — Send verification email
- **POST** `/api/verification/verify` — Verify email token
- **POST** `/api/verification/resend` — Resend verification email

## 🔒 Authentication & Security

### JWT Token Authentication

Most endpoints require authentication via JWT tokens:

```javascript
// Include in request headers
Authorization: Bearer <your_jwt_token>
```

### Protected Routes

- All `/api/users/*` routes (except registration)
- Company management routes
- Message endpoints
- Admin-only endpoints

### Rate Limiting

API includes rate limiting to prevent abuse:

- **General requests**: 100 requests per 15 minutes
- **Authentication**: 10 requests per 15 minutes
- **Email sending**: 5 requests per hour

## 📦 Request/Response Format

### Standard Response Structure

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response Structure

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": []
  }
}
```

### Content Type

- **Requests**: `application/json`
- **Responses**: `application/json`
- **File uploads**: `multipart/form-data`

All endpoints accept and return JSON. Validation errors return HTTP 400 with detailed error information.

## 📁 Project Structure

```
E-Africa-Platform_Backend/
├── src/
│   ├── app.ts                    # Application entry point
│   ├── config/
│   │   ├── config.ts            # Environment configuration
│   │   ├── db.ts                # MongoDB connection setup
│   │   ├── logger.ts            # Winston logging configuration
│   │   ├── passport.ts          # Passport.js authentication config
│   │   └── swagger.ts           # Swagger API documentation setup
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── userController.ts    # User management
│   │   ├── companyController.ts # Company management
│   │   ├── discoveryController.ts # Job discovery
│   │   ├── trainingController.ts # Training programs
│   │   ├── talentPoolController.ts # Talent pool management
│   │   ├── messageController.ts # Messaging system
│   │   ├── contactMessageController.ts # Contact forms
│   │   └── verificationController.ts # Email verification
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── logging.ts           # Request logging middleware
│   ├── models/
│   │   ├── user.ts              # User data models
│   │   ├── companies.ts         # Company data models
│   │   ├── message.ts           # Message data models
│   │   └── types.ts             # TypeScript type definitions
│   ├── routes/
│   │   ├── index.ts             # Main router configuration
│   │   ├── auth.routes.ts       # Authentication routes
│   │   ├── user.routes.ts       # User management routes
│   │   ├── company.routes.ts    # Company routes
│   │   ├── discovery.routes.ts  # Job discovery routes
│   │   ├── training.routes.ts   # Training routes
│   │   ├── talentPool.routes.ts # Talent pool routes
│   │   ├── message.routes.ts    # Messaging routes
│   │   ├── contactMessage.routes.ts # Contact form routes
│   │   └── verification.routes.ts # Email verification routes
│   ├── helpers/
│   │   ├── utils.ts             # Utility functions
│   │   ├── emailVerification.ts # Email service helpers
│   │   ├── validateUserForm.ts  # User form validation
│   │   ├── validateCompanyForm.ts # Company form validation
│   │   ├── validateDiscoveryForm.ts # Discovery form validation
│   │   ├── validateTrainingForm.ts # Training form validation
│   │   ├── validateTalentPoolForm.ts # Talent pool validation
│   │   ├── validateMessageForm.ts # Message form validation
│   │   └── validateContactMessageForm.ts # Contact form validation
│   ├── services/
│   │   └── emailService.ts      # Email service implementation
│   └── docs/
│       ├── auth.swagger.ts      # Authentication API docs
│       ├── users.swagger.ts     # User API documentation
│       ├── companies.swagger.ts # Company API documentation
│       ├── discovery.swagger.ts # Discovery API docs
│       ├── training.swagger.ts  # Training API docs
│       ├── talentPool.swagger.ts # Talent pool API docs
│       ├── messages.swagger.ts  # Message API docs
│       ├── contactMessage.swagger.ts # Contact API docs
│       ├── verification.swagger.ts # Verification API docs
│       └── schemas.swagger.ts   # Shared schema definitions
├── logs/
│   ├── error.logs              # Error log files
│   └── request.logs            # Request log files
├── dist/                       # Compiled JavaScript output
├── .env.example               # Environment variables template
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── nodemon.json               # Nodemon configuration
└── README.md                  # Project documentation
```

## 🧪 Testing

### Manual Testing

Use the Swagger UI interface for interactive API testing:

```bash
# Start the development server
npm run dev

# Open browser and navigate to:
# http://localhost:5000/api-docs
```

### API Testing with Postman/Thunder Client

1. Import the API endpoints from Swagger documentation
2. Set up environment variables for base URL and authentication tokens
3. Test each endpoint with various input scenarios

### Example API Calls

#### User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Company Registration

```bash
curl -X POST http://localhost:5000/api/companies/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "companyName": "TechCorp Ltd",
    "industry": "Technology",
    "location": "Lagos, Nigeria",
    "description": "Leading tech company in Africa"
  }'
```

## 🚀 Deployment

### Environment Setup for Production

1. Set `NODE_ENV=production` in your environment
2. Use strong, unique values for all secrets
3. Configure production MongoDB instance
4. Set up proper SMTP service (not Gmail for production)
5. Configure proper CORS origins
6. Set up SSL/TLS certificates

### Deployment Platforms

#### Heroku

1. Create new Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to GitHub repository
4. Enable automatic deployments

#### Railway/Render

1. Connect GitHub repository
2. Configure environment variables
3. Set build and start commands
4. Deploy automatically on push

#### VPS/Dedicated Server

```bash
# Install Node.js and MongoDB
# Clone repository
git clone https://github.com/eafricaservices/E-Africa-Platform_Backend.git
cd E-Africa-Platform_Backend

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start dist/app.js --name "eafrica-backend"
pm2 startup
pm2 save
```

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list mongodb    # macOS

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/e-africa-db
```

#### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### JWT Token Issues

- Ensure `JWT_SECRET` is properly set in `.env`
- Generate new secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Check token expiration settings

#### Email Service Issues

- Verify SMTP credentials
- Enable "Less secure app access" or use App Passwords for Gmail
- Check firewall/network restrictions

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# View logs in real-time
tail -f logs/error.logs logs/request.logs
```

## 📈 Performance & Monitoring

### Performance Optimization

- Enable MongoDB indexing for frequently queried fields
- Implement Redis caching for session management
- Use compression middleware for response optimization
- Implement request rate limiting

### Monitoring & Analytics

- Winston logging for comprehensive request tracking
- Monitor API response times and error rates
- Set up health check endpoints
- Implement proper error handling and reporting

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent indentation and formatting
- Write descriptive commit messages

### Pull Request Guidelines

- Provide clear description of changes
- Include relevant issue numbers
- Ensure all tests pass
- Update documentation if needed
- Request review from maintainers

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

### Getting Help

- 📖 Check the [API Documentation](http://localhost:5000/api-docs)
- 🐛 Report issues on [GitHub Issues](https://github.com/eafricaservices/E-Africa-Platform_Backend/issues)
- 💬 Join our community discussions

### Maintainers

- **E-Africa Services Team** - [eafricaservices](https://github.com/eafricaservices)

### Links

- **Frontend Repository**: [E-Africa-Platform_Frontend](https://github.com/eafricaservices/E-Africa-Platform_Frontend)
- **Live Demo**: [https://eafrica.ng](https://eafrica.ng)
- **API Documentation**: [https://api.eafrica.ng/api-docs](https://api.eafrica.ng/api-docs)

---

**Built with ❤️ for the African tech community**
