import "./UserDetails.css";
import { Box, Typography } from "@mui/material";
import { SmartToy as SmartToyIcon } from "@mui/icons-material";
import User from "../../models/user";
import UserAvatar from "./UserAvatar";

export interface UserDetailsProps {
  user: User;
  className?: string;
  description?: string;
}

export default function UserDetails({ user, description }: UserDetailsProps) {
  return (
    <>
      <UserAvatar user={user} className="user-avatar" />
      <Box display="flex" alignItems="start" flexDirection="column">
        <div className="user-details">
          <Typography variant="body1">{user.username}</Typography>
          {user.isAI && <SmartToyIcon className="ai-icon" fontSize="small" />}
        </div>
        <Typography variant="caption" className="description">
          {description}
        </Typography>
      </Box>
    </>
  );
}
