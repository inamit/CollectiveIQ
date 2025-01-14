import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentSection from "../../components/Comment/Comment.tsx";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/userContext.tsx";
import usePost from "../../hooks/usePost.ts";
import Post from "../../models/post.ts";
import { CommentsService } from "../../services/commentsService.ts";
import UserAvatar from "../../components/UserAvatar/UserAvatar.tsx";

const PostComponent = () => {
  const { postId } = useParams();
  const { user, setUser } = useUser();
  const { post } = usePost(postId);
  const [editablePost, setEditablePost] = useState<Partial<Post> | null>(post);

  useEffect(() => {
    setEditablePost(post);
  }, [post]);

  const handleInputChange = (field: string, value: string) => {
    setEditablePost({ ...editablePost, [field]: value });
  };

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    if (post && user) {
      setLiked(post.likes.includes(user._id));
      setDisliked(post.dislikes.includes(user._id));
    }
  }, [post?.likes, post?.dislikes]);

  const [isEditing, setIsEditing] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      if (disliked) {
        setDisliked(false);
      }
    } else {
      setLiked(false);
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      setDisliked(true);
      if (liked) {
        setLiked(false);
      }
    } else {
      setDisliked(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const addComment = (content: string) => {
    const commentService = new CommentsService(user!, setUser);
    commentService.saveNewComment(content, postId!);
    // setComments([...comments, newComment]);
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
        {post?.userId._id === user?._id ? (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={toggleEditMode}
              sx={{ "&:hover": { color: "#5B6DC9" }, color: "#fff" }}
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
            <IconButton
              size="small"
              sx={{ "&:hover": { color: "#E57373" }, color: "#fff" }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <div></div>
        )}

        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            mb: 2,
          }}
        >
          {isEditing ? (
            <TextField
              value={editablePost?.title as string}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          ) : (
            (editablePost?.title as string)
          )}
        </Typography>

        {/* User Info */}
        <Box display="flex" alignItems="center" mb={2}>
          <UserAvatar user={post?.userId} className="user-avatar" />
          <Box display="flex" alignItems="start" flexDirection="column">
            <Typography variant="body1">{post?.userId?.username}</Typography>
            <Typography variant="caption">2 hours ago</Typography>
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
              value={editablePost?.content as string}
              onChange={(e) => handleInputChange("content", e.target.value)}
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                "& .MuiInputBase-input": {
                  color: "#fff",
                },
              }}
            />
          ) : (
            <Typography variant="body2">
              {editablePost?.content as string}
            </Typography>
          )}
          {post?.imageUrl && (
            <Box
              component="img"
              src={post?.imageUrl}
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
          <IconButton
            onClick={handleLike}
            sx={{ color: liked ? "#5B6DC9" : "inherit" }}
          >
            {liked ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
          </IconButton>
          <Typography>{post?.likes.length}</Typography>
          <IconButton
            onClick={handleDislike}
            sx={{ color: disliked ? "#E57373" : "inherit" }}
          >
            {disliked ? <ThumbDownAltIcon /> : <ThumbDownAltOutlinedIcon />}
          </IconButton>
          <Typography>{post?.dislikes.length}</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" sx={{ textAlign: "left", mb: 1 }}>
            {post?.comments.length} Comment
            {post?.comments.length !== 1 ? "s" : ""}
          </Typography>
          <CommentSection comments={post?.comments} addComment={addComment} />
        </Box>
      </Card>
    </Box>
  );
};

export default PostComponent;
