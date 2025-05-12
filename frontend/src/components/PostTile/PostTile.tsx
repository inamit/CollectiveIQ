// PostTile.tsx
import {
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    Skeleton,
    Tooltip,
    Button,
} from "@mui/material";
import Post from "../../models/post";
import { formatDate } from "../../utils/formatDate";
import usePost from "../../hooks/usePost";
import { useNavigate } from "react-router";
import { routes } from "../../router/routes";
import { ThumbUp, ThumbDown, Comment } from "@mui/icons-material";
import { useState } from "react";
import UserAvatar from "../UserAvatar/UserAvatar.tsx";

interface Props {
    post: Post;
}

function pluralize(count: number, singular: string, plural: string) {
    return `${count} ${count === 1 ? singular : plural}`;
}

export default function PostTile({ post }: Props) {
    const { comments } = usePost(post._id);
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        navigate(`${routes.POST}/${post._id}`);
    };

    if (!post) {
        return (
            <Skeleton
                variant="rectangular"
                height={200}
                width="100%"
                sx={{borderRadius: 2}}
            />
        );
    }

    const shouldShowToggle = post.content.length > 200;
    const displayedContent = expanded ? post.content : post.content.slice(0, 200);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", padding: 2, bgcolor: "transparent" }}
        >
            <Card
                onClick={handleClick}
                component="article"
                sx={{
                    width: "100%",
                    maxWidth: 600,
                    bgcolor: "#333",
                    borderRadius: 4,
                    cursor: "pointer",
                    p: 2,
                    mb: 2,
                    position: "relative",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                        transform: "scale(1.01)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >

                <Box display="flex" alignItems="center" gap={2}>
                    <UserAvatar className="avatar" user={post.userId} />
                    <Box>
                        <Typography fontWeight="bold" color="white">
                            {post.userId?.username}
                        </Typography>
                        <Typography variant="caption" color="gray">
                            Asked {formatDate(post.date)}
                        </Typography>
                    </Box>
                </Box>

                <CardContent>
                    <Typography
                        variant="h6"
                        color="white"
                        gutterBottom
                        sx={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {post.title}
                    </Typography>

                    <Box sx={{ position: "relative" }}>
                        <Typography
                            variant="body2"
                            color="gray"
                            sx={{
                                whiteSpace: "pre-line",
                                display: "-webkit-box",
                                WebkitLineClamp: expanded ? 'none' : 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {displayedContent}
                        </Typography>

                        {!expanded && shouldShowToggle && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 30,
                                    background: "linear-gradient(to top, #282828, transparent)",
                                }}
                            />
                        )}
                    </Box>

                    {shouldShowToggle && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded((prev) => !prev);
                            }}
                            variant="text"
                            size="small"
                            sx={{
                                mt: 1,
                                color: "primary.main",
                                textTransform: "none",
                                fontWeight: "bold",
                            }}
                        >
                            {expanded ? "Read less" : "Read more"}
                        </Button>
                    )}
                </CardContent>

                <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Like">
                        <IconButton size="small" sx={{ color: "primary.main" }}>
                            <ThumbUp fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="gray">
                        {pluralize(post.likes.length, "like", "likes")}
                    </Typography>
                </Box>


                <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Dislike">
                        <IconButton size="small" sx={{ color: "#f44336" }} aria-label="Dislike this post">
                            <ThumbDown fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="gray">
                        {pluralize(post.dislikes.length, "dislike", "dislikes")}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Tooltip title="Comments">
                        <IconButton
                            aria-label="View comments"
                            size="small"
                            sx={{ color: "#fff", mr: 0.5 }}
                        >
                            <Comment fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="gray">
                        {pluralize(comments.length, "comment", "comments")}
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}