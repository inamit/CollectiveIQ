import { Router } from "express";
import { handleGeminiResponse, handleFalconResponse, handleMistralResponse, handleAllResponses } from "../controllers/ai_controller";

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
 *   /ai/falcon-response:
 *     post:
 *       tags:
 *         - AI
 *       summary: Get response from Falcon AI
 *       description: Fetches a response from the Falcon AI model
 *       operationId: getFalconResponse
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
router.post("/falcon-response", handleFalconResponse);

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

/**
 * @swagger
 * paths:
 *   /ai/all-responses:
 *     post:
 *       tags:
 *         - AI
 *       summary: Get responses from all AI models
 *       description: Fetches responses from Gemini, Falcon, and Mistral AI models
 *       operationId: getAllResponses
 *       requestBody:
 *         description: Input for the AI models
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
 *                 type: object
 *                 properties:
 *                   gemini:
 *                     type: string
 *                   falcon:
 *                     type: string
 *                   mistral:
 *                     type: string
 *         '500':
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
router.post("/all-responses", handleAllResponses);

export default router;