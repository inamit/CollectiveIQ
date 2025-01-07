import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { InputAdornment, Button, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BellIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AppTextField from "./TextField/TextField";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Signup from "../pages/Signup/Signup";

function getUserActions(navigate: NavigateFunction) {
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
      <Avatar alt="User">AI</Avatar>
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
          navigate("/signup");
        }}
      >
        Sign Up
      </Button>
    </span>
  );
}

function NavBar(props: { user?: any }) {
  const navigate = useNavigate();
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
          {props.user ? getUserActions(navigate) : getGuestActions(navigate)}
        </span>
      </nav>
    </div>
  );
}

export default NavBar;
