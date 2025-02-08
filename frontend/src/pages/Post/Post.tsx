import "./Post.css";
import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentSection from "../../components/Comment/Comment.tsx";
import { useNavigate, useParams } from "react-router";
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
import { ImagePicker } from "../../components/ImagePicker/ImagePicker.tsx";
import { formatDate } from "../../utils/formatDate.ts";
import Markdown from "../../components/Markdown/Markdown.tsx";
import { LoadingState } from "../../services/loadingState.ts";

const PostComponent = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
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

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setEditablePost(post);
    if (post?.imageUrl) {
      createFile(post.imageUrl).then((file) => {
        setImage(file);
        setOriginalImage(file);
      });
    }
  }, [post]);

  const createFile = async (imageUrl: string) => {
    const urlArray = imageUrl.split("/");
    let response = await fetch(imageUrl);
    let data = await response.blob();
    let metadata = {
      type: data.type,
    };
    return new File([data], urlArray[urlArray.length - 1], metadata);
  };

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
    const postService = new PostsService(user!, setUser);

    postService
      .like(postId!)
      .request.then(() => {
        refreshPost();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to like post");
      });
  };

  const handleDislike = () => {
    const postService = new PostsService(user!, setUser);

    postService
      .dislike(postId!)
      .request.then(() => {
        refreshPost();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to dislike post");
      });
  };

  const toggleEditMode = () => {
    if (isEditing) {
      updatePost()
        .then(() => {
          setIsEditing(!isEditing);
          refreshPost();
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      setIsEditing(!isEditing);
    }
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
        navigate(routes.HOME);
      });
    }
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
        editablePost?.title,
        editablePost?.content,
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

  const getEditButtons = () => {
    if (user?._id === post?.userId?._id) {
      return (
        <Box className="post-actions">
          <IconButton
            size="small"
            onClick={toggleEditMode}
            className="edit-button"
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
          <IconButton
            size="small"
            onClick={deletePost}
            className="delete-button"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
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
              {comments.length} Comment
              {comments.length !== 1 ? "s" : ""}
            </Typography>
            <CommentSection
              comments={comments}
              addComment={addComment}
              refreshComments={refreshComments}
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

  const getHeader = () => {
    switch (postLoadingState) {
      case LoadingState.ERROR:
        return <></>;
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
                {editablePost?.title as string}
              </Typography>
            )}

            {getEditButtons()}
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
          <Box
            display="flex"
            alignItems="center"
            mb={2}
            className="user-details"
            onClick={() =>
              navigate(`${routes.USER_PROFILE}/${post?.userId?._id}`)
            }
          >
            <UserAvatar user={post?.userId} className="user-avatar" />
            <Box display="flex" alignItems="start" flexDirection="column">
              <Typography variant="body1">{post?.userId?.username}</Typography>
              <Typography variant="caption">
                {formatDate(post?.date)}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return (
          <Box display="flex" alignItems="center" mb={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box
              display="flex"
              alignItems="start"
              ml={2}
              flexDirection="column"
            >
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={70} />
            </Box>
          </Box>
        );
    }
  };

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
                <ImagePicker
                  image={image}
                  setImage={setImage}
                  required={editablePost?.imageUrl ? true : false}
                />
              )}
            </CardContent>

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
          </>
        );
      case LoadingState.ERROR:
        return <Typography>Error loading post</Typography>;
      default:
        return <Skeleton variant="text" height={400} />;
    }
  };

  return (
    <Box className="post-container">
      <Card className="post-card">
        {getHeader()}
        {getUserDetails()}
        {getPostContent()}

        {getCommentsComponents()}
      </Card>
    </Box>
  );
};

export default PostComponent;
