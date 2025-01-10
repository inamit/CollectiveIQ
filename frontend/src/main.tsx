import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config.json";
import { UserProvider } from "./context/userContext.tsx";
import RouterWrapper from "./router/RouterWrapper.tsx";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={config.googleClientid}>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <RouterWrapper />
        </ThemeProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
