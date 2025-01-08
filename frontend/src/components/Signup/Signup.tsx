import "./signup.css";
import { toast } from "react-toastify";
import { GoArrowRight } from "react-icons/go";
import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useUserCredentials } from "../../hooks/userCredentials.tsx";
import { SignUserUp, GoogleSignUserUp } from "../../services/Signup/SignupService.tsx";

export default function Signup({ className }) {
  const { username, setUsername, password, setPassword, email, setEmail } = useUserCredentials();
  const [passwordVerification, setPasswordVerification] = useState("");

  const checkInput = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) && valid) {
      valid = false;
      toast.error("Invalid email address. Please try again.");
    }

    else if (password !== passwordVerification && valid) {
      valid = false;
      toast.error("Passwords do not match. Please try again.");
    }

    else if (password.length < 8 && valid) {
      valid = false;
      toast.error("Password must be at least 8 characters long. Please try again.");
    }

    return valid;
  };

  const resetVariables = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordVerification("");
  }

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

  const onGoogleSignInSuccess = async (response) => {
    const credential = response.credential;;
    try {
      let res = await GoogleSignUserUp(credential);

      if (res.status === 200) {
        toast.success("Signed up successfully");
        resetVariables();
      } else {
        const errorMessage = await res.text();
        toast.error(JSON.parse(errorMessage).error || "Error in sign in");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
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
        <input
          className="signup-input"
          maxLength={30}
          type="text"
          value={username}
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Email</div>
        <input
          className="signup-input"
          maxLength={50}
          type="email"
          value={email}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Password</div>
        <input
          className="signup-input"
          maxLength={30}
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Verify Password</div>
        <input
          className="signup-input"
          maxLength={30}
          type="password"
          value={passwordVerification}
          placeholder="Verify Password"
          onChange={(e) => setPasswordVerification(e.target.value)}
        />
      </div>
      <div className="signup-buttons-row">
        <button
          onClick={onSignupButtonClicked}
          className="signup-button"
        >
          Sign Up <GoArrowRight />
        </button>
        <GoogleLogin
          onSuccess={onGoogleSignInSuccess}
          onError={onGoogleSignInFailure}
          containerProps={{ className: "google-login-button" }}
        />
      </div>
    </div>
  );
}