import express, { Express } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db/db";
import cors from "cors";
import postsRoute from "./routes/posts_route";
import commentsRoute from "./routes/comments_route";
import usersRoute from "./routes/users_route";
import chatRoute from "./routes/chats_route";
import aiRoute from "./routes/ai_routes";
import tagsRoute from "./routes/tags_route";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import posts_controller from "./controllers/posts_controller";
import authMiddleware from "./middleware/auth/authMiddleware";
import { initTagsList } from "./controllers/tags_controller";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev Assignment 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./**/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

app.use("/uploads", express.static("uploads"));
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/users", usersRoute);
app.use("/chats", chatRoute);
app.use("/ai", aiRoute);
app.use("/tags", tagsRoute);
initTagsList()
/**
 * @swagger
 * paths:
 *  /similar-posts:
 *   get:
 *     summary: Get similar posts
 *     tags:
 *      - Post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - name: title
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *      - name: content
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved similar posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Failed to retrieve similar posts
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
app.get("/similar-posts", authMiddleware, posts_controller.similarPosts);

const initApp = async (): Promise<Express> => {
  try {
    await connectDB();
    return app;
  } catch (err) {
    throw new Error(`Error connecting to DB: ${err}`);
  }
};

export default initApp;
