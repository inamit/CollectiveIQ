import { useState } from "react";
import PostsList from "../../components/PostsList/PostsList";
import "./UserProfile.css";
import { Box, Button, Tab, Tabs } from "@mui/material";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { LoadingState } from "../../services/loadingState";
import usePosts from "../../hooks/usePosts";
import useAuth from "../../hooks/useAuth";

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
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { user, isUserLoaded } = useAuth();

  const { posts, postsLoadingState } =
    isUserLoaded && user
      ? usePosts()
      : { posts: null, postsLoadingState: LoadingState.LOADING };

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
                <UserAvatar className="userAvatar" user={user!} />
                <div className="userDetailsText">
                  <h1>@{user?.username}</h1>
                  <span>
                    {user?.posts ? `${user?.posts?.length} questions` : ""}
                  </span>
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

          <Box
            sx={{
              p: 0,
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
            }}
          >
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Questions" />
              <Tab label="Answers" />
            </Tabs>
          </Box>
          <CustomTabPanel value={selectedTab} index={0}>
            <PostsList
              maxPostsPerPage={5}
              posts={posts ?? []}
              loadingState={postsLoadingState}
            />
          </CustomTabPanel>
          <CustomTabPanel value={selectedTab} index={1}>
            <PostsList
              posts={[]}
              maxPostsPerPage={5}
              loadingState={LoadingState.LOADING}
            />
          </CustomTabPanel>
        </div>
      </div>
    </>
  );
}
