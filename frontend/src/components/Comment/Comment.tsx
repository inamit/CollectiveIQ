import { useState } from "react";
import "./Comment.css";
import {
  Comment as CommentIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Button, Typography, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Comment from "../../models/comment";
import AppTextField from "../TextField/TextField";
import { CommentsService } from "../../services/commentsService";
import { useUser } from "../../context/userContext.tsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import config from "../../config.json";
import { formatDate } from "../../utils/formatDate.ts";
import CommentsList from "../CommentsList/CommentsList.tsx";
import { LoadingState } from "../../services/loadingState.ts";
import UserDetails from "../UserAvatar/UserDetails.tsx";
import { LikesSection } from "../LikesSection/LikesSection.tsx";

const MySwal = withReactContent(Swal);

interface CommentProps {
  comment: Comment;
  refreshComments: () => void;
}

export const CommentComponent = ({
  comment,
  refreshComments,
}: CommentProps) => {
  const { user, setUser } = useUser();
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [aiLoading, setAILoading] = useState(false);

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

  const handleModelSelect = async (selectedModel: string) => {
    const commentService = new CommentsService(user!, setUser);
    setAILoading(true);

    try {
      await commentService.httpClient.post(
        `${config.backendURL}/ai/${selectedModel}`,
        {
          input: comment.content,
          parentCommentID: comment._id,
        },
        {
          params: { post_id: comment.postID },
        }
      );
      setTimeout(() => {
        refreshComments();
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setShowAIDropdown(false);
      setAILoading(false);
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
            <LikesSection
              currentUser={user}
              likeable={comment}
              likeableService={new CommentsService(user!, setUser)}
              refresh={refreshComments}
            />
          </div>
          <div
            className="right-actions"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            <AnimatePresence>
              {showAIDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    marginBottom: "8px",
                    zIndex: 10,
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    minWidth: "140px",
                  }}
                >
                  {[
                    { label: "Gemini", value: "gemini-response" },
                    { label: "Falcon", value: "falcon-response" },
                    { label: "Mistral", value: "mistral-response" },
                  ].map((model) => (
                    <Button
                      key={model.value}
                      onClick={() => handleModelSelect(model.value)}
                      sx={{
                        justifyContent: "flex-start",
                        width: "100%",
                        color: "black",
                        textTransform: "none",
                        fontSize: "0.9rem",
                        padding: "8px 12px",
                        borderRadius: 0,
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      {model.label}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {user && (
              <Button
                onClick={() => setShowAIDropdown((prev) => !prev)}
                variant="contained"
                size="small"
                disabled={aiLoading}
                startIcon={
                  aiLoading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : undefined
                }
                sx={{
                  backgroundColor: "primary",
                  "&:hover": { backgroundColor: "primary" },
                  height: "40px",
                }}
              >
                {aiLoading ? "AI is thinking......" : "Challenge me"}
              </Button>
            )}

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
