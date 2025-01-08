import { Typography } from "@mui/material";
import "./PostTile.css";
import Post from "../../models/post";
import UserAvatar from "../UserAvatar/UserAvatar";

interface Props {
  post: Post;
}

export default function PostTile({ post }: Props) {
  return (
    <>
      <div className="postTile">
        <UserAvatar className="avatar" user={post.sender} />
        <div className="postTileContent">
          <Typography variant="body1">{post.title}</Typography>
          <Typography variant="caption">
            Asked on {new Date(post.date).toDateString()} by {post.sender.username}
          </Typography>
          <Typography variant="caption">{post.content}</Typography>
        </div>
      </div>
    </>
  );
}
