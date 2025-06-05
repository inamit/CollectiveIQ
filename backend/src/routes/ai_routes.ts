import { Router } from "express";
import { handleAIResponse } from "../controllers/ai_controller";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI responses management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AIInput:
 *       type: object
 *       required:
 *         - input
 *         - model
 *       properties:
 *         input:
 *           type: string
 *           description: The user input or answer for the AI model
 *         model:
 *           type: string
 *           description: The AI model to use (e.g. gemini, phi, mistral)
 *         parentCommentID:
 *           type: string
 *           description: (Optional) Parent comment ID for threading
 *     AIResponse:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 *           description: The AI's response
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * paths:
 *   /ai/response:
 *     post:
 *       tags:
 *         - AI
 *       summary: Get response from a configurable AI model
 *       description: Fetches a response from the specified AI model (Gemini, Phi, Mistral, etc.)
 *       operationId: getAIResponse
 *       requestBody:
 *         description: Input for the AI model
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIInput'
 *       parameters:
 *         - in: query
 *           name: post_id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the post to associate the AI response with
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AIResponse'
 *         '404':
 *           description: Post not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         '500':
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.post("/response", handleAIResponse);

export default router;