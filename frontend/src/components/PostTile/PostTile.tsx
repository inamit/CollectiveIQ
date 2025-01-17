import { Typography } from "@mui/material";
import "./PostTile.css";
import Post from "../../models/post";
import UserAvatar from "../UserAvatar/UserAvatar";
import { formatDate } from "../../utils/formatDate.ts";
import usePost from "../../hooks/usePost.ts";

interface Props {
  post: Post;
}

export default function PostTile({ post }: Props) {
  const { post: fetchedPost, comments } = usePost(post?._id);
  return (
    <>
      <div className="postTile">
        <UserAvatar className="avatar" user={post.userId} />
        <div className="postTileContent">
          <Typography variant="body1">{post.title}</Typography>
          <div className="postTileMetadata">
            <Typography variant="caption">
              asked {formatDate(post.date)}
            </Typography>
            <Typography className="count" variant="caption">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </Typography>
            <Typography className="count" variant="caption">
              {fetchedPost?.likes.length}{" "}
              {fetchedPost?.likes.length === 1 ? "like" : "likes"}
            </Typography>
            <Typography className="count" variant="caption">
              {fetchedPost?.dislikes.length}{" "}
              {fetchedPost?.dislikes.length === 1 ? "dislike" : "dislikes"}
            </Typography>
          </div>
          <Typography
            variant="caption"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              width: "100%",
            }}
          >
            {post.content}
          </Typography>
        </div>
      </div>
    </>
  );
}
