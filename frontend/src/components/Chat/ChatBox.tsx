import "./ChatBox.scss";
import React, { useEffect, useRef, useState } from "react";
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
  const { setUser } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<IMessage[]>([]); // Keeps track of messages to prevent overwriting

  useEffect(() => {
    socket.emit("joinRoom", senderId);

    const chatService = new ChatService(user, setUser);
    chatService.getChatHistory(senderId, receiverId).request
        .then((response) => {
          const sortedMessages = response.data.sort(
              (a: IMessage, b: IMessage) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sortedMessages);
          messagesRef.current = sortedMessages;
        })
        .catch((err) => console.error(err));

    socket.on("receiveMessage", (message: IMessage) => {
      setMessages((prev) => {
        const updatedMessages = [...prev, message];
        messagesRef.current = updatedMessages;
        return updatedMessages;
      });
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
      const messageToSend: IMessage = {
        senderId,
        senderUserName: user.username,
        message: newMessage,
        isAi: false,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageToSend);
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

      const placeholderMessage: IMessage = {
        senderId: "AIPlaceholder",
        message: "AI is thinking...",
        senderUserName: "AI",
        isAi: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        const response = await getAIResponse(chatMessages);

        setMessages((prev) => prev.filter((msg) => msg !== placeholderMessage));
        const aiMessage: IMessage = {
          senderId: "AI",
          senderUserName: "AI",
          message: response,
          isAi: true,
          timestamp: new Date().toISOString(),
        };

        socket.emit("sendMessage", aiMessage);
      } catch (error) {
        setMessages((prev) => prev.filter((msg) => msg !== placeholderMessage));
        toast.error("Failed to get AI response");
      }
    }
  };

  return (
    <Box className="chat-container">
      {/* Messages */}
      <Box className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSender = msg.senderId === senderId;
            const isAIResponse = msg.isAi;
            const messageType = () => {
              if (isAIResponse) {
                return "AI";
              } else if (isSender) {
                return "sender";
              } else {
                return "receiver";
              }
            };

            return (
              <Box
                key={index}
                className={`message-container message-container-${messageType()}`}
              >
                <Typography className={`message message-${messageType()}`}>
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
            );
          })
        ) : (
          <div>Start chatting now!</div>
        )}
        <div ref={messagesEndRef}></div>
      </Box>

      <Box className="input-container">
        <AppTextField
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
          className="input-button"
        >
          <SendIcon />
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={onAiResponseClicked}
          className="input-button"
        >
          Summarise with AI
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;