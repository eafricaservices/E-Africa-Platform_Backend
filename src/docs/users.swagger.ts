/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with a generated UUID
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *               - country
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               role:
 *                 type: string
 *                 enum: [talent, trainee]
 *                 example: talent
 *               age:
 *                 type: integer
 *                 example: 25
 *               linkedIn:
 *                 type: string
 *                 example: https://linkedin.com/in/johndoe
 *               desiredRole:
 *                 type: string
 *                 example: Software Engineer
 *               howDidYouHear:
 *                 type: string
 *                 example: Social Media
 *               preferredTraining:
 *                 type: string
 *                 example: Technical Skills
 *               reason:
 *                 type: string
 *                 example: I want to improve my skills.
 *               cvUrl:
 *                 type: string
 *                 example: https://example.com/cv.pdf
 *               preference:
 *                 type: string
 *                 example: Remote
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordUpdate:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           example: currentPassword123!
 *         newPassword:
 *           type: string
 *           format: password
 *           description: Must be at least 8 characters and include uppercase, lowercase, numbers, and special characters
 *           example: newSecurePassword123!
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: newSecurePassword123!
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by UUID
 *     description: Retrieve a user by their unique UUID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update user information including password
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [talent, trainee]
 *               currentPassword:
 *                 type: string
 *                 description: Required when updating password
 *               newPassword:
 *                 type: string
 *                 description: Must be at least 8 characters with uppercase, lowercase, numbers, and special characters
 *               confirmPassword:
 *                 type: string
 *                 description: Must match newPassword
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: object
 *                   properties:
 *                     currentPassword:
 *                       type: string
 *                       example: Current password is incorrect
 *                     newPassword:
 *                       type: string
 *                       example: Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters
 *                     confirmPassword:
 *                       type: string
 *                       example: Passwords do not match
 *       404:
 *         description: User not found */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted
 */

export {};
