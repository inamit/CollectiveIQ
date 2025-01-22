import {Server, Socket} from "socket.io";
import Chat from "../models/chat_model";

export const chatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("sendMessage", async ({senderId, senderUserName, receiverId, message, isAi}) => {
            console.log("User sent a message: to:", senderUserName, receiverId);
            const chat = new Chat({senderId, senderUserName, receiverId, message, isAi});
            await chat.save();
            console.log("saved sent a message:", message);
            io.to(receiverId).emit("receiveMessage", {senderId, senderUserName, message, isAi});
        });

        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
