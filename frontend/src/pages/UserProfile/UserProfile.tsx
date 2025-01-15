import { useEffect, useState } from "react";
import PostsList from "../../components/PostsList/PostsList";
import "./UserProfile.css";
import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import usePosts from "../../hooks/usePosts";
import { useParams } from "react-router-dom";
import User from "../../models/user";
import { UsersService } from "../../services/usersService";
import { useUser } from "../../context/userContext";
import EditProfile from "../../components/EditProfile/EditProfile";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

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

const getUser = async (
  user: User | null,
  setUser: (user: User | null) => void,
  userId: string
) => {
  const usersService = user
    ? new UsersService(user, setUser)
    : new UsersService();
  const fetchedUser = await usersService.getUserById(userId!).request;

  return { selectedUser: fetchedUser.data };
};

const getSelectedUser = async (
  user: User | null,
  setUser: (user: User | null) => void,
  isUserLoaded: boolean,
  userId: string | undefined
) => {
  if (userId) {
    return await getUser(user, setUser, userId);
  }

  if (isUserLoaded && user) {
    return { selectedUser: user, isUserLoaded: true };
  } else {
    return { selectedUser: undefined, isUserLoaded: false };
  }
};

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { userId } = useParams();
  const { user, setUser, isUserLoaded } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isEdit, setEdit] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const usersService = user
      ? new UsersService(user, setUser)
      : new UsersService();

  const { posts, postsLoadingState } = usePosts(selectedUser);

  useEffect(() => {
    getSelectedUser(user, setUser, isUserLoaded, userId).then(
      ({ selectedUser }) => {
        setSelectedUser(selectedUser);
      }
    );
  }, [user, isUserLoaded]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setEdit(false);
  };

  const handleEditbutton = async () =>{
    if (isEdit) {
      if(user != null){
        const res = (await usersService.updateUserById(user._id, username)).request;
        console.log(res)
        if(res.status === 200){
            const responseJson = res.data;
            const decodedAccessToken = jwtDecode<User>(responseJson.accessToken);
            setUser({
                username: decodedAccessToken.username,
                email: decodedAccessToken.email,
                refreshToken: responseJson.refreshToken,
                accessToken: responseJson.accessToken,
                _id: decodedAccessToken._id,
            });
        } else {
          toast.error(
            "Error while update user, try again later..."
          );
        }
      }
    }
    setEdit((prev) => !prev);
  }
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <>
      <div className="userProfile">
        <div className="userProfileContainer">
          <div className="userDetailsContainer">
            <div className="userDetails">
              <div className="user">
                <UserAvatar className="userAvatar" user={selectedUser!} />
                <div className="userDetailsText">
                  {isEdit ? (
                    <TextField
                      value={username}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="medium"
                      inputProps={{ style: { color: "white" } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#4a4a4a" },
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="h6" color="white">
                      @{username}
                    </Typography>
                  )}
                  <span>
                    {selectedUser?.posts
                      ? `${selectedUser?.posts?.length} questions`
                      : ""}
                  </span>
                </div>
              </div>

              {userId ? (
                <div></div>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ width: "100%", maxWidth: "480px" }}
                  onClick={handleEditbutton}
                >
                   {isEdit ? "Save" : "Edit Profile"}
                </Button>
              )}
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
            <div>Not implemented yet</div>
          </CustomTabPanel>
        </div>
      </div>
    </>
  );
}
