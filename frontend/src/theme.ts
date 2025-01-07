import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#617AFA",
    },
    secondary: {
      main: "#3D404A",
    },
    background: {
      default: "#1c1c21",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
});
