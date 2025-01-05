import "./Signup.css";
import CryptoJS from "crypto-js";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import config from '../../config.json';
import { GoArrowRight } from "react-icons/go";
import React, { useState, useEffect } from "react";
import { useUserCredentials } from "../../hooks/userCredentials.tsx";
import { SignUserUp } from "../../services/Signup/SignupService.tsx";

export default function Signup({ className }) {
  const { username, setUsername, password, setPassword, email, setEmail } = useUserCredentials();
  const [passwordVerification, setPasswordVerification] = useState("");

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.querySelector('script[src="https://apis.google.com/js/platform.js"]')) {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          gapi.load("client:auth2", () => {
            gapi.client.init({
              clientId: config.googleClientid,
              scope: "email",
            }).catch(() => {
              toast.error("Failed to initialize Google connection. Please try again.");
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

  const onSignupButtonClicked = async () => {
    if (password !== passwordVerification) {
      toast.error("Passwords do not match. Please try again.");
    } else {
      try {
        let response = await SignUserUp(username, email, password);

        if (response.status === 200) {
          toast.success("Signed up successfully");
          setUsername("");
          setEmail("");
          setPassword("");
          setPasswordVerification("");
        } else {
          const errorMessage = await response.text();
          toast.error(JSON.parse(errorMessage).error || "Error in sign in");
        }
      } catch (error) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  };

  const onGoogleSignInSuccess = async (response) => {
    const profile = response.getBasicProfile();
    const googleEmail = profile.getEmail();
    const googleUsername = profile.getName();
    const googlePassword = CryptoJS.SHA256(googleEmail).toString(CryptoJS.enc.Hex);

    setUsername(googleUsername);
    setEmail(googleEmail);
    setPassword(googlePassword);
    setPasswordVerification(googlePassword);

    onSignupButtonClicked();
  };

  const onGoogleSignInFailure = (error) => {
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
      <p>Sign up to ask questions and start interacting with AI</p>
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
          onBlur={(e) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(e.target.value)) {
              setEmail("")
            }
          }}
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
        <button
          onClick={onGoogleSignupButtonClicked}
          className="signup-button"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}