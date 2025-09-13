import { Server, Socket } from "socket.io";
import Chat from "../models/chat_model";
import mongoose from "mongoose";

export const chatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("sendMessage", async ({ senderId, senderUserName, receiverId, message, isAi }) => {
            console.log(`User ${senderUserName} sent a message: to:`, receiverId);
            const chat = new Chat({ senderId, senderUserName, receiverId, message, isAi, isRead: false });
            await chat.save();

            // Emit the message to the receiver's room
            io.to(receiverId).emit("receiveMessage", { senderId, senderUserName, message, isAi });

            // Calculate and emit the updated unread count to the receiver
            const unreadCount = await Chat.countDocuments({ receiverId, isRead: false });
            io.to(receiverId).emit("unreadCount", { unreadCount });
        });

        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });

        socket.on("typing", (data: { senderId: string; receiverId: string; senderUserName: string }) => {
            const { senderId, receiverId, senderUserName } = data;
            socket.to(receiverId).emit("typing", { senderId, senderUserName });
        });

        socket.on("stoppedTyping", (data: { senderId: string; receiverId: string; senderUserName?: string }) => {
            const { senderId, receiverId } = data;
            socket.to(receiverId).emit("stoppedTyping", { senderId });
        });

        socket.on("markAsRead", async ({ userId, fromUserId }) => {
            await Chat.updateMany({ receiverId: userId, senderId: fromUserId, isRead: false }, { $set: { isRead: true } });
            const unreadCount = await Chat.countDocuments({ receiverId: userId, isRead: false });
            // Emit the updated unread count to the user who marked messages as read
            io.to(userId).emit("unreadCount", { unreadCount });
        });

        socket.on("getUnreadCount", async ({ userId, fromUserId }) => {
            const unreadCount = await Chat.countDocuments({ receiverId: userId, senderId: fromUserId, isRead: false });
            socket.emit("unreadCount", { fromUserId, unreadCount });
        });
    });
};