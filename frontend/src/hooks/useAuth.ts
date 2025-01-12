import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { routes } from "../router/routes";

const useAuth = () => {
  const { user, setUser, isUserLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoaded && !user) {
      navigate(routes.SIGN_UP);
      return;
    }

    return () => {};
  }, [user, isUserLoaded]);

  return { user, setUser, isUserLoaded };
};

export default useAuth;
