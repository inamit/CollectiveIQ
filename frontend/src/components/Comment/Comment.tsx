import { useState } from "react";
import "./Comment.css";
import { Comment as CommentIcon } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Comment from "../../models/comment";
import UserAvatar from "../UserAvatar/UserAvatar";
import AppTextField from "../TextField/TextField";

interface CommentProps {
  comment: Comment;
}
const CommentComponent = ({ comment }: CommentProps) => {
  return (
    <div className="comment-container">
      <div
        className="comment-header"
        style={{ display: "flex", alignItems: "center" }}
      >
        <UserAvatar user={comment.userId} className="user-avatar" />
        <div className="comment-details">
          <Typography
            variant="body2"
            sx={{ mb: 2 }}
            className="comment-username"
            style={{ fontWeight: "bold" }}
          >
            {comment.userId?.username}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2 }}
            className="comment-time"
            style={{ color: "#999" }}
          >
            {comment.date?.toString()}
          </Typography>
        </div>
      </div>
      <Typography
        variant="body2"
        sx={{ mb: 2 }}
        className="comment-text"
        style={{ marginTop: "10px" }}
      >
        {comment.content}
      </Typography>
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[] | undefined;
  addComment: (content: string) => void;
}

const CommentSection = ({ comments, addComment }: CommentSectionProps) => {
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
          style={{ marginTop: "8px" }}
        >
          Add Comment
        </Button>
      </div>

      <div className="comments-list">
        {(comments?.length ?? 0) > 0 ? (
          comments?.map((comment: Comment) => (
            <CommentComponent key={comment._id} comment={comment} />
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
