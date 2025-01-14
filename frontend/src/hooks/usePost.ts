import { useEffect, useState } from "react";
import Post from "../models/post";
import Comment from "../models/comment";
import { LoadingState } from "../services/loadingState";
import { PostsService } from "../services/postsService";
import { AxiosResponse } from "axios";
import { useUser } from "../context/userContext";
import { CommentsService } from "../services/commentsService";

const usePost = (postId: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoadingState, setCommentsLoadingState] =
    useState<LoadingState>(LoadingState.LOADING);
  const [postLoadingState, setPostLoadingState] = useState<LoadingState>(
    LoadingState.LOADING
  );
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();

  const refreshPost = () => {
    const { request, cancel } = new PostsService(
      user ?? undefined,
      setUser
    ).getPostById(postId!);

    request
      .then((response: AxiosResponse<Post>) => {
        setPost(response.data);
        setPostLoadingState(LoadingState.LOADED);
      })
      .catch((err: any) => {
        setError(err.message);
        setPostLoadingState(LoadingState.ERROR);
      });

    return { cancel };
  };

  useEffect(() => {
    if (!postId) {
      return;
    }

    setPostLoadingState(LoadingState.LOADING);

    const { cancel } = refreshPost();

    return () => cancel();
  }, [user, postId]);

  useEffect(() => {
    if (!postId) return;

    setCommentsLoadingState(LoadingState.LOADING);
    const { request, cancel } = new CommentsService(
      user ?? undefined,
      setUser
    ).getCommentsByPost(postId);

    request
      .then((commentsResponse) => {
        setComments(commentsResponse.data);
        setCommentsLoadingState(LoadingState.LOADED);
      })
      .catch((err) => {
        setError(err.message);
        setCommentsLoadingState(LoadingState.ERROR);
      });

    return () => cancel();
  }, [user, postId]);

  return {
    post,
    setPost,
    postLoadingState,
    setPostLoadingState,
    comments,
    setComments,
    commentsLoadingState,
    setCommentsLoadingState,
    error,
    setError,
    refreshPost,
  };
};

export default usePost;
