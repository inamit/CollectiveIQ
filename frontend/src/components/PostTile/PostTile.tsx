import {Box, Typography} from "@mui/material";
import "./PostTile.css";
import Post from "../../models/post";
import UserAvatar from "../UserAvatar/UserAvatar";
import {formatDate} from "../../utils/formatDate.ts";
import usePost from "../../hooks/usePost.ts";

interface Props {
    post: Post;
}


export default function PostTile({post}: Props) {
    const {comments} = usePost(post?._id);
    return (
        <>
            <div className="postTile">
                <UserAvatar className="avatar" user={post.userId}/>
                <div className="postTileContent">
                    <Typography variant="body1">{post.title}</Typography>
                    <Typography variant="caption">
                       asked {formatDate(post.date)}
                    </Typography>
                    <Typography variant="caption">{post.content}</Typography>
                    <Box className="commentsCount">
                        <Typography variant="caption">
                            {comments.length} {comments.length === 1 ? "comment" : "comments"}
                        </Typography>
                    </Box>
                </div>
            </div>
        </>
    );
}
