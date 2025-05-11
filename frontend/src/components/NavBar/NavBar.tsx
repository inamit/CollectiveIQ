import React, {useState} from "react";
import "./NavBar.css";
import appIcon from "/appIcon.svg";
import {
    Button,
    InputAdornment,
    Menu,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {NavigateFunction, useNavigate} from "react-router";
import User from "../../models/user";
import UserAvatar from "../UserAvatar/UserAvatar";
import {useUser} from "../../context/userContext";
import {routes} from "../../router/routes";
import Logout from "../Logout/Logout";
import AppTextField from "../TextField/TextField.tsx";
import {usePostsContext} from "../../context/postsContext.tsx";
export default function NavBar() {
    const navigate = useNavigate();
    const {user} = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const {searchValue, setSearchValue} = usePostsContext();


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function getUserActions(user: User, navigate: NavigateFunction) {
        return (
            <span className="userActions">
    <div className="searchWrapper">
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
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                    endAdornment:
                        searchValue ? (
                            <InputAdornment position="end">
                                <Button
                                    size="small"
                                    onClick={() => setSearchValue("")}
                                    style={{
                                        minWidth: 0,
                                        padding: "4px",
                                        marginRight: "-8px",
                                    }}
                                >
                                    ❌
                                </Button>
                            </InputAdornment>
                        ) : null,
                },
            }}
        />

    </div>

                <div className="rightActions">
                    <Button
                        variant="contained"
                        color="primary"
                        style={{borderRadius: "12px"}}
                        onClick={() => {
                            navigate(routes.CREATE_POST);
                        }}
                    >
                        Ask a Question
                    </Button>
                    <Button onClick={handleClick}>
                        <UserAvatar user={user}/>
                    </Button>
                </div>

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
                    <Logout/>
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
                    <img src={appIcon} alt="app icon" className="appIcon"/>
                    <h1 className="appLabel">CollectiveIQ</h1>
                </span>
                <span className="navbarActions">
                    {user ? getUserActions(user, navigate) : getGuestActions(navigate)}
                </span>
            </nav>
        </div>
    );
}
