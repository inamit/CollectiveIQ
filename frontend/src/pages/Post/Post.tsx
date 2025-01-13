import React, { useState } from "react";
import { IconButton, Avatar, Box, Card, CardContent, Typography, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentSection from "../../components/Comment/Comment.tsx";

const PostComponent = ({ title, description, imageUrl }) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [comments, setComments] = useState([
        { username: "Jane Doe", text: "Great post!", time: "1 hour ago" },
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(title ?? "I love Alik");
    const [editableDescription, setEditableDescription] = useState(description ?? "I really love Alik");

    const handleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);
            if (disliked) {
                setDislikes(dislikes - 1);
                setDisliked(false);
            }
        } else {
            setLikes(likes - 1);
            setLiked(false);
        }
    };

    const handleDislike = () => {
        if (!disliked) {
            setDislikes(dislikes + 1);
            setDisliked(true);
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
            }
        } else {
            setDislikes(dislikes - 1);
            setDisliked(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const addComment = (newComment) => {
        setComments([...comments, newComment]);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#121212", // Dark background for the page
                minHeight: "100vh",
                padding: "32px",
                color: "#fff", // Light text
            }}
        >
            <Card
                sx={{
                    maxWidth: 800,
                    margin: "0 auto",
                    padding: 2,
                    backgroundColor: "#1e1e1e", // Dark background for the card
                    color: "#fff",
                    position: "relative",
                }}
            >
                {/* Header with Edit/Delete */}
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={toggleEditMode} sx={{"&:hover": { color: "#5B6DC9" }, color: "#fff" }}>
                            {isEditing ? <SaveIcon /> : <EditIcon />}

                    </IconButton>
                    <IconButton size="small" sx={{  "&:hover": { color: "#E57373" }, color: "#fff" }}>
                        <DeleteIcon />
                    </IconButton>
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "left",
                        mb: 2,
                    }}
                >
                    {isEditing ? (
                        <TextField
                            value={editableTitle as string}
                            onChange={(e) => setEditableTitle(e.target.value)}
                        />
                    ) : (
                        editableTitle as string
                    )}
                </Typography>

                {/* User Info */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                        src="https://via.placeholder.com/40"
                        alt="User Avatar"
                        sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                    <Box>
                        <Typography variant="body1">John Doe</Typography>
                        <Typography variant="caption">
                            2 hours ago
                        </Typography>
                    </Box>
                </Box>

                {/* Post Content */}
                <CardContent sx={{ textAlign: "left" }}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            variant="outlined"
                            value={editableDescription}
                            onChange={(e) => setEditableDescription(e.target.value)}
                            sx={{
                                backgroundColor: "#333",
                                color: "#fff",
                                "& .MuiInputBase-input": {
                                    color: "#fff",
                                },
                            }}
                        />
                    ) : (
                        <Typography variant="body2">{editableDescription as string}</Typography>
                    )}
                    {imageUrl && (
                        <Box
                            component="img"
                            src={imageUrl}
                            alt="Post"
                            sx={{
                                width: "100%",
                                borderRadius: 1,
                                marginTop: 2,
                            }}
                        />
                    )}
                </CardContent>

                {/* Actions */}
                <Box display="flex" alignItems="center" gap={2} px={2}>
                    <IconButton onClick={handleLike} sx={{ color: liked ? "#5B6DC9" : "inherit" }}>
                        {liked ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
                    </IconButton>
                    <Typography>{likes}</Typography>
                    <IconButton onClick={handleDislike} sx={{ color: disliked ? "#E57373" : "inherit" }}>
                        {disliked ? <ThumbDownAltIcon /> : <ThumbDownAltOutlinedIcon />}
                    </IconButton>
                    <Typography>{dislikes}</Typography>
                </Box>

                <Box mt={2}>
                    <Typography variant="body2" sx={{ textAlign: "left", mb: 1 }}>
                        {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                    </Typography>
                    <CommentSection comments={comments} addComment={addComment} />
                </Box>
            </Card>
        </Box>
    );
};

export default PostComponent;
