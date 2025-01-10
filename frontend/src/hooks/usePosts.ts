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
    if (!selectedUser) {
      return;
    }

    setPostsLoadingState(LoadingState.LOADING);

    const { request, cancel } = new PostsService(
      user ?? undefined,
      setUser
    ).getPostsByUser(selectedUser!._id);

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
