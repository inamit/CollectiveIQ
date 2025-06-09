import Divider from "@mui/material/Divider";
import "./CommentsList.css";
import {List, ListItem, Pagination, Skeleton} from "@mui/material";
import React, {useState} from "react";
import {paginate} from "../../utils/pagination";
import {LoadingState} from "../../services/loadingState";
import _ from "lodash";
import {useNavigate} from "react-router";
import {routes} from "../../router/routes";
import {CommentComponent} from "../Comment/Comment";
import Comment from "../../models/comment";
import {motion} from "framer-motion";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

interface CommentProps {
  comments: Comment[];
  maxCommentsPerPage: number;
  loadingState?: LoadingState;
  level?: number;
  showDividers?: boolean;
  refreshComments?: () => void;
  bestAiComment?: string
  highlightedCommentId?: string | null;
}

export default function CommentsList({
  comments,
  maxCommentsPerPage,
  loadingState,
  level = 0,
  showDividers = true,
  refreshComments = () => {},
  bestAiComment,
 highlightedCommentId
}: CommentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

    const paginatedComments: Comment[][] = paginate(comments, maxCommentsPerPage);

    if (loadingState === LoadingState.LOADING) {
        const commentsSkeletons: React.JSX.Element[] = [];
        _.times(maxCommentsPerPage, (i) =>
            commentsSkeletons.push(
                <Skeleton
                    key={i}
                    variant="rectangular"
                    height={100}
                    sx={{marginTop: "15px"}}
                />
            )
        );
        return <>{...commentsSkeletons}</>;
    } else if (loadingState === LoadingState.ERROR) {
        return <div>Error loading comments</div>;
    }

    return (
        <div style={{paddingLeft: `${level * 20}px`}}>
            {paginatedComments.length === 0 && (<motion.div
                className="no-posts"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <SentimentDissatisfiedIcon style={{fontSize: 60, color: "#888"}}/>
                <h3>No Answers found</h3>

            </motion.div>)}
            <List className="comments-list">
                {paginatedComments[currentPage - 1]?.map((comment, index) => (
                    <motion.div
                        key={comment._id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.5,
                        }}
                    >
                        <div key={comment._id}>
                            <ListItem
                                onClick={() => navigate(`${routes.POST}/${comment.postID}`)}
                            >
                                <CommentComponent
                                    key={comment._id}
                                    comment={comment}
                                    refreshComments={refreshComments}
                                    bestAiComment={bestAiComment ?? ""}
                                    shouldScroll={comment._id === highlightedCommentId} // optional auto-scroll
                                />
                            </ListItem>

                            {showDividers && <Divider/>}

                            {comment.replies && comment.replies.length > 0 && (
                                <CommentsList
                                    comments={comment.replies}
                                    maxCommentsPerPage={maxCommentsPerPage}
                                    level={level + 1}
                                    showDividers={showDividers}
                                    refreshComments={refreshComments}
                                    bestAiComment={bestAiComment ?? ""}
                                />
                            )}
                        </div>
                    </motion.div>
                ))}
            </List>

            {paginatedComments.length > 1 && (
                <div className="pagination">
                    <Pagination
                        count={paginatedComments.length}
                        page={currentPage}
                        onChange={(_, newPage) => setCurrentPage(newPage)}
                        color="primary"
                        sx={{width: "100%", ul: {justifyContent: "center"}}}
                    />
                </div>
            )
            }
        </div>
    )
        ;
}
