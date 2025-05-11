import { Router } from "express";
import { handleGeminiResponse, handlePhiResponse, handleMistralResponse } from "../controllers/ai_controller";

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
 *       properties:
 *         input:
 *           type: string
 *     AIResponse:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 */

/**
 * @swagger
 * paths:
 *   /ai/gemini-response:
 *     post:
 *       tags:
 *         - AI
 *       summary: Get response from Gemini AI
 *       description: Fetches a response from the Gemini AI model
 *       operationId: getGeminiResponse
 *       requestBody:
 *         description: Input for the AI model
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIInput'
 *         required: true
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AIResponse'
 *         '500':
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.post("/gemini-response", handleGeminiResponse);

/**
 * @swagger
 * paths:
 *   /ai/phi-response:
 *     post:
 *       tags:
 *         - AI
 *       summary: Get response from Phi AI
 *       description: Fetches a response from the Phi AI model
 *       operationId: getPhiResponse
 *       requestBody:
 *         description: Input for the AI model
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIInput'
 *         required: true
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AIResponse'
 *         '500':
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.post("/phi-response", handlePhiResponse);

/**
 * @swagger
 * paths:
 *   /ai/mistral-response:
 *     post:
 *       tags:
 *         - AI
 *       summary: Get response from Mistral AI
 *       description: Fetches a response from the Mistral AI model
 *       operationId: getMistralResponse
 *       requestBody:
 *         description: Input for the AI model
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIInput'
 *         required: true
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AIResponse'
 *         '500':
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.post("/mistral-response", handleMistralResponse);

export default router;