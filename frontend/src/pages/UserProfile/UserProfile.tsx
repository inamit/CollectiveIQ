import { useState } from "react";
import PostsList from "../../components/PostsList/PostsList";
import "./UserProfile.css";
import { Avatar, Box, Button, Tab, Tabs } from "@mui/material";

export const USER_PROFILE_ROUTE = "/profile";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <div className="userProfile">
        <div className="userProfileContainer">
          <div className="userDetailsContainer">
            <div className="userDetails">
              <div className="user">
                <Avatar className="userAvatar">AI</Avatar>
                <div className="userDetailsText">
                  <h1>Amit Inbar</h1>
                  <span>Software developer</span>
                  <span>X questions, X answers</span>
                </div>
              </div>
              <Button
                variant="contained"
                color="secondary"
                style={{ width: "100%", maxWidth: "480px" }}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Questions" />
              <Tab label="Answers" />
            </Tabs>
          </Box>
          <CustomTabPanel value={selectedTab} index={0}>
            <PostsList posts={[]} />
          </CustomTabPanel>
          <CustomTabPanel value={selectedTab} index={1}>
            <PostsList posts={[]} />
          </CustomTabPanel>
        </div>
      </div>
    </>
  );
}
