import React, { useEffect, useRef, useState } from "react";
import socket from "../../sockets/socket.ts";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Draggable from "react-draggable";
import User from "../../models/user.ts";
import { ChatService } from "../../services/chatService.ts";
import { useUser } from "../../context/userContext.tsx";
import { getAIResponse } from "../../services/aiService.ts";

interface IMessage {
    senderId: string;
    message: string;
    senderUserName: string;
    isAi?: boolean;
}

interface ChatBoxContainerProps {
    user: User;
    onClose: () => void;
    senderId: string;
    receiverId: string;
}

const ChatBoxComponent: React.FC<ChatBoxContainerProps> = ({
                                                               user,
                                                               onClose,
                                                               senderId,
                                                               receiverId,
                                                           }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const { setUser } = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.emit("joinRoom", senderId);

        const chatService = new ChatService(user, setUser);
        const { request } = chatService.getChatHistory(senderId, receiverId);
        request
            .then((response) => setMessages(response.data))
            .catch((err) => console.error(err));

        socket.on("receiveMessage", (message: IMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [senderId, receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            saveMessage(newMessage, user.username, false);
            setNewMessage("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    };

    const onAiResponseClicked = async () => {
        if (receiverId && messages.length) {
            const chatMessages = messages
                .map((msg) => `${msg.senderUserName}: ${msg.message}`)
                .join("\n");
            const response = await getAIResponse(chatMessages);
            saveMessage(response, "AI", true);
        }
    };

    const saveMessage = (
        messageToSave: string,
        senderUserName: string,
        isAi: boolean
    ) => {
        if (messageToSave) {
            socket.emit("sendMessage", {
                senderId,
                senderUserName,
                receiverId,
                message: messageToSave,
                isAi,
            });
            setMessages((prev) => [
                ...prev,
                { senderId, message: messageToSave, senderUserName, isAi },
            ]);
        }
    };

    return (
        <Draggable>
            <Box
                sx={{
                    position: "fixed",
                    bottom: "20px",
                    left: "230px",
                    width: "340px",
                    height: "500px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        padding: "12px 16px",
                        backgroundColor: "#5B6DC9",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {user.username}
                    </Typography>
                    <IconButton
                        size="small"
                        sx={{
                            color: "white",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                            },
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Messages */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        backgroundColor: "#F9FAFB",
                    }}
                >
                    {messages.map((msg, index) => {
                        const isSender = msg.senderId === senderId;
                        const isAIResponse = msg.isAi;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: isSender ? "flex-end" : "flex-start",
                                }}
                            >
                                <Typography
                                    sx={{
                                        backgroundColor: isAIResponse
                                            ? "#EDF4FF"
                                            : isSender
                                                ? "#5B6DC9"
                                                : "#E6E6E6",
                                        color: isSender ? "#fff" : "#333",
                                        border: isAIResponse ? "1px solid #0073e6" : "none",
                                        borderRadius: "20px",
                                        padding: "10px 16px",
                                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                                        fontSize: "0.95rem",
                                        fontStyle: isAIResponse ? "italic" : "normal",
                                        maxWidth: "75%",
                                        wordBreak: "break-word",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    {isAIResponse && (
                                        <SmartToyIcon sx={{ fontSize: 18, color: "#0073e6" }} />
                                    )}
                                    {msg.message}
                                </Typography>
                            </Box>
                        );
                    })}
                    <div ref={messagesEndRef}></div>
                </Box>

                {/* Input */}
                <Box
                    sx={{
                        padding: "12px",
                        borderTop: "1px solid #eee",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        backgroundColor: "#fff",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        size="small"
                        variant="outlined"
                        onKeyDown={handleKeyPress}
                        sx={{
                            flex: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                            },
                            "& input": {
                                padding: "10px 16px",
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        sx={{
                            borderRadius: "30px",
                            minWidth: "40px",
                            padding: "6px 14px",
                        }}
                    >
                        <SendIcon />
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onAiResponseClicked}
                        sx={{
                            borderRadius: "30px",
                            padding: "6px 14px",
                            textTransform: "none",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Ask AI
                    </Button>
                </Box>
            </Box>
        </Draggable>
    );
};

export default ChatBoxComponent;
