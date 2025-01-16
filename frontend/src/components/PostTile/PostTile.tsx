import { Typography } from "@mui/material";
import "./PostTile.css";
import Post from "../../models/post";
import UserAvatar from "../UserAvatar/UserAvatar";
import {formatDate} from "../../utils/formatDate.ts";
interface Props {
  post: Post;
}

export default function PostTile({ post }: Props) {
  return (
    <>
      <div className="postTile">
        <UserAvatar className="avatar" user={post.userId} />
        <div className="postTileContent">
          <Typography variant="body1">{post.title}</Typography>
          <Typography variant="caption">
            {formatDate(post.date)} ago by:
            {post.userId.username}
          </Typography>
          <Typography variant="caption">{post.content}</Typography>
        </div>
      </div>
    </>
  );
}
