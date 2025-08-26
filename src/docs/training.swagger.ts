/**
 * @swagger
 * /api/trainings/submit:
 *   post:
 *     summary: Submit a training form
 *     tags:
 *       - Trainings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               age:
 *                 type: integer
 *                 example: 25
 *               preferredTraining:
 *                 type: string
 *                 example: Technical Skills
 *               howDidYouHear:
 *                 type: string
 *                 example: Social Media
 *               whyJoin:
 *                 type: string
 *                 example: I want to improve my skills.
 *     responses:
 *       200:
 *         description: Form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Form submitted successfully
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

export {};
