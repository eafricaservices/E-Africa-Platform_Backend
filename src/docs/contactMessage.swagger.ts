/**
 * @swagger
 * /api/contact-message/submit:
 *   post:
 *     summary: Submit a contact message form
 *     tags:
 *       - Contact Message
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
 *               - message
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
 *               message:
 *                 type: string
 *                 example: I have a question about your services.
 *     responses:
 *       201:
 *         description: Contact message submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact message submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Message'
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
