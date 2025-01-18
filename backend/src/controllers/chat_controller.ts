
import { Request, Response } from "express";
import Chat_model from "../models/chat_model";

export const getMessages = async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
    try {
        const messages = await Chat_model.find({
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

export const saveMessage = async (senderId: string, receiverId: string, message: string) => {
    try {
        const newMessage = new Chat_model({ senderId, receiverId, message });
        await newMessage.save();
    } catch (error) {
        console.error("Error saving message:", error);
    }
};
