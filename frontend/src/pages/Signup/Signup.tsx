import "./signup.css";
import CryptoJS from "crypto-js";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import config from "../../config.json";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, useEffect } from "react";
import { useUserCredentials } from "../../hooks/userCredentials.tsx";
import { SignUserUp } from "../../services/Signup/SignupService.tsx";
import { Button } from "@mui/material";
import AppTextField from "../../components/TextField/TextField.tsx";

interface SignupProps {
  className?: string;
}

export default function Signup({ className }: SignupProps) {
  const { username, setUsername, password, setPassword, email, setEmail } =
    useUserCredentials();
  const [passwordVerification, setPasswordVerification] = useState("");

  useEffect(() => {
    const loadGoogleScript = () => {
      if (
        !document.querySelector(
          'script[src="https://apis.google.com/js/platform.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          gapi.load("client:auth2", () => {
            gapi.client
              .init({
                clientId: config.googleClientid,
                scope: "email",
              })
              .catch(() => {
                toast.error(
                  "Failed to initialize Google connection. Please try again."
                );
              });
          });
        };
        document.body.appendChild(script);
      } else {
        gapi.load("client:auth2", () => {
          gapi.client.init({
            clientId: config.googleClientid,
            scope: "email",
          });
        });
      }
    };

    loadGoogleScript();
  }, []);

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

  const resetVariables = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordVerification("");
  };

  const onSignupButtonClicked = async () => {
    if (checkInput()) {
      try {
        let response = await SignUserUp(username, email, password);

        if (response.status === 200) {
          toast.success("Signed up successfully");
          resetVariables();
        } else {
          const errorMessage = await response.text();
          toast.error(JSON.parse(errorMessage).error || "Error in sign in");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const onGoogleSignInSuccess = async (response: any) => {
    const profile = response.getBasicProfile();
    const googleEmail = profile.getEmail();
    const googleUsername = profile.getName();
    const googlePassword = CryptoJS.SHA256(googleEmail).toString(
      CryptoJS.enc.Hex
    );

    setUsername(googleUsername);
    setEmail(googleEmail);
    setPassword(googlePassword);
    setPasswordVerification(googlePassword);

    onSignupButtonClicked();
  };

  const onGoogleSignInFailure = (error: any) => {
    console.log("Google Sign-In Error: ", error);
    toast.error("Google Sign-In failed. Please try again.");
  };

  const onGoogleSignupButtonClicked = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(onGoogleSignInSuccess).catch(onGoogleSignInFailure);
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
        <Button
          variant="contained"
          color="secondary"
          onClick={onGoogleSignupButtonClicked}
          className="signup-button"
        >
          <GoogleIcon />
          <span className="google-text">Sign Up with Google</span>
        </Button>
      </div>
    </div>
  );
}
