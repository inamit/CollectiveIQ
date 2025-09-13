import { useState } from "react";
import {
    Box,
    Menu,
    MenuItem,
    Button,
    ListItemText,
    ListItemIcon,
    Badge
} from "@mui/material";
import User from "../../models/user.ts";
import UserAvatar from "../UserAvatar/UserAvatar.tsx";

const UserDropdown = ({
    users,
    onSelectUser,
    totalUnreadCount, // New prop
}: {
    users: User[];
    onSelectUser: (user: User) => void;
    totalUnreadCount: number; // New prop type
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectUser = (user: User) => {
        onSelectUser(user);
        handleCloseMenu();
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                left: 16,
                zIndex: 1000,
            }}
        >
            <Badge
                badgeContent={totalUnreadCount}
                color="error"
                // The "invisible" prop hides the badge when totalUnreadCount is 0
                invisible={totalUnreadCount === 0}
            >
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOpenMenu}
                    sx={{
                        backgroundColor: "primary",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#333",
                        },
                    }}
                >
                    Start a conversation with
                </Button>
            </Badge>
            <Menu
                sx={{ maxHeight: 400 }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            maxHeight: 400,
                            overflowY: "auto",
                            backgroundColor: "#1e1e1e",
                            color: "white",
                            borderRadius: 1,
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                        },
                    },
                }}
            >
                {users?.map((user, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleSelectUser(user)}
                        sx={{
                            "&:hover": {
                                backgroundColor: "#333",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ marginRight: "10px" }}>
                            <UserAvatar user={user} />
                        </ListItemIcon>
                        <ListItemText primary={user.username} />
                        {user.unreadCount > 0 && (
                            <Badge
                                badgeContent={user.unreadCount}
                                color="error"
                                sx={{
                                    marginLeft: '16px',
                                    "& .MuiBadge-badge": {
                                        padding: "0 4px",
                                        height: "18px",
                                        minWidth: "18px",
                                        fontSize: "12px",
                                    },
                                }}
                            />
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default UserDropdown;