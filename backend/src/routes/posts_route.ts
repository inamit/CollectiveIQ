import { Router } from "express";
const router: Router = Router();
import postsController from "../controllers/posts_controller";
import authMiddleware from "../middleware/auth/authMiddleware";
import { userPostsUpload } from "../middleware/file-storage/file-storage-middleware";

/**
 * @swagger
 * tags:
 *  name: Post
 * description: Posts management
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Post:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  minLength: 24
 *                  maxLength: 24
 *              content:
 *                  type: string
 *              userId:
 *                  type: string
 *              __v:
 *                  type: integer
 *      PostInput:
 *          type: object
 *          required:
 *              - content
 *              - userId
 *          properties:
 *              content:
 *                  type: string
 *  requestBodies:
 *      Post:
 *          description: Post object input
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PostInput'
 */

/**
 * @swagger
 * paths:
 *  /posts:
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Get all posts
 *     description: Get all posts from the database
 *     operationId: getAllPosts
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/", postsController.getPosts);

/**
 * @swagger
 * paths:
 *  /posts:
 *   post:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Add a new post
 *     description: Add a new post
 *     operationId: addPost
 *     requestBody:
 *       description: Create a new post
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.post(
  "/",
  authMiddleware,
  userPostsUpload.single("file"),
  postsController.saveNewPost
);

/**
 * @swagger
 * paths:
 *  /posts/{postId}:
 *   delete:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a post
 *     description: Deletes a post by ID
 *     operationId: deletePost
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to delete
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.delete("/:post_id", authMiddleware, postsController.deletePostById);

/**
 * @swagger
 * paths:
 *  /posts/{postId}:
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Get post by postID
 *     description: Returns a single post
 *     operationId: getPostByID
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/:post_id", postsController.getPostById);

/**
 * @swagger
 * paths:
 *  /posts/{postId}:
 *   put:
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []
 *     summary: Updates the entire post with form data
 *     operationId: updatePost
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     requestBody:
 *       description: Post updated data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Missing required parameters
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.put(
  "/:post_id",
  authMiddleware,
  userPostsUpload.single("file"),
  postsController.updatePostById
);

/**
 * @swagger
 * paths:
 *  /posts/image:
 *   post:
 *     summary: Upload a pic for post
 *     tags:
 *      - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/PostInput'
 *              - required:
 *                  - file
 *              - properties:
 *                  file:
 *                    type: string
 *                    format: binary
 *     responses:
 *       200:
 *         description: Post uploaded successfully
 *       500:
 *         description: failed to upload
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post(
  "/image",
  authMiddleware,
  userPostsUpload.single("file"),
  postsController.saveImage
);

/**
 * @swagger
 * paths:
 *  /posts/{postId}/like:
 *   post:
 *     summary: Like or unlike a post
 *     tags:
 *      - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/PostInput'
 *              - required:
 *                  - postId
 *              - properties:
 *                  postId:
 *                    type: string
 *     responses:
 *       200:
 *         description: like to a post uploaded successfully
 *       500:
 *         description: failed to upload
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/:itemId/like", authMiddleware, postsController.likePost);

/**
 * @swagger
 * paths:
 *  /posts/{postId}/dislike:
 *   post:
 *     summary: Dislike or un-dislike a post
 *     tags:
 *      - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/PostInput'
 *              - required:
 *                  - postId
 *              - properties:
 *                  postId:
 *                    type: string
 *     responses:
 *       200:
 *         description: dislike to a post uploaded successfully
 *       500:
 *         description: failed to upload
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/:itemId/dislike", authMiddleware, postsController.dislikePost);

router.get("/:userId/liked-posts", authMiddleware, postsController.getLikedPosts);

/**
 * @swagger
 * paths:
 *  /posts/close:
 *   post:
 *     summary: close post 
 *     tags:
 *      - Post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/PostInput'
 *              - required:
 *                  - postId
 *                  - answerId
 *              - properties:
 *                  postId:
 *                    type: string
 *                  answerId:
 *                    type: string
 *     responses:
 *       200:
 *         description: dislike to a post uploaded successfully
 *       500:
 *         description: failed to upload
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post("/close", authMiddleware, postsController.closePost);
export default router;
