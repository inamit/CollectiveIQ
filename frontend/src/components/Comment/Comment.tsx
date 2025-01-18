import { useState } from "react";
import "./Comment.css";
import { Comment as CommentIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Comment from "../../models/comment";
import UserAvatar from "../UserAvatar/UserAvatar";
import AppTextField from "../TextField/TextField";
import { CommentsService } from "../../services/commentsService";
import { useUser } from "../../context/userContext.tsx";
import { LoadingState } from "../../services/loadingState";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface CommentProps {
  comment: Comment;
  setCommentsLoadingState: (state: LoadingState) => void;
}

const CommentComponent = ({ comment, setCommentsLoadingState }: CommentProps) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleDeleteComment = (comment_id: string) => {
    const commentService = new CommentsService(user!, setUser);
    if (user?._id === comment.userId?._id) {
      MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const { request } = commentService.deleteComment(comment_id);
          request
            .then(() => {
              setCommentsLoadingState(LoadingState.LOADING);
              navigate(routes.HOME);
              toast.success("Comment deleted successfully");
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    } else {
      toast.error("You can only delete your own comments");
    }
  };

  return (
    <div className="comment-container">
      <div className="comment-header">
        <UserAvatar user={comment.userId} className="user-avatar" />
        <div className="comment-details">
          <Typography
            variant="body2"
            sx={{ mb: 2 }}
            className="comment-username"
          >
            {comment.userId?.username}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }} className="comment-time">
            {comment.date?.toString()}
          </Typography>
        </div>
      </div>
      <div className="comment-content">
        <Typography variant="body2" sx={{ mb: 2 }} className="comment-text">
          {comment.content}
        </Typography>
        <Button
          onClick={() => handleDeleteComment(comment._id)}
          variant="outlined"
          size="small"
          color="error"
          className="delete-comment-button"
          startIcon={<DeleteIcon />}
        >
          Delete Comment
        </Button>
      </div>
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[] | undefined;
  addComment: (content: string) => void;
  setCommentsLoadingState: (state: LoadingState) => void;
}

const CommentSection = ({ comments, addComment, setCommentsLoadingState }: CommentSectionProps) => {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="comment-section">
      <div className="add-comment">
        <AppTextField
          multiline
          maxRows={5}
          label="Add a comment..."
          slotProps={{ inputLabel: { style: { color: "#fff" } } }}
          sx={{ "& fieldset": { borderColor: "#ccc" } }}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          variant="contained"
          size="small"
          startIcon={<CommentIcon />}
          className="add-comment-button"
        >
          Add Comment
        </Button>
      </div>

      <div className="comments-list">
        {(comments?.length ?? 0) > 0 ? (
          comments?.map((comment: Comment) => (
            <CommentComponent key={comment._id} comment={comment} setCommentsLoadingState={setCommentsLoadingState} />
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;