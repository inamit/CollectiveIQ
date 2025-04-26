import { useState } from "react";
import "./Comment.css";
import {
  Comment as CommentIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Comment from "../../models/comment";
import AppTextField from "../TextField/TextField";
import { CommentsService } from "../../services/commentsService";
import { useUser } from "../../context/userContext.tsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import config from "../../config.json";

const MySwal = withReactContent(Swal);
import { formatDate } from "../../utils/formatDate.ts";
import CommentsList from "../CommentsList/CommentsList.tsx";
import { LoadingState } from "../../services/loadingState.ts";
import UserDetails from "../UserAvatar/UserDetails.tsx";
import { LikesSection } from "../LikesSection/LikesSection.tsx";

interface CommentProps {
  comment: Comment;
  refreshComments: () => void;
}

export const CommentComponent = ({
  comment,
  refreshComments,
}: CommentProps) => {
  const { user, setUser } = useUser();
  const [selectedAI, setSelectedAI] = useState("");

  const handleDeleteComment = (comment_id: string) => {
    const commentService = new CommentsService(user!, setUser);
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
            refreshComments();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  const handleAIRequest = async () => {
    if (!selectedAI) {
      Swal.fire("Error", "Please select an AI model.", "error");
      return;
    }

    const commentService = new CommentsService(user!, setUser);
    const controller = new AbortController();

    try {
      await commentService.httpClient.post(
        `${config.backendURL}/ai/${selectedAI}`,
        {
          input: comment.content,
          parentCommentID: comment._id,
        },
        {
          params: { post_id: comment.postID },
          signal: controller.signal,
        }
      );
      Swal.fire("AI Response", "success", "success");
      refreshComments();
    } catch (error) {
      console.error(error);
      Swal.fire("AI Response", "Failed to fetch response", "error");
    }
  };

  return (
    <div className="comment-container">
      <div className="comment-header">
        <UserDetails
          user={comment.userId}
          description={formatDate(comment?.date)}
        />
      </div>
      <div className="comment-content">
        <Typography variant="body2" sx={{ mb: 2 }} className="comment-text">
          {comment.content}
        </Typography>
        <div className="comment-footer">
          <div className="left-actions">
            {user?._id === comment.userId?._id && (
              <Button
                className="ai-button"
                onClick={handleAIRequest}
                variant="contained"
                size="small"
                color="secondary"
              >
                Challenge me
              </Button>
            )}
            <LikesSection
              currentUser={user}
              likeable={comment}
              likeableService={new CommentsService(user!, setUser)}
              refresh={refreshComments}
            />
          </div>
          {user?._id === comment.userId?._id && (
            <Button
              onClick={() => handleDeleteComment(comment._id)}
              variant="outlined"
              size="small"
              color="error"
              className="delete-comment-button"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
        </div>
        <div className="ai-dropdown">
          <FormControl fullWidth size="small">
            <InputLabel>Select AI Model</InputLabel>
            <Select
              value={selectedAI}
              onChange={(e) => setSelectedAI(e.target.value)}
              label="Select AI Model"
            >
              <MenuItem value="gemini-response">Gemini</MenuItem>
              <MenuItem value="falcon-response">Falcon</MenuItem>
              <MenuItem value="mistral-response">Mistral</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

interface CommentSectionProps {
  comments: Comment[] | undefined;
  commentsLoadingState?: LoadingState;
  addComment: (content: string) => void;
  refreshComments: () => void;
}

const CommentSection = ({
  comments,
  addComment,
  refreshComments,
  commentsLoadingState,
}: CommentSectionProps) => {
  const [commentText, setCommentText] = useState("");
  const { user } = useUser();

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="comment-section">
      {user && (
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
      )}

      <div className="comments-list">
        <CommentsList
          maxCommentsPerPage={5}
          comments={buildCommentTree(comments ?? [])}
          loadingState={commentsLoadingState}
          showDividers={false}
          refreshComments={refreshComments}
        />
      </div>
    </div>
  );

  function buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const commentNode = commentMap.get(comment._id)!;

      if (comment.parentCommentID) {
        const parent = commentMap.get(comment.parentCommentID);
        if (parent) {
          parent.replies!.push(commentNode);
        } else {
          rootComments.push(commentNode);
        }
      } else {
        rootComments.push(commentNode);
      }
    });

    return rootComments;
  }
};

export default CommentSection;
