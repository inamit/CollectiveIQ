
import { Request, Response } from "express";
import Chat from "../models/chat_model";

export const getMessages = async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
    try {
        const messages = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

