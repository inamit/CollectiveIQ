import "./PostsList.css";
import Post from "../../models/post";
import PostTile from "../PostTile/PostTile";
import Divider from "@mui/material/Divider";
import { List, ListItem, Pagination } from "@mui/material";
import { useState } from "react";
import { paginate } from "../../utils/pagination";
interface Props {
  posts: Post[];
  maxPostsPerPage: number;
}

export default function PostsList({ posts, maxPostsPerPage: pageSize }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedPosts = paginate(posts, pageSize);

  return (
    <>
      <List className="postsList">
        {paginatedPosts[currentPage - 1]?.map((post) => (
          <div key={post.id}>
            <ListItem>
              <PostTile post={post} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      {paginatedPosts.length > 1 && (
        <div className="pagination">
          <Pagination
            count={paginatedPosts.length}
            page={currentPage}
            onChange={(_, newPage) => setCurrentPage(newPage)}
            color="primary"
            sx={{ width: "100%", ul: { justifyContent: "center" } }}
          />
        </div>
      )}
    </>
  );
}
