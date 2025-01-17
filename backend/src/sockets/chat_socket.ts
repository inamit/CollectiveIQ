import { Server, Socket } from "socket.io";
import Chat from "../models/chat";

export const chatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        socket.on("sendMessage", async ({ sender, receiver, message }) => {
            const chat = new Chat({ sender, receiver, message });
            await chat.save();
            io.to(receiver).emit("receiveMessage", { sender, message });
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
