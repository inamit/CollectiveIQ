import "./LikesSection.css";

import { IconButton, Typography } from "@mui/material";
import {
  ThumbUpAltOutlined as ThumbUpAltOutlinedIcon,
  ThumbUpAlt as ThumbUpAltIcon,
  ThumbDownAltOutlined as ThumbDownAltOutlinedIcon,
  ThumbDownAlt as ThumbDownAltIcon,
} from "@mui/icons-material";
import User from "../../models/user";
import Likeable from "../../models/likeable";
import { AbsLikeableService } from "../../services/abslikeableService";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface LikesSectionProps {
  currentUser: User | null;
  likeable: Likeable;
  likeableService: AbsLikeableService;
  refresh: () => void;
}

export const LikesSection = ({
  currentUser,
  likeable,
  likeableService,
  refresh,
}: LikesSectionProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    if (likeable && currentUser) {
      setLiked(likeable.likes.includes(currentUser._id));
      setDisliked(likeable.dislikes.includes(currentUser._id));
    }
  }, [likeable?.likes, likeable?.dislikes]);

  const handleReaction = (type: "like" | "dislike") => {
    const { request } =
      type === "like"
        ? likeableService.like(likeable._id)
        : likeableService.dislike(likeable._id);

    request
      .then(() => {
        refresh();
      })
      .catch((err) => {
        if (err.response?.status === StatusCodes.UNAUTHORIZED) {
          toast.error("You need to be logged in to like a post");
        } else {
          toast.error("Failed to like post");
        }
        console.error(err);
      });
  };

  return (
    <>
      <IconButton
        onClick={() => handleReaction("like")}
        sx={{ color: liked ? "#5B6DC9" : "inherit" }}
        disabled={!currentUser}
      >
        {liked ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
        <Typography paddingLeft="10px">{likeable?.likes.length}</Typography>
      </IconButton>
      <IconButton
        onClick={() => handleReaction("dislike")}
        sx={{ color: disliked ? "#E57373" : "inherit" }}
        disabled={!currentUser}
      >
        {disliked ? <ThumbDownAltIcon /> : <ThumbDownAltOutlinedIcon />}
        <Typography paddingLeft="10px">{likeable?.dislikes.length}</Typography>
      </IconButton>
    </>
  );
};
