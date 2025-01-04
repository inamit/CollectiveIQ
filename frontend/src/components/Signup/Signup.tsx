import "./signup.css";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { useUserCredentials } from "../../hooks/userCredentials.tsx";
import { SignUserUp } from "../../services/Signup/SignupService.tsx";

export default function Signup({ className }) {
  const { username, setUsername, password, setPassword, email, setEmail } = useUserCredentials();
  const [passwordVerification, setPasswordVerification] = useState("");

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

  return (
    <div className={`signup-inputs-flexbox ${className}`}>
      <h1>Sign Up</h1>
      <div className="bold">Username</div>
      <input
        className="signup-input"
        maxLength={30}
        type="text"
        value={username}
        placeholder="Enter Username"
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <div className="bold">Password</div>
      <input
        className="signup-input"
        maxLength={30}
        type="password"
        value={password}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="bold">Verify Password</div>
      <input
        className="signup-input"
        maxLength={30}
        type="password"
        value={passwordVerification}
        placeholder="Verify Password"
        onChange={(e) => setPasswordVerification(e.target.value)}
      />
      <button
        onClick={onSignupButtonClicked}
        className="signup-button"
      >
        Sign Up <GoArrowRight />
      </button>
    </div>
  );
}