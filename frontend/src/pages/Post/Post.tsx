import "./Post.css";
import { useEffect, useState } from "react";
import {
    IconButton,
    Box,
    Card,
    CardContent,
    Typography,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentSection from "../../components/Comment/Comment.tsx";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../context/userContext.tsx";
import usePost from "../../hooks/usePost.ts";
import Post from "../../models/post.ts";
import { CommentsService } from "../../services/commentsService.ts";
import { toast } from "react-toastify";
import AppTextField from "../../components/TextField/TextField.tsx";
import { PostsService } from "../../services/postsService.ts";
import { routes } from "../../router/routes.ts";
import { ImagePicker } from "../../components/ImagePicker/ImagePicker.tsx";
import { formatDate } from "../../utils/formatDate.ts";
import Markdown from "../../components/Markdown/Markdown.tsx";
import { LoadingState } from "../../services/loadingState.ts";
import UserDetails from "../../components/UserAvatar/UserDetails.tsx";
import { LikesSection } from "../../components/LikesSection/LikesSection.tsx";
import { motion } from "framer-motion";
import { TagsService } from "../../services/tagsService.ts";
import Tag from "../../models/tag.ts";

const PostComponent = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [tag, setTag] = useState<Tag | null>(null);
    const {
        post,
        postLoadingState,
        commentsLoadingState,
        comments,
        setComments,
        refreshPost,
        refreshComments,
    } = usePost(postId);

    const [editablePost, setEditablePost] = useState<Partial<Post> | null>(post);
    const [image, setImage] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (post) {
            setEditablePost(post);
            if (post.imageUrl) {
                createFile(post.imageUrl).then((file) => {
                    setImage(file);
                    setOriginalImage(file);
                });
            }
            if (post?.tag) {
                const tagsService = new TagsService();
                const { request } = tagsService.getTagbyName(post.tag);
                request.then((response) => {
                        setTag(response.data)
                    })
                    .catch((err) => {
                        console.error("Failed to fetch tag:", err);
                });
            }
        }
        if (postId) {
        refreshComments();
    }
  }, [post, postId, refreshComments]);


    const createFile = async (imageUrl: string) => {
        const urlArray = imageUrl.split("/");
        let response = await fetch(imageUrl);
        let data = await response.blob();
        let metadata = { type: data.type };
        return new File([data], urlArray[urlArray.length - 1], metadata);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditablePost({ ...editablePost, [field]: value });
    };

    const toggleEditMode = () => {
        if (isEditing) {
            updatePost()
                .then(() => {
                    setIsEditing(false);
                    refreshPost();
                })
                .catch((err) => toast.error(err));
        } else {
            setIsEditing(true);
        }
    };

    const confirmDeletePost = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = () => {
        const { request } = new PostsService(user!, setUser).deletePost(postId!);
        request.then(() => {
            setDeleteDialogOpen(false);
            navigate(routes.HOME);
        });
    };

    const updatePost = () => {
        return new Promise((resolve, reject) => {
            if (!(editablePost?.title && editablePost?.content)) {
                reject("Title and content are required");
                return;
            }

            if (editablePost.imageUrl && !image) {
                reject("Image is required");
                return;
            }

            const { request } = new PostsService(user!, setUser).updatePost(
                postId!,
                editablePost.title,
                editablePost.content,
                image !== originalImage ? image : null
            );

            request
                .then((response) => {
                    setEditablePost(response.data);
                    setIsEditing(false);
                    resolve("");
                })
                .catch((err) => {
                    console.error(err);
                    reject("Failed to update post");
                });
        });
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

    const getEditButtons = () => {
        return (<div>
            {user?._id === post?.userId?._id && !isEditing && (
                <Box display="flex" gap={1} >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconButton
                            size="small"
                            onClick={toggleEditMode}
                            sx={{
                                color: "primary.main",
                                "&:hover": {
                                    backgroundColor: "secondary.main",
                                },
                                "& svg": {
                                    fontSize: "1.5rem",
                                },
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconButton
                            size="small"
                            onClick={confirmDeletePost}
                            sx={{
                                color: "error.main",
                                "&:hover": {
                                    backgroundColor: "#ffcccc",
                                },
                                "& svg": {
                                    fontSize: "1.5rem",
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </motion.div>
                </Box>
            )}
        </div>)
    }

    const getHeader = () => {
        switch (postLoadingState) {
            case LoadingState.ERROR:
                return null;
            case LoadingState.LOADED:
                return (
                    <div className="post-header">
                        {isEditing ? (
                            <AppTextField
                                fullWidth
                                value={editablePost?.title as string}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                            />
                        ) : (
                            <Typography variant="h5" className="post-title">
                                {editablePost?.title}
                            </Typography>
                        )}
                    </div>
                );
            default:
                return <Skeleton variant="text" height={100} />;
        }
    };

    const getUserDetails = () => {
        switch (postLoadingState) {
            case LoadingState.ERROR:
                return <></>;
            case LoadingState.LOADED:
                return (
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <UserDetails
                            user={post?.userId}
                            description={formatDate(post?.date)}
                        />
                        {getEditButtons()}
                    </Box>
                )
            default:
                return (
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center">
                            <Skeleton variant="circular" width={40} height={40}/>
                            <Box ml={2}>
                                <Skeleton variant="text" width={100}/>
                                <Skeleton variant="text" width={70}/>
                            </Box>
                        </Box>
                    </Box>
                );

        }}

    const getPostContent = () => {
        switch (postLoadingState) {
            case LoadingState.LOADED:
                return (
                    <>
                        <CardContent sx={{ textAlign: "left" }}>
                            <Markdown
                                editablePost={editablePost as Post}
                                post={post as Post}
                                handleInputChange={handleInputChange}
                                isEditing={isEditing}
                            />
                            {post?.imageUrl && !isEditing && (
                                <Box
                                    component="img"
                                    src={post?.imageUrl}
                                    alt="Post"
                                    className="post-image"
                                />
                            )}
                            {isEditing && (
                                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                    <ImagePicker
                                        image={image}
                                        setImage={setImage}
                                        required={!!editablePost?.imageUrl}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        onClick={toggleEditMode}
                                        sx={{ ml: 2 }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            )}
                        </CardContent>

                        <Box display="flex" alignItems="center" gap={2} px={2}>
                            <LikesSection
                                currentUser={user}
                                likeable={post as Post}
                                likeableService={new PostsService(user!, setUser)}
                                refresh={refreshPost}
                            />
                            <Chip
                                label={post?.tag}
                                color="primary"
                                variant="outlined"
                                sx={{ marginLeft: 'auto' }} >
                            </Chip>
                        </Box>
                    </>
                );
            case LoadingState.ERROR:
                return <Typography>Error loading post</Typography>;
            default:
                return <Skeleton variant="text" height={400} />;
        }
    };

    const getCommentsComponents = () => {
        switch (commentsLoadingState) {
            case LoadingState.ERROR:
                return <Typography>Error loading comments</Typography>;
            case LoadingState.LOADED:
                return (
                    <Box className="comments-container">
                        <Typography variant="body2" className="comments-count">
                            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                        </Typography>
                        <CommentSection
                            comments={comments}
                            addComment={addComment}
                            refreshComments={refreshComments}
                            commentsLoadingState={commentsLoadingState}
                            bestAiComment={tag?.bestAi}
                        />
                    </Box>
                );
            default:
                return (
                    <Skeleton
                        variant="rectangular"
                        height={100}
                        className="comments-container"
                    />
                );
        }
    };

    return (
        <>
            <Box className="post-container">
                <Card className="post-card">
                    {getUserDetails()}
                    {getHeader()}
                    {getPostContent()}
                    {!isEditing && getCommentsComponents()}
                </Card>
            </Box>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Post</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PostComponent;
