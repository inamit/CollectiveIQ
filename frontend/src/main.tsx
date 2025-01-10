import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProfile, {
  USER_PROFILE_ROUTE,
} from "./pages/UserProfile/UserProfile.tsx";
import SignUp, { SIGN_UP_ROUTE } from "./pages/SignUp/Signup.tsx";
import AuthRedirect from "./pages/AuthRedirect.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config.json";
import { UserProvider, useUser } from "./context/userContext.tsx";

const AppWrapper = () => {
  const { isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <div>Loading</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path={USER_PROFILE_ROUTE} element={<UserProfile />} />
          <Route path={SIGN_UP_ROUTE} element={<SignUp />} />
          <Route path="*" element={<AuthRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={config.googleClientid}>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <AppWrapper />
        </ThemeProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
