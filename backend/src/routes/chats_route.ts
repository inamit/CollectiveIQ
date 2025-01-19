
import express from "express";
import { getMessages } from "../controllers/chat_controller";

const router = express.Router();

router.get("/:senderId/:receiverId", getMessages);

export default router;
