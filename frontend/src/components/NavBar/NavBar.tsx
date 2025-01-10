import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BellIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AppTextField from "../TextField/TextField";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SIGN_UP_ROUTE } from "../../pages/SignUp/Signup";
import User from "../../models/user";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useUser } from "../../context/userContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="navbarContainer">
      <nav className="navbar">
        <span className="navbarAppTitle">
          <img src={appIcon} alt="app icon" className="appIcon" />
          <h1 className="appLabel">CollectiveIQ</h1>
        </span>
        <span className="navbarActions">
          <AppTextField
            id="search"
            placeholder="Search"
            size="small"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          {user ? getUserActions(user, navigate) : getGuestActions(navigate)}
        </span>
      </nav>
    </div>
  );
}

function getUserActions(user: User, navigate: NavigateFunction) {
  return (
    <span className="userActions">
      <Button
        variant="contained"
        color="primary"
        style={{ borderRadius: "12px" }}
      >
        Ask a Question
      </Button>
      <Button
        variant="contained"
        color="secondary"
        style={{ borderRadius: "12px" }}
      >
        <BellIcon />
      </Button>
      <UserAvatar user={user} />
    </span>
  );
}

function getGuestActions(navigate: NavigateFunction) {
  return (
    <span className="guestActions">
      <Button variant="contained" color="primary">
        Sign In
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          navigate(SIGN_UP_ROUTE);
        }}
      >
        Sign Up
      </Button>
    </span>
  );
}
