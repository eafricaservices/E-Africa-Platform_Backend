/**
 * @swagger
 * /api/discovery/submit:
 *   post:
 *     summary: Submit a discovery form
 *     tags:
 *       - Discovery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - companyName
 *               - industry
 *               - email
 *               - phoneNumber
 *               - areaOfInterest
 *               - description
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Smith
 *               companyName:
 *                 type: string
 *                 example: Acme Corp
 *               industry:
 *                 type: string
 *                 example: Technology
 *               email:
 *                 type: string
 *                 example: jane@acme.com
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               areaOfInterest:
 *                 type: string
 *                 enum: [Training, Hiring, Consultant, Customer Experience]
 *                 example: Training
 *               description:
 *                 type: string
 *                 example: We are looking to upskill our team in technical areas.
 *     responses:
 *       200:
 *         description: Discovery form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Discovery form submitted successfully
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
