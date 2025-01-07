import "./UserProfile.css";
import { Avatar, Button } from "@mui/material";

export const USER_PROFILE_ROUTE = "/profile";

export default function UserProfile() {
  return (
    <>
      <div className="userProfile">
        <div className="userDetails">
          <div className="user">
            <Avatar className="userAvatar">AI</Avatar>
            <div className="userDetailsText">
              <h1>Amit Inbar</h1>
              <span>Software developer</span>
              <span>X questions, X answers</span>
            </div>
          </div>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", maxWidth: "480px" }}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </>
  );
}
