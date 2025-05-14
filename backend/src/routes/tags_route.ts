import express from "express";

const router = express.Router();
import tagsController from "../controllers/tags_controller";
import authMiddleware from "../middleware/auth/authMiddleware";

/**
 * @swagger
 * tags:
 *  name: tag
 * description: tags management
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    tag:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          minLength: 24
 *          maxLength: 24
 *        name:
 *          type: string
 *          description: must be unique
 *        bestAi:
 *          type: string
 *        numOfPosts:
 *          type: number
 *        __v:
 *          type: integer
 *    tagInput:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 */

/**
 * @swagger
 * paths:
 *  /tags:
 *   get:
 *     tags:
 *       - tag
 *     security:
 *       - bearerAuth: []
 *     summary: Get all tags
 *     description: Get all tags from the database
 *     operationId: getAlltags
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tag'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/", tagsController.getAllTags);

router.post("/init", authMiddleware, tagsController.createTagsFromEnv);
export default router;