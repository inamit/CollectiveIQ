import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SIGN_UP_ROUTE } from "../pages/SignUp/Signup";
import { useUser } from "../context/userContext";

const useAuth = () => {
  const { user, isUserLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoaded && !user) {
      navigate(SIGN_UP_ROUTE);
      return;
    }

    return () => {};
  }, [user, isUserLoaded]);

  return { user, isUserLoaded };
};

export default useAuth;
