import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { InputAdornment, Button, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BellIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AppTextField from "./TextField/TextField";

function getUserActions() {
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

function getGuestActions() {
  return (
    <span className="guestActions">
      <Button variant="contained" color="primary">
        Sign In
      </Button>
      <Button variant="contained" color="secondary">
        Sign Up
      </Button>
    </span>
  );
}

function NavBar(props: { user?: any }) {
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
          {props.user ? getUserActions() : getGuestActions()}
        </span>
      </nav>
    </div>
  );
}

export default NavBar;
