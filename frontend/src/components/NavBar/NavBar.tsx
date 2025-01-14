import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { InputAdornment, Button, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BellIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AppTextField from "../TextField/TextField";
import { NavigateFunction, useNavigate } from "react-router-dom";
import User from "../../models/user";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useUser } from "../../context/userContext";
import { routes } from "../../router/routes";
import React from "react";
import Logout from "../Logout/Logout";

export default function NavBar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
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
          <Button
            onClick={handleClick}
          >
            <UserAvatar user={user} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <Logout></Logout>
          </Menu>
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
              navigate(routes.SIGN_UP);
            }}
          >
            Sign Up
          </Button>
        </span>
      );
    }
  
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
