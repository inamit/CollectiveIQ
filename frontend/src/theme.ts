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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#9e9e9e",
          "&.Mui-disabled": {
            color: "#000000",
          },
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
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
      styleOverrides: {
        root: {
          backgroundColor: "grey",
        },
      },
    },
  },
});
