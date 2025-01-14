import { useEffect, useState } from "react";
import Post from "../models/post";
import { LoadingState } from "../services/loadingState";
import { PostsService } from "../services/postsService";
import { AxiosResponse } from "axios";
import { useUser } from "../context/userContext";
import User from "../models/user";

const usePosts = (selectedUser?: User) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [postsLoadingState, setPostsLoadingState] = useState<LoadingState>(
    LoadingState.LOADING
  );
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUser();

  useEffect(() => {
    setPostsLoadingState(LoadingState.LOADING);

    const postsService = new PostsService(user ?? undefined, setUser);
    const { request, cancel } = selectedUser
      ? postsService.getPostsByUser(selectedUser._id)
      : postsService.getPosts();

    request
      .then((response: AxiosResponse<Post[]>) => {
        setPosts(response.data);
        setPostsLoadingState(LoadingState.LOADED);
      })
      .catch((err: any) => {
        setError(err.message);
        setPostsLoadingState(LoadingState.ERROR);
      });

    return () => cancel();
  }, [selectedUser]);

  return {
    posts,
    setPosts,
    postsLoadingState,
    setPostsLoadingState,
    error,
    setError,
  };
};

export default usePosts;
