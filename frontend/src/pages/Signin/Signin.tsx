import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthenticationService } from "../../services/authenticationService";
import AppTextField from "../../components/TextField/TextField";
import { Button } from "@mui/material";
import { useUser } from "../../context/userContext";
import { routes } from "../../router/routes";
import { jwtDecode } from "jwt-decode";
import User from "../../models/user";
import GoogleAuth from "../../components/GoogleAuth/GoogleAuth";
import { useState } from "react";

export default function SignIn(){
  const [data, setData] = useState({ username: "", password: "" });
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

            navigate(routes.HOME);
          } else {
          toast.error("Error during sign in, try again!");
        }})
        .catch((error) => {
          console.error('Error occurred:', error);
          toast.error("Error during sign in, try again!");
        })
      }
  }

  return (
    <div className={"signup-inputs-flexbox"}>
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
          <GoogleAuth/>
      </div>
      <div className="social">
              <p className="social-text">Don't have an account? <Link to={routes.SIGN_UP} className="signin-button">Signup</Link></p>
          </div>
      </form>
    </div>
  );
};