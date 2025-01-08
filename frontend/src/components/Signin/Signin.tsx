import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ILoginModel } from "../../models/SignInModel";
import { login, setToken } from "../../services/SignInService";
import { toast } from "react-toastify";
import { useLoginCredentials } from "../../hooks/loginCredentials";


const Login = () => {
  const {data, setData} = useLoginCredentials();

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
        try {
            const res = await login(data);
            if (res.status === 200){
                setToken(res.data.accessToken, "accessToken");
                setToken(res.data.refreshToken, "refreshToken");
                navigate("/");
            } else {
              toast.error("Status code error: " + res.status);
            }
        } catch (error) {
            toast.error("Error while signin!");
        }
      }
  }

  return (
    <div className={`signin-inputs-flexbox`}>
      <form onSubmit={handleFormSubmit}>
        <h1>Sign In</h1>
        <p>Sign In to start posting and viewing</p>
        <div className="input-wrapper">
          <div className="bold">Username</div>
          <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={data.username}
                onChange={handleInputChange}
                className="signin-input"
                required
              />
        </div>
        <div className="input-wrapper">
          <div className="bold">Password</div>
          <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={handleInputChange}
              className="signin-input"
              required
            />
        </div>
        <div className="signin-buttons-row">
          <button type="submit" className="signin-button">Log In</button>
        </div>
        <div className="social">
            <p className="social-text">Don't have an account? <Link to="/register" className="signin-button">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;