import "./signup.css";
import { toast } from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import { AuthenticationService } from "../../services/authenticationService.ts";
import { Button } from "@mui/material";
import AppTextField from "../../components/TextField/TextField.tsx";
import { useNavigate } from "react-router";
import { useUser } from "../../context/userContext.tsx";
import { routes } from "../../router/routes.ts";
import { jwtDecode } from "jwt-decode";
import User from "../../models/user.ts";
import { AxiosResponse } from "axios";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth.tsx";

interface SignUpProps {
  className?: string;
}

export default function SignUp({ className }: SignUpProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState("");

  const { setUser } = useUser();
  const navigate = useNavigate();

  const checkInput = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) && valid) {
      valid = false;
      toast.error("Invalid email address. Please try again.");
    } else if (password !== passwordVerification && valid) {
      valid = false;
      toast.error("Passwords do not match. Please try again.");
    } else if (password.length < 8 && valid) {
      valid = false;
      toast.error(
        "Password must be at least 8 characters long. Please try again."
      );
    }

    return valid;
  };

  const userSignedUpSuccessfully = (
    response: AxiosResponse<{ accessToken: string; refreshToken: string }>
  ) => {
    toast.success("Signed up successfully");

    const responseJson = response.data;
    const decodedAccessToken = jwtDecode<User>(responseJson.accessToken);
    setUser({
      username: decodedAccessToken.username,
      email: decodedAccessToken.email,
      refreshToken: responseJson.refreshToken,
      accessToken: responseJson.accessToken,
      _id: decodedAccessToken._id,
    });
    navigate(routes.HOME);
  };

  const onSignupButtonClicked = async () => {
    if (checkInput()) {
      let authenticationService = new AuthenticationService();

      authenticationService
        .signUp(username, email, password)
        .then((response) => {
          if (response.status === 200) {
            userSignedUpSuccessfully(response);
          } else {
            const errorMessage = response.data;
            toast.error(JSON.parse(errorMessage).error || "Error in sign in");
          }
        })
        .catch((error) => {
          console.log("Error in sign up: ", error);
          toast.error("An error occurred. Please try again.");
        });
    }
  };

  return (
    <div className={`signup-inputs-flexbox ${className}`}>
      <h1>Sign Up</h1>
      <p>Sign up to start posting and viewing</p>
      <div className="input-wrapper">
        <div className="bold">Username</div>
        <AppTextField
          className="signup-input"
          slotProps={{ htmlInput: { maxLength: 30 } }}
          type="text"
          value={username}
          placeholder="Enter Username"
          onChange={(e: any) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Email</div>
        <AppTextField
          className="signup-input"
          slotProps={{ htmlInput: { maxLength: 50 } }}
          type="email"
          value={email}
          placeholder="Enter Email"
          onChange={(e: any) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Password</div>
        <AppTextField
          className="signup-input"
          slotProps={{ htmlInput: { maxLength: 30 } }}
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={(e: any) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Verify Password</div>
        <AppTextField
          className="signup-input"
          slotProps={{ htmlInput: { maxLength: 30 } }}
          type="password"
          value={passwordVerification}
          placeholder="Verify Password"
          onChange={(e: any) => setPasswordVerification(e.target.value)}
        />
      </div>
      <div className="signup-buttons-row">
        <Button
          variant="contained"
          onClick={onSignupButtonClicked}
          className="signup-button"
        >
          Sign Up <ArrowForwardIcon />
        </Button>
        <GoogleAuth/>
      </div>
    </div>
  );
}
