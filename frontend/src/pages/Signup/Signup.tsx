import "./signup.css";
import { toast } from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, useEffect } from "react";
import { SignUpService } from "../../services/signUpService.ts";
import { Button } from "@mui/material";
import AppTextField from "../../components/TextField/TextField.tsx";
import { useNavigate } from "react-router-dom";
// import useUser from "../../hooks/useUser";
import { USER_PROFILE_ROUTE } from "../UserProfile/UserProfile.tsx";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../../context/userContext.tsx";

interface SignupProps {
  className?: string;
}

export const SIGN_UP_ROUTE = "/signup";

export default function Signup({ className }: SignupProps) {
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

  const onSignupButtonClicked = async () => {
    if (checkInput()) {
      let signUpService = new SignUpService();

      signUpService
        .signUp(username, email, password)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Signed up successfully");

            const responseJson = response.data;
            setUser({
              username: responseJson.username,
              email: responseJson.email,
              refreshToken: responseJson.refreshTokens[0],
              accessToken: responseJson.accessToken,
              _id: responseJson._id,
            });
            navigate(USER_PROFILE_ROUTE);
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

  const onGoogleSignInSuccess = async (response: any) => {
    const credential = response.credential;
    let signUpService = new SignUpService();

    signUpService
      .googleSignUp(credential)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Signed up successfully");
        } else {
          const errorMessage = res.data;
          toast.error(JSON.parse(errorMessage).error || "Error in sign in");
        }
      })
      .catch((error) => {
        console.log("Error in google sign up: ", error);
        toast.error("An error occurred. Please try again.");
      });
  };

  const onGoogleSignInFailure = () => {
    toast.error("Google Sign-In failed. Please try again.");
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
          onChange={(e) => setUsername(e.target.value)}
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setPasswordVerification(e.target.value)}
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
        <GoogleLogin
          onSuccess={onGoogleSignInSuccess}
          onError={onGoogleSignInFailure}
          containerProps={{ className: "google-login-button" }}
          text="signup_with"
          shape="pill"
          useOneTap
          context="signup"
        />
      </div>
    </div>
  );
}
