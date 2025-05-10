import "./PostsList.css";
import Post from "../../models/post";
import PostTile from "../PostTile/PostTile";
import {List, ListItem, Pagination, Skeleton} from "@mui/material";
import React, {useState, useEffect} from "react";
import {paginate} from "../../utils/pagination";
import {LoadingState} from "../../services/loadingState";
import _ from "lodash";
import {useNavigate} from "react-router";
import {routes} from "../../router/routes";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import {motion} from "framer-motion";

interface Props {
    posts: Post[];
    maxPostsPerPage: number;
    loadingState?: LoadingState;
}

export default function PostsList({posts, maxPostsPerPage, loadingState}: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const paginatedPosts: Post[][] = paginate(posts, maxPostsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [posts]);

    if (loadingState === LoadingState.LOADING) {
        const postsSkeletons: React.JSX.Element[] = [];
        _.times(maxPostsPerPage, (i) =>
            postsSkeletons.push(
                <Skeleton
                    key={i}
                    variant="rectangular"
                    height={100}
                    sx={{marginTop: "15px"}}
                />
            )
        );
        return <>{...postsSkeletons}</>;
    } else if (loadingState === LoadingState.ERROR) {
        return <div>Error loading posts</div>;
    }

    return (
        <>
            {paginatedPosts.length === 0 && (
                <motion.div
                    className="no-posts"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <SentimentDissatisfiedIcon style={{fontSize: 60, color: "#888"}}/>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or check back later.</p>
                </motion.div>
            )}

            <List className="postsList">
                {paginatedPosts[currentPage - 1]?.map((post, index) => (
                    <motion.div
                        key={post._id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.5,
                        }}
                    >
                        <ListItem
                            style={{cursor: "pointer"}}
                            onClick={() => navigate(`${routes.POST}/${post._id}`)}
                        >
                            <PostTile post={post}/>
                        </ListItem>
                    </motion.div>
                ))}
            </List>

            {paginatedPosts.length > 1 && (
                <div className="pagination">
                    <Pagination
                        count={paginatedPosts.length}
                        page={currentPage}
                        onChange={(_, newPage) => setCurrentPage(newPage)}
                        color="primary"
                        sx={{width: "100%", ul: {justifyContent: "center"}}}
                    />
                </div>
            )}
        </>
    );
}
