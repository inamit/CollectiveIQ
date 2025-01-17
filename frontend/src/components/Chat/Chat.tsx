import React, { useEffect, useState } from "react";
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
import Draggable from "react-draggable";
import User from "../../models/user.ts";
import { ChatService } from "../../services/chatService.ts";
import { useUser } from "../../context/userContext.tsx";

interface IMessage {
    senderId: string;
    message: string;
}

interface ChatBoxProps {
    user: User;
    onClose: () => void;
    senderId: string;
    receiverId: string;
}

const Chat: React.FC<ChatBoxProps> = ({
                                          user,
                                          onClose,
                                          senderId,
                                          receiverId,
                                      }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const { setUser } = useUser();

    useEffect(() => {
        socket.emit("joinRoom", senderId);

        const chatService = new ChatService(user, setUser);
        const { request } = chatService.getChatHistory(senderId, receiverId);
        request
            .then((response) => {
                setMessages(response.data);
            })
            .catch((err) => {
                console.error(err);
            });

        socket.on("receiveMessage", (message: IMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [senderId, receiverId]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit("sendMessage", {
                senderId,
                receiverId,
                message: newMessage,
            });
            setMessages((prev) => [
                ...prev,
                { senderId, message: newMessage },
            ]);
            setNewMessage("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
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
                    height: "450px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
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
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: "bold",
                            marginLeft:"10px",
                        }}
                    >
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
                        gap: "12px",
                        backgroundColor: "#F8F9FB",
                    }}
                >
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent:
                                    msg.senderId === senderId
                                        ? "flex-end"
                                        : "flex-start",
                            }}
                        >
                            <Typography
                                sx={{
                                    backgroundColor:
                                        msg.senderId === senderId
                                            ? "#5B6DC9"
                                            : "#e0e0e0",
                                    color:
                                        msg.senderId === senderId
                                            ? "#fff"
                                            : "#000",
                                    borderRadius: "16px",
                                    padding: "10px 14px",
                                    boxShadow:
                                        "0px 2px 6px rgba(0, 0, 0, 0.1)",
                                    maxWidth: "70%",
                                    wordBreak: "break-word",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {msg.message}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Input */}
                <Box
                    sx={{
                        padding: "12px",
                        borderTop: "1px solid #ddd",
                        display: "flex",
                        gap: "8px",
                        backgroundColor: "#FFF",
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        size="small"
                        onKeyDown={handleKeyPress}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        sx={{
                            minWidth: "auto",
                            padding: "8px 12px",
                            borderRadius: "8px",
                        }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            </Box>
        </Draggable>
    );
};

export default Chat;
