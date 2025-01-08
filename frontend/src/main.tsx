import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProfile, {
  USER_PROFILE_ROUTE,
} from "./pages/UserProfile/UserProfile.tsx";
import Signup, { SIGN_UP_ROUTE } from "./pages/Signup/Signup.tsx";
import AuthRedirect from "./pages/AuthRedirect.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path={USER_PROFILE_ROUTE} element={<UserProfile />} />
            <Route path={SIGN_UP_ROUTE} element={<Signup />} />
            <Route path="*" element={<AuthRedirect />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
