import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { USER_PROFILE_ROUTE } from "./UserProfile/UserProfile";
import { SIGN_UP_ROUTE } from "./SignUp/Signup";
import { useUser } from "../context/userContext";

export default function AuthRedirect() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(USER_PROFILE_ROUTE);
    } else {
      navigate(SIGN_UP_ROUTE);
    }
  }, [user]);

  return <></>;
}
