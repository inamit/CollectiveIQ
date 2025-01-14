import "./PostsList.css";
import Post from "../../models/post";
import PostTile from "../PostTile/PostTile";
import Divider from "@mui/material/Divider";
import { List, ListItem, Pagination, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { paginate } from "../../utils/pagination";
import { LoadingState } from "../../services/loadingState";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";

interface Props {
  posts: Post[];
  maxPostsPerPage: number;
  loadingState?: LoadingState;
}

export default function PostsList({
  posts,
  maxPostsPerPage,
  loadingState,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const paginatedPosts: Post[][] = paginate(posts, maxPostsPerPage);

  if (loadingState === LoadingState.LOADING) {
    const postsSkeletons: React.JSX.Element[] = [];
    _.times(maxPostsPerPage, (i) =>
      postsSkeletons.push(
        <Skeleton
          key={i}
          variant="rectangular"
          animation="wave"
          height={100}
          sx={{ marginTop: "15px", bgcolor: "grey.800" }}
        />
      )
    );
    return <>{...postsSkeletons}</>;
  } else if (loadingState === LoadingState.ERROR) {
    return <div>Error loading posts</div>;
  }

  return (
    <>
      {paginatedPosts.length === 0 && <div>No posts found</div>}
      <List className="postsList">
        {paginatedPosts[currentPage - 1]?.map((post) => (
          <div key={post._id}>
            <ListItem
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`${routes.POST}/${post._id}`)}
            >
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
