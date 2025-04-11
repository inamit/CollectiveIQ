import "./UserDetails.css";
import { Box, Typography } from "@mui/material";
import { SmartToy as SmartToyIcon } from "@mui/icons-material";
import User from "../../models/user";
import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router";
import { routes } from "../../router/routes";

export interface UserDetailsProps {
  user?: User;
  className?: string;
  description?: string;
  userNameTextVariant?: "body1" | "h3";
  descriptionTextVariant?: "caption" | "h6";
  avatarSize?: string | number;
}

export default function UserDetails({
  user,
  description,
  userNameTextVariant = "body1",
  descriptionTextVariant = "caption",
  avatarSize,
}: UserDetailsProps) {
  const navigate = useNavigate();

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        className="user-details"
        onClick={() => navigate(`${routes.USER_PROFILE}/${user?._id}`)}
      >
        <UserAvatar user={user} className="user-avatar" size={avatarSize} />
        <Box display="flex" alignItems="start" flexDirection="column">
          <div className="user-details">
            <Typography variant={userNameTextVariant}>
              {user?.username}
            </Typography>
            {user?.isAI && (
              <SmartToyIcon className="ai-icon" fontSize="small" />
            )}
          </div>
          <Typography variant={descriptionTextVariant} className="description">
            {description}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
