/**
 * @swagger
 * /api/talent-pool/submit:
 *   post:
 *     summary: Submit a talent pool form
 *     tags:
 *       - Talent Pool
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - country
 *               - preference
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: janedoe@email.com
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               linkedIn:
 *                 type: string
 *                 example: https://linkedin.com/in/janedoe
 *               preference:
 *                 type: string
 *                 enum: [Remote, Hybrid, Onsite]
 *                 example: Remote
 *               desiredRole:
 *                 type: string
 *                 example: Software Engineer
 *               cvUrl:
 *                 type: string
 *                 example: https://example.com/cv.pdf
 *     responses:
 *       201:
 *         description: Talent pool form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Talent pool form submitted successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
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
