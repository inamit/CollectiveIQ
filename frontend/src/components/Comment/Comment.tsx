import { useState } from "react";
import "./Comment.css";
import { Comment as CommentIcon } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import User from "../../models/user";
import CommentModel from "../../models/comment";
import UserAvatar from "../UserAvatar/UserAvatar";

interface CommentProps {
  user: User;
  content: string;
  time: string;
}
const Comment = ({ user, content, time }: CommentProps) => {
  return (
    <div className="comment-container">
      <div
        className="comment-header"
        style={{ display: "flex", alignItems: "center" }}
      >
        <UserAvatar user={user} className="user-avatar" />
        <div className="comment-details">
          <Typography
            variant="body2"
            sx={{ mb: 2 }}
            className="comment-username"
            style={{ fontWeight: "bold" }}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2 }}
            className="comment-time"
            style={{ color: "#999" }}
          >
            {time}
          </Typography>
        </div>
      </div>
      <Typography
        variant="body2"
        sx={{ mb: 2 }}
        className="comment-text"
        style={{ marginTop: "10px" }}
      >
        {content}
      </Typography>
    </div>
  );
};

interface CommentSectionProps {
  comments: CommentModel[];
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
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
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
        {comments?.length > 0 ? (
          comments?.map((comment: CommentModel) => (
            <Comment
              key={comment._id}
              user={comment.userId}
              content={comment.content}
              time={comment.date?.toString()}
            />
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
