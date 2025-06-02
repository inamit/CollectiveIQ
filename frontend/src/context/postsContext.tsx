import React, {createContext, useContext, useState, useMemo} from "react";
import usePosts from "../hooks/usePosts";
import Post from "../models/post";

interface PostsContextProps {
    searchValue: string;
    setSearchValue: (value: string) => void;
    filteredPosts: Post[];
    posts: Post[] | null;
    reloadPosts: () => void;
}

const PostsContext = createContext<PostsContextProps | null>(null);

export const usePostsContext = () => {
    const context = useContext(PostsContext);
    if (!context) throw new Error("usePostsContext must be used inside PostsProvider");
    return context;
};

export const PostsProvider = ({children}: { children: React.ReactNode }) => {

    const [searchValue, setSearchValue] = useState("");
    const {posts, reloadPosts} = usePosts();
    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        if (!searchValue.trim()) return posts;
        return posts.filter(
            (post) =>
                isIncluded(post.title) || isIncluded(post.content)
                || isIncluded(post.tag)
        );
    }, [searchValue, posts]);

    const isIncluded = (searchString: string) => {
        return searchString.toLowerCase().includes(searchValue.toLowerCase())
    }

    return (

        <PostsContext.Provider value={{
            posts,
            searchValue,
            setSearchValue,
            filteredPosts,
            reloadPosts,
        }}>
            {children}
        </PostsContext.Provider>
    );
};
