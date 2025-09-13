import React, { useEffect, useRef, useState } from "react";
import "./ChatBox.scss";
import socket from "../../sockets/socket.ts";
import { Box, Button, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import User from "../../models/user.ts";
import { ChatService } from "../../services/chatService.ts";
import { useUser } from "../../context/userContext.tsx";
import { getAIResponse } from "../../services/aiService.ts";
import IMessage from "../../models/chat.ts";
import AppTextField from "../TextField/TextField.tsx";
import { toast } from "react-toastify";

interface ChatBoxProps {
    user: User;
    senderId: string;
    receiverId: string;
}
const ChatBox = ({ user, senderId, receiverId }: ChatBoxProps) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const { setUser } = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.emit("joinRoom", senderId);

        const chatService = new ChatService(user, setUser);
        const { request } = chatService.getChatHistory(senderId, receiverId);
        request
            .then((response) => {
                setMessages(response.data);
                socket.emit("markAsRead", { userId: senderId, fromUserId: receiverId });
            })
            .catch((err) => console.error(err));

        socket.on("receiveMessage", (message: IMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("typing", (data: { senderId: string; senderUserName: string }) => {
            if (data.senderId === receiverId) {
                setTypingUser(data.senderUserName);
            }
        });

        socket.on("stoppedTyping", (data: { senderId: string }) => {
            if (data.senderId === receiverId) {
                setTypingUser(null);
            }
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("typing");
            socket.off("stoppedTyping");
        };
    }, [senderId, receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            saveMessage(newMessage, user.username, false);
            setNewMessage("");
            socket.emit("stoppedTyping", { senderId, receiverId });
            setTypingUser(null);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleInputChange = (value: string) => {
        setNewMessage(value);
        if (value.length > 0) {
            socket.emit("typing", { senderId, receiverId, senderUserName: user.username });
        } else {
            socket.emit("stoppedTyping", { senderId, receiverId });
        }
    };

    const onAiResponseClicked = async () => {
        if (receiverId && messages.length) {
            const chatMessages = messages.map((msg) => `${msg.senderUserName}: ${msg.message}`).join("\n");
            const placeholderMessage = {
                senderId: "AIPlaceholder",
                message: "AI is thinking...",
                senderUserName: "AI",
                isAi: true,
                timestamp: new Date().toISOString(),
            };
            setMessages([...messages, placeholderMessage]);

            try {
                const response = await getAIResponse(chatMessages);
                setMessages((prev) => prev.filter((msg) => msg !== placeholderMessage));
                saveMessage(response, "AI", true);
            } catch (error) {
                setMessages((prev) => prev.filter((msg) => msg !== placeholderMessage));
                toast.error("There is a temporary issue with the AI. Please try again later.");
            }
        }
    };

    const saveMessage = (messageToSave: string, senderUserName: string, isAi: boolean) => {
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
                { senderId, message: messageToSave, senderUserName, isAi, timestamp: new Date().toISOString() },
            ]);
        }
    };

    return (
        <Box className="chat-container">
            <Box className="messages-container">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isSender = msg.senderId === senderId;
                        const isAIResponse = msg.isAi;
                        const messageType = isAIResponse ? "AI" : isSender ? "sender" : "receiver";

                        return (
                            <Box key={index} className={`message-container message-container-${messageType}`}>
                                <Typography className={`message message-${messageType}`}>
                                    {isAIResponse && <SmartToyIcon sx={{ marginRight: "8px", color: "#0073e6" }} />}
                                    {msg.message}
                                </Typography>
                            </Box>
                        );
                    })
                ) : (
                    <div>Start chatting now!</div>
                )}

                <div ref={messagesEndRef}></div>
                {typingUser && (
                    <Typography
                        variant="caption"
                        sx={{ marginLeft: "6px", color: "#666", marginBottom: "4px" }}
                    >
                        {typingUser} is typing...
                    </Typography>
                )}

            </Box>

            <Box className="input-container">
                <AppTextField
                    fullWidth
                    label="Type a message..."
                    value={newMessage}
                    onChange={(e) => handleInputChange(e.target.value)}
                    size="small"
                    onKeyDown={handleKeyPress}
                    sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                        },
                    }}
                />
                <Button variant="contained" color="primary" onClick={sendMessage} className="input-button">
                    <SendIcon />
                </Button>
                <Button variant="contained" color="secondary" onClick={onAiResponseClicked} className="input-button">
                    Summarise with AI
                </Button>
            </Box>
        </Box>
    );
};

export default ChatBox;