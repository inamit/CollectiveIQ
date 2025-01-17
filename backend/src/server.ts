import dotenv from "dotenv";
import express, { Express } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db/db";
import cors from "cors";
import postsRoute from "./routes/posts_route";
import commentsRoute from "./routes/comments_route";
import usersRoute from "./routes/users_route";
import chatRoute from "./routes/chats_route";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import {chatSocket} from "./sockets/chat_socket";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import path from "path";

dotenv.config();

const app = express();
const httpServer = new HttpServer(app);
const io = new Server(httpServer, {path:"/socket", cors: { origin: "*" } });
chatSocket(io);

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

const initApp = async (): Promise<Express> => {
  try {
    await connectDB();
    return app;
  } catch (err) {
    throw new Error(`Error connecting to DB: ${err}`);
  }
};

export default initApp;
