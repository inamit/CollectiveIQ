import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { Button, Menu, MenuItem } from "@mui/material";
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
  function getUserActions(user: User, navigate: NavigateFunction) {
    return (
      <span className="userActions">
        <Button
          variant="contained"
          color="primary"
          style={{ borderRadius: "12px" }}
          onClick={() => {
            navigate(routes.CREATE_POST);
          }}
        >
          Ask a Question
        </Button>
        <Button onClick={handleClick}>
          <UserAvatar user={user} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate(routes.USER_PROFILE);
            }}
          >
            Profile
          </MenuItem>
          <Logout></Logout>
        </Menu>
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
          }}
        >
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
        <span
          className="navbarAppTitle"
          onClick={() => {
            navigate(routes.HOME);
          }}
        >
          <img src={appIcon} alt="app icon" className="appIcon" />
          <h1 className="appLabel">CollectiveIQ</h1>
        </span>
        <span className="navbarActions">
          {user ? getUserActions(user, navigate) : getGuestActions(navigate)}
        </span>
      </nav>
    </div>
  );
}
