import { useEffect, useState } from "react";
import Post from "../models/post";
import { LoadingState } from "../services/loadingState";
import { PostsService } from "../services/postsService";
import { AxiosResponse } from "axios";
import { useUser } from "../context/userContext";
import { CommentsService } from "../services/commentsService";

const usePost = (postId: string | undefined) => {
  const [post, setPost] = useState<Post | null>(null);
  const [postLoadingState, setPostLoadingState] = useState<LoadingState>(
    LoadingState.LOADING
  );
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!postId) {
      return;
    }

    setPostLoadingState(LoadingState.LOADING);

    const { request: postRequest, cancel: postCancel } = new PostsService(
      user ?? undefined,
      setUser
    ).getPostById(postId);

    postRequest
      .then((response: AxiosResponse<Post>) => {
        const fetchedPost = response.data;

        const { request: commentsRequest } = new CommentsService(
          user ?? undefined,
          setUser
        ).getCommentsByPost(postId);

        commentsRequest
          .then((commentsResponse) => {
            fetchedPost.comments = commentsResponse.data;
            setPost(response.data);
            setPostLoadingState(LoadingState.LOADED);
          })
          .catch((err) => {
            setError(err.message);
            setPostLoadingState(LoadingState.ERROR);
          });
      })
      .catch((err: any) => {
        setError(err.message);
        setPostLoadingState(LoadingState.ERROR);
      });

    return () => postCancel();
  }, [user, postId]);

  return {
    post,
    setPost,
    postLoadingState,
    setPostLoadingState,
    error,
    setError,
  };
};

export default usePost;
