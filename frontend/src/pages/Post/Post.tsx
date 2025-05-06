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
import CommentSection from "../../components/Comment/Comment.tsx";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../context/userContext.tsx";
import usePost from "../../hooks/usePost.ts";
import Post from "../../models/post.ts";
import { CommentsService } from "../../services/commentsService.ts";
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
import UserDetails from "../../components/UserAvatar/UserDetails.tsx";
import { LikesSection } from "../../components/LikesSection/LikesSection.tsx";

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

  const [isEditing, setIsEditing] = useState(false);

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
              commentsLoadingState={commentsLoadingState}
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
          <UserDetails
            user={post?.userId}
            description={formatDate(post?.date)}
          />
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
              <LikesSection
                currentUser={user}
                likeable={post as Post}
                likeableService={new PostsService(user!, setUser)}
                refresh={refreshPost}
              />
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
