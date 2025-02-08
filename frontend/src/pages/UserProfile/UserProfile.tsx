import { useEffect, useState } from "react";
import PostsList from "../../components/PostsList/PostsList";
import "./UserProfile.css";
import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import usePosts from "../../hooks/usePosts";
import { useParams } from "react-router";
import User from "../../models/user";
import { UsersService } from "../../services/usersService";
import { useUser } from "../../context/userContext";
import CommentsList from "../../components/CommentsList/CommentsList";
import useComments from "../../hooks/useComments";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { ImagePicker } from "../../components/ImagePicker/ImagePicker";
import ChatBox from "../../components/Chat/ChatBox";

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
  const [username, setUsername] = useState(user?.username);
  const usersService = user
    ? new UsersService(user, setUser)
    : new UsersService();
  const [image, setImage] = useState<File | null>(null);
  const { posts, postsLoadingState } = usePosts(selectedUser);
  const { comments, commentsLoadingState } = useComments(selectedUser);

  useEffect(() => {
    getSelectedUser(user, setUser, isUserLoaded, userId).then(
      ({ selectedUser }) => {
        setSelectedUser(selectedUser);
        setUsername(selectedUser?.username);
      }
    );
  }, [user, isUserLoaded]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setEdit(false);
  };

  const handleEditbutton = async () => {
    if (isEdit && user != null) {
      try {
        const payload: { username?: string; image?: File } = {};
        if (user.username !== username) {
          payload.username = username;
        }

        if (image !== null) {
          payload.image = image;
        }

        if (Object.keys(payload).length > 0) {
          const { request } = await usersService.updateUserById(
            user._id,
            payload
          );

          if (request.status === 200) {
            const responseJson = request.data;
            const decodedAccessToken = jwtDecode<User>(
              responseJson.accessToken
            );
            setUser({
              username: decodedAccessToken.username,
              email: decodedAccessToken.email,
              avatarUrl: decodedAccessToken.avatarUrl,
              refreshToken: responseJson.refreshToken,
              accessToken: responseJson.accessToken,
              _id: decodedAccessToken._id,
            });
            toast.success("User updated successfully!");
          } else {
            toast.error("Error while updating user, try again later...");
          }
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
    setEdit((prev) => !prev);
  };

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
                {isEdit ? (
                  <div className="userDetailsText">
                    <ImagePicker
                      image={image}
                      setImage={setImage}
                      required={false}
                    />
                  </div>
                ) : (
                  <UserAvatar className="userAvatar" user={selectedUser!} />
                )}
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
                    <div>
                      <Typography variant="h3" color="white">
                        {selectedUser?.username}
                      </Typography>
                      <Typography variant="h6" color="white">
                        {selectedUser?.email}
                      </Typography>
                    </div>
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
              {user && userId && <Tab label="Chat" />}
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
            <CommentsList
              maxCommentsPerPage={5}
              comments={comments ?? []}
              loadingState={commentsLoadingState}
            />
          </CustomTabPanel>
          {user && userId && (
            <CustomTabPanel value={selectedTab} index={2}>
              <ChatBox
                open={Boolean(selectedUser)}
                user={user}
                senderId={user._id}
                receiverId={userId}
              />
            </CustomTabPanel>
          )}
        </div>
      </div>
    </>
  );
}
