import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BellIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AppTextField from "../TextField/TextField";
import { NavigateFunction, useNavigate } from "react-router-dom";
import User from "../../models/user";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useUser } from "../../context/userContext";
import { routes } from "../../router/routes";
import DropDown from "../DropDown/DropDown";

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
          {user ? getUserActions(user) : getGuestActions(navigate)}
        </span>
      </nav>
    </div>
  );
}

function getUserActions(user: User) {
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
      <DropDown></DropDown>
      <UserAvatar user={user} />
    </span>
  );
}

function getGuestActions(navigate: NavigateFunction) {
  return (
    <span className="guestActions">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
          navigate(routes.SIGN_IN);
        }}>
        Sign In
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          navigate(routes.SIGN_UP);
        }}
      >
        Sign Up
      </Button>
    </span>
  );
}
