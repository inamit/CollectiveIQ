import { useEffect, useState } from "react";
import { IconButton, Box, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentSection from "../../components/Comment/Comment.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/userContext.tsx";
import usePost from "../../hooks/usePost.ts";
import Post from "../../models/post.ts";
import { CommentsService } from "../../services/commentsService.ts";
import UserAvatar from "../../components/UserAvatar/UserAvatar.tsx";
import { toast } from "react-toastify";
import AppTextField from "../../components/TextField/TextField.tsx";
import { PostsService } from "../../services/postsService.ts";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { routes } from "../../router/routes.ts";

const PostComponent = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { post, comments, setComments } = usePost(postId);
  const [editablePost, setEditablePost] = useState<Partial<Post> | null>(post);

  const MySwal = withReactContent(Swal);

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
    const { request } = commentService.saveNewComment(content, postId!);

    request
      .then((response) => {
        setComments([...comments, response.data]);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add comment");
      });
  };

  const deletePost = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { request } = new PostsService(user!, setUser).deletePost(postId!);
      request.then(() => {
        navigate(routes.USER_PROFILE);
      });
    }
  };

  const getEditButtons = () => {
    if (user?._id === post?.userId._id) {
      return (
        <Box
          sx={{
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
            onClick={deletePost}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    }
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
        }}
      >
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isEditing ? (
            <AppTextField
              fullWidth
              value={editablePost?.title as string}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          ) : (
            <Typography
              variant="h5"
              sx={{
                textAlign: "left",
              }}
            >
              {editablePost?.title as string}
            </Typography>
          )}

          {getEditButtons()}
        </div>

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
            <AppTextField
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              value={editablePost?.content as string}
              onChange={(e) => handleInputChange("content", e.target.value)}
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
            {comments.length} Comment
            {comments.length !== 1 ? "s" : ""}
          </Typography>
          <CommentSection comments={comments} addComment={addComment} />
        </Box>
      </Card>
    </Box>
  );
};

export default PostComponent;
