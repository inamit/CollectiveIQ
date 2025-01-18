import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import { useUser } from "../context/userContext";
import AuthRedirect from "../pages/AuthRedirect";
import UserProfile from "../pages/UserProfile/UserProfile";
import { routes } from "./routes";
import AuthRequired from "../pages/AuthRequired";
import CreatePost from "../pages/CreatePost/CreatePost.tsx";
import PostComponent from "../pages/Post/Post.tsx";
import SignUp from "../pages/Signup/Signup";
import SignIn from "../pages/Signin/Signin";
import HomePage from "../pages/HomePage/HomePage";

export default function AppWrapper() {
  const { isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <div>Loading</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.HOME} element={<App />}>
          <Route index element={<HomePage />} />
          <Route
            path={routes.USER_PROFILE}
            element={
              <AuthRequired>
                <UserProfile />
              </AuthRequired>
            }
          />
          <Route
            path={routes.USER_PROFILE + "/:userId"}
            element={<UserProfile />}
          />
          <Route path={routes.SIGN_UP} element={<SignUp />} />
          <Route path={routes.SIGN_IN} element={<SignIn />} />
          <Route
            path={routes.CREATE_POST}
            element={
              <AuthRequired>
                <CreatePost />
              </AuthRequired>
            }
          />
          <Route path={routes.POST + "/:postId"} element={<PostComponent />} />
          <Route path="*" element={<AuthRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}