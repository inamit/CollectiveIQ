import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/userContext";
import { routes } from "../router/routes";

export default function AuthRedirect() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.HOME);
    } else {
      navigate(routes.SIGN_UP);
    }
  }, [user]);

  return <></>;
}
