import {useState} from "react";
import "./Comment.css";
import {
    Comment as CommentIcon
} from "@mui/icons-material";
import {
    Button,
    Typography,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    IconButton,
    Chip
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import {motion, AnimatePresence} from "framer-motion";
import Comment from "../../models/comment";
import AppTextField from "../TextField/TextField";
import {CommentsService} from "../../services/commentsService";
import {useUser} from "../../context/userContext.tsx";
import config from "../../config.json";
import {formatDate} from "../../utils/formatDate.ts";
import CommentsList from "../CommentsList/CommentsList.tsx";
import {LoadingState} from "../../services/loadingState.ts";
import UserDetails from "../UserAvatar/UserDetails.tsx";
import {LikesSection} from "../LikesSection/LikesSection.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef,useEffect } from "react";
interface CommentProps {
    comment: Comment;
    refreshComments: () => void;
    bestAiComment?: string
    selectedCommentId?: string | null;
    onClick?: () => void;
}

export const CommentComponent = ({
                                     comment,
                                     refreshComments,
                                     bestAiComment,
                                     selectedCommentId,
                                     onClick
                                 }: CommentProps) => {
    const {user, setUser} = useUser();
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const [aiLoading, setAILoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Manage dialog open state
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedCommentId === comment._id && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedCommentId]);

    const handleDeleteDialogOpen = () => {
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteComment = () => {
        const commentService = new CommentsService(user!, setUser);
        const {request} = commentService.deleteComment(comment._id);
        request
            .then(() => {
                refreshComments();
                setOpenDeleteDialog(false); 
            })
            .catch((err) => {
                console.error(err);
                setOpenDeleteDialog(false); 
            });
    };


    const handleModelSelect = async (selectedModel: string) => {
        const commentService = new CommentsService(user!, setUser);
        setAILoading(true);

        try {
            await commentService.httpClient.post(
                `${config.backendURL}/ai/response`,
                {
                    input: comment.content,
                    model: selectedModel,
                    parentCommentID: comment._id,
                },
                {
                    params: {post_id: comment.postID},
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
    const isSelected = selectedCommentId === comment._id;
    return (
        <motion.div className="comment-container"  onClick={onClick} ref={containerRef}
                    animate={{
                        boxShadow: isSelected
                            ? '0 0 8px 3px #617AFA'
                            : 'none',
                        scale: isSelected ? 1.03 : 1,
                        borderColor: isSelected ? "#617AFA" : "transparent",
                    }}
            style={{
                border: isSelected ? ' 2px solid #617AFA ' : 'transparent',
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '12px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                boxSizing: 'border-box'
            }}>
            <div className="comment-header">
                <UserDetails
                    user={comment.userId}
                    description={formatDate(comment?.date)}
                />
                {bestAiComment == comment.userId._id && <Chip
                    label={'Our Users Best Pick'}
                    color="primary"
                    variant="outlined"
                    sx={{ marginLeft: 'auto' }}
                />}
                {selectedCommentId === comment._id && (
                    <CheckIcon
                        color="success"
                        sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            fontSize: '28px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 0 6px rgba(97, 122, 250, 0.6)',
                            padding: '2px',
                            zIndex: 10,
                        }}
                    />
                )}
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
                            flexDirection: "row",
                            gap: "8px",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <AnimatePresence>
                            {showAIDropdown && (
                                <motion.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 10}}
                                    transition={{duration: 0.2}}
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
                                        {label: "Gemini", value: "gemini"},
                                        {label: "Phi", value: "phi"},
                                        {label: "Mistral", value: "mistral"},
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
                                            {model.label === comment.userId.username && comment.userId._id === bestAiComment ? `${model.label} - Best` : model.label}
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
                                        <CircularProgress color="inherit" size={16}/>
                                    ) : undefined
                                }
                                sx={{
                                    backgroundColor: "primary",
                                    "&:hover": {backgroundColor: "primary"},
                                    height: "40px",
                                }}
                            >
                                {aiLoading ? "AI is thinking......" : "Challenge me"}
                            </Button>
                        )}
                        {user?._id === comment.userId?._id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IconButton
                                    onClick={handleDeleteDialogOpen}
                                    sx={{
                                        color: "#f44336", // Red color for the delete icon
                                        width: "40px", // Icon size
                                        height: "40px", // Icon size
                                        "&:hover": {
                                            backgroundColor: "#ffcccc", // Light red background on hover
                                        },
                                        "& svg": {
                                            fontSize: "1.5rem", // Icon size
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </motion.div>
                        )}

                        <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
                            <DialogTitle sx={{fontWeight: "bold", color: "#333"}}>Are you sure?</DialogTitle>
                            <DialogContent sx={{color: "#555"}}>
                                You won't be able to revert this.
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDeleteDialogClose} color="primary" sx={{fontWeight: "bold"}}>
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteComment} color="error" sx={{fontWeight: "bold"}}>
                                    Yes, delete it!
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>

</motion.div>
    );
};

interface CommentSectionProps {
    comments: Comment[] | undefined;
    commentsLoadingState?: LoadingState;
    addComment?: (content: string) => void;
    refreshComments: () => void;
    bestAiComment?: string;
    hideAddComment?: boolean;
    selectedCommentId?: string | null;
    onCommentClick?: (commentId: string) => void;
}

const CommentSection = ({
                            comments,
                            addComment,
                            refreshComments,
                            commentsLoadingState,
                            bestAiComment,
                            hideAddComment = false,
                            selectedCommentId,
                            onCommentClick
                        }: CommentSectionProps) => {
    const [commentText, setCommentText] = useState("");
    const {user} = useUser();

    const handleAddComment = () => {
        if (commentText.trim() && addComment) {
            addComment(commentText);
            setCommentText("");
        }
    };

    return (
        <div className="comment-section">
            {!hideAddComment && user && (
                <div className="add-comment">
                    <AppTextField
                        multiline
                        maxRows={5}
                        label="Add a comment..."
                        slotProps={{inputLabel: {style: {color: "#fff"}}}}
                        sx={{"& fieldset": {borderColor: "#ccc"}}}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button
                        onClick={handleAddComment}
                        variant="contained"
                        size="small"
                        startIcon={<CommentIcon/>}
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
                    bestAiComment={bestAiComment ?? ""}
                    selectedCommentId={selectedCommentId}
                    onCommentClick={onCommentClick}
                />
            </div>
    </div>
  );

    function buildCommentTree(comments: Comment[]): Comment[] {
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];

        comments.forEach((comment) => {
            commentMap.set(comment._id, {...comment, replies: []});
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
