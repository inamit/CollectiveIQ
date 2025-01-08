import { useEffect } from "react";
import { useUserCredentials } from "../hooks/userCredentials";
import { useNavigate } from "react-router-dom";
import { USER_PROFILE_ROUTE } from "./UserProfile/UserProfile";
import { SIGN_UP_ROUTE } from "./Signup/Signup";

export default function AuthRedirect() {
  const { user } = useUserCredentials();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(USER_PROFILE_ROUTE);
    } else {
      navigate(SIGN_UP_ROUTE);
    }
  }, [user, navigate]);

  return <></>;
}
