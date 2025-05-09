import "./NavBar.css";
import appIcon from "/appIcon.svg";
import {
    Button,
    InputAdornment,
    Menu,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NavigateFunction, useNavigate } from "react-router";
import User from "../../models/user";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useUser } from "../../context/userContext";
import { routes } from "../../router/routes";
import React from "react";
import Logout from "../Logout/Logout";
import AppTextField from "../TextField/TextField.tsx";
import usePosts from "../../hooks/usePosts.ts";

export default function NavBar() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { posts } = usePosts();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const [searchValue, setSearchValue] = React.useState("");

    // Filter posts based on the search value (using title and content)
    const filteredPosts = searchValue.trim()
        ? [...posts].filter((post) =>
            post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            post.content.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function getUserActions(user: User, navigate: NavigateFunction) {
        return (
            <span className="userActions" style={{ position: "relative" }}>
                <AppTextField
                    id="search"
                    placeholder="Search"
                    size="small"
                    variant="outlined"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
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

                {filteredPosts.length > 0 && (
                    <div className="searchResultsDropdownFixed">
                        {filteredPosts.map((post) => (
                            <div
                                key={post._id}
                                className="searchResultItem"
                                onClick={() => {
                                    setSearchValue("");
                                    navigate(`${routes.POST}/${post._id}`);
                                }}
                            >
                                {post.title}
                            </div>
                        ))}
                    </div>
                )}

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
                    open={menuOpen}
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
                    <Logout />
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
