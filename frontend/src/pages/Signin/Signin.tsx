import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginCredentials } from "../../hooks/loginCredentials";
import { GoogleLogin } from "@react-oauth/google";
import { AuthenticationService } from "../../services/authenticationService";
import AppTextField from "../../components/TextField/TextField";
import { Button } from "@mui/material";
import { useUser } from "../../context/userContext";
import { routes } from "../../router/routes";
import { jwtDecode } from "jwt-decode";
import User from "../../models/user";

export default function SignIn(){
  const {data, setData} = useLoginCredentials();
  const { setUser } = useUser();
  
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setData({ ...data, [id]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data.username.trim() || !data.password.trim()){
      toast.error("Please fill all the fields");
    } else {
        let authenticationService = new AuthenticationService();
        
        authenticationService.signIn(data.username, data.password)
        .then((response) => {
          if (response.status === 200) {
            const decodedAccessToken = jwtDecode<User>(response.data.accessToken);
                setUser({
                  username: decodedAccessToken.username,
                  email: decodedAccessToken.email,
                  refreshToken: response.data.refreshToken,
                  accessToken: response.data.accessToken,
                  _id: decodedAccessToken._id,
                });

            navigate(routes.USER_PROFILE);
          } else {
          toast.error("Status code error: " + response.status);
        }})
      }
  }

  const handleGoogleLoginSuccess = async (response: any) => {
    const credential = response.credential;
    let authenticationService = new AuthenticationService();
    
    authenticationService
      .google(credential)
      .then((res) => {
        if (res.status === 200) {
          const decodedAccessToken = jwtDecode<User>(res.data.accessToken);
              setUser({
                username: decodedAccessToken.username,
                email: decodedAccessToken.email,
                refreshToken: res.data.refreshToken,
                accessToken: res.data.accessToken,
                _id: decodedAccessToken._id,
              });

          navigate(routes.USER_PROFILE);
        } else {
          const errorMessage = res.data;
          toast.error(JSON.parse(errorMessage).error || "Error in sign in");
        }
      })
      .catch((error) => {
        console.log("Error in google sign in: ", error);
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleGoogleLoginError = () => {
    toast.error("Google Sign-In failed. Please try again.");
  };

  return (
    <div className={`signup-inputs-flexbox`}>
      <form onSubmit={handleFormSubmit}>
        <h1>Sign In</h1>
        <p>Sign In to start posting and viewing</p>
        <div className="input-wrapper">
        <div className="bold">Username</div>
        <AppTextField
          type="text"
          id="username"
          placeholder="Enter your username"
          value={data.username}
          onChange={handleInputChange}
          className="signup-input"
          required
        />
      </div>
      <div className="input-wrapper">
        <div className="bold">Password</div>
        <AppTextField
          type="password"
          id="password"
          placeholder="Enter your password"
          value={data.password}
          onChange={handleInputChange}
          className="signup-input"
          required
        />
      </div>
      <div className="signup-buttons-row">
          <Button type="submit" className="signin-button" variant="contained">Log In</Button>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            containerProps={{ className: "google-login-button" }}
            text="signin_with"
            shape="pill"
            context="signup"
            useOneTap
          />
      </div>
      <div className="social">
              <p className="social-text">Don't have an account? <Link to="/Signup" className="signin-button">Signup</Link></p>
          </div>
      </form>
    </div>
  );
};