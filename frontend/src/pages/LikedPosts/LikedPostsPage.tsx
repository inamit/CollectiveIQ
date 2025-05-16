import {useEffect, useState} from "react";
import {useUser} from "../../context/userContext";
import {PostsService} from "../../services/postsService.ts";
import PostsList from "../../components/PostsList/PostsList.tsx";
import Post from "../../models/post";

const LikedPostsPage = () => {
    const {user, setUser} = useUser();
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    useEffect(() => {
        if (user) {
            const postService: PostsService = new PostsService(user!, setUser);
            postService.getLikedPosts(user._id).then(async data => {

                setLikedPosts(await data.data);
            })
        }
    }, [user]);


    return (
        <div className="saved-posts-page">
            <PostsList posts={likedPosts || []} maxPostsPerPage={3}/>
        </div>
    );
};

export default LikedPostsPage;
