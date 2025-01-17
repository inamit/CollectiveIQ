import {useState} from "react";
import {
    Box,
    Menu,
    MenuItem,
    Button,
} from "@mui/material";
import User from "../../models/user.ts";

const UserDropdown = ({users, onSelectUser}: { users: User[]; onSelectUser: (user: User) => void }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
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
            <Button color="primary"
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
            <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                      sx: {
                          backgroundColor: "#1e1e1e",
                          color: "white",
                          borderRadius: 1,
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
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
                        {user.username}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default UserDropdown;
