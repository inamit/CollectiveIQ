import { styled, TextField } from "@mui/material";
import { theme } from "../../theme";

const AppTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    background: theme.palette.secondary.main,
    borderRadius: "12px",
    color: "#fff",
  },
});

export default AppTextField;
