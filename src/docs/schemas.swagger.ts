/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   
 *   schemas:
 *     EmailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the email was sent successfully
 *         messageId:
 *           type: string
 *           description: The ID of the sent email message
 *         error:
 *           type: string
 *           description: Error message if the operation failed
 *     
 *     TokenInfo:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user's ID
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         type:
 *           type: string
 *           enum: [email_verification, password_reset]
 *           description: The type of token
 *         timestamp:
 *           type: number
 *           description: Token creation timestamp
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Token expiration date and time
 *     
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         userId:
 *           type: string
 *           description: Unique user identifier
 *         fullName:
 *           type: string
 *           description: User full name
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         avatar:
 *           type: string
 *           description: User avatar URL
 *         role:
 *           type: string
 *           enum: [talent, company, admin]
 *           description: User role
 *         provider:
 *           type: string
 *           description: Authentication provider (google, local)
 *         isVerified:
 *           type: boolean
 *           description: Whether user email is verified
 *         country:
 *           type: string
 *           description: User country
 *         phone:
 *           type: string
 *           description: User phone number
 *         linkedIn:
 *           type: string
 *           description: LinkedIn profile URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         message:
 *           type: string
 *           description: Response message
 *     
 *     AuthError:
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
 *               description: Error code
 *             message:
 *               type: string
 *               description: Error message
 *     
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Company ID
 *         companyId:
 *           type: string
 *           description: Unique company identifier
 *         companyName:
 *           type: string
 *           description: Company name
 *         companyEmail:
 *           type: string
 *           format: email
 *           description: Company email
 *         companyWebsite:
 *           type: string
 *           description: Company website URL
 *         companyDescription:
 *           type: string
 *           description: Company description
 *         companyLogo:
 *           type: string
 *           description: Company logo URL
 *         companyLocation:
 *           type: string
 *           description: Company location
 *         companySize:
 *           type: string
 *           description: Company size
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Message ID
 *         messageId:
 *           type: string
 *           description: Unique message identifier
 *         senderName:
 *           type: string
 *           description: Sender name
 *         senderEmail:
 *           type: string
 *           format: email
 *           description: Sender email
 *         subject:
 *           type: string
 *           description: Message subject
 *         messageBody:
 *           type: string
 *           description: Message content
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
