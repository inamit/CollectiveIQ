import "./NavBar.css";
import appIcon from "/appIcon.svg";
import { InputAdornment, Button, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BellIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AppTextField from "./TextField/TextField";

function NavBar() {
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
        </span>
      </nav>
    </div>
  );
}

export default NavBar;
