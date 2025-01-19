import React, {useEffect, useRef, useState} from "react";
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
import {ChatService} from "../../services/chatService.ts";
import {useUser} from "../../context/userContext.tsx";
import {getAIResponse} from "../../services/aiService.ts";

interface IMessage {
    senderId: string;
    message: string;
    senderUserName:string
    isAi?: boolean;
}

interface ChatBoxProps {
    user: User;
    onClose: () => void;
    senderId: string;
    receiverId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
                                             user,
                                             onClose,
                                             senderId,
                                             receiverId,
                                         }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const {setUser} = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.emit("joinRoom", senderId);

        const chatService = new ChatService(user, setUser);
        const {request} = chatService.getChatHistory(senderId, receiverId);
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            saveMessage(newMessage, user.username,false);
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

            saveMessage(response, "AI",true);
        }
    };

    const saveMessage = (messageToSave: string,senderUserName:string ,isAi: boolean) => {
        if (messageToSave) {
            socket.emit("sendMessage", {
                senderId,
                receiverId,
                message: messageToSave,
                isAi: isAi,
            });
            setMessages((prev) => [
                ...prev,
                {senderId, message: messageToSave,senderUserName, isAi},
            ]);
        }
    }

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
                    zIndex:"1000"
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
                            marginLeft: "10px",
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
                        <CloseIcon/>
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
                    {messages.map((msg, index) => {
                        const isSender = msg.senderId === senderId;
                        const isAIResponse = msg.isAi;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        msg.isAi ? "flex-start" : isSender ? "flex-end" : "flex-start",
                                }}
                            >
                                <Typography
                                    sx={{
                                        backgroundColor: msg.isAi ? "#F1F8FF" : isSender
                                            ? "#5B6DC9"
                                            : "#e0e0e0",
                                        color: msg.isAi ? "#0073e6" : isSender
                                            ? "#fff"
                                            : "#000",
                                        border: isAIResponse ? "1px solid #0073e6" : "none",
                                        borderRadius: "16px",
                                        padding: "10px 14px",
                                        boxShadow:
                                            "0px 2px 6px rgba(0, 0, 0, 0.1)",
                                        marginLeft: msg.isAi ? "16px" : isSender ? "auto" : "16px",
                                        marginRight: msg.isAi ? "auto" : isSender ? "16px" : "auto",
                                        marginTop: "4px",
                                        maxWidth: "70%",
                                        wordBreak: "break-word",
                                        fontSize: "0.9rem",
                                        fontStyle: isAIResponse ? "italic" : "normal",
                                    }}
                                >
                                    {isAIResponse && (
                                        <SmartToyIcon
                                            sx={{
                                                marginRight: "8px",
                                                color: "#0073e6",
                                            }}
                                        />
                                    )}
                                    {msg.message}
                                </Typography>
                            </Box>
                        )
                    })}
                    <div ref={messagesEndRef}></div>
                </Box>

                {/* Input */}
                <Box
                    sx={{
                        padding: "12px",
                        borderTop: "1px solid #ddd",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        backgroundColor: "#FFF",
                        flexWrap: "wrap",
                    }}
                >
                    {/* TextField */}
                    <TextField
                        fullWidth
                        label="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        size="small"
                        onKeyDown={handleKeyPress}
                        sx={{
                            flex: 1,
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
                            padding: "8px 16px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <SendIcon/>
                    </Button>

                    {/* Ask AI Button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onAiResponseClicked}
                        sx={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Ask AI
                    </Button>
                </Box>
            </Box>
        </Draggable>
    );
};

export default ChatBox;
