import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { AuthenticationService } from "../../services/authenticationService";
import { useNavigate } from "react-router";
import { useUser } from "../../context/userContext";
import { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import User from "../../models/user";
import { routes } from "../../router/routes";

export default function GoogleAuth() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const userSignedUpSuccessfully = (
    response: AxiosResponse<{ accessToken: string; refreshToken: string }>
  ) => {
    toast.success("Signed up successfully");

    const responseJson = response.data;
    const decodedAccessToken = jwtDecode<User>(responseJson.accessToken);
    setUser({
      username: decodedAccessToken.username,
      email: decodedAccessToken.email,
      refreshToken: responseJson.refreshToken,
      accessToken: responseJson.accessToken,
      _id: decodedAccessToken._id,
    });
    navigate(routes.HOME);
  };

  const onGoogleSignInSuccess = async (response: any) => {
    const credential = response.credential;
    let authenticationService = new AuthenticationService();

    authenticationService
      .google(credential)
      .then((res) => {
        if (res.status === 200) {
          userSignedUpSuccessfully(res);
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
    <GoogleLogin
      onSuccess={onGoogleSignInSuccess}
      onError={onGoogleSignInFailure}
      containerProps={{ className: "google-login-button" }}
      text="continue_with"
      shape="pill"
      context="signup"
    />
  );
}
