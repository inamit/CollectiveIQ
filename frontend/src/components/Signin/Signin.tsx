import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ILoginModel } from "../../models/SignInModel";
import { login, setToken } from "../../services/SignInService";


const Login = () => {
  const [data, setData] = useState<ILoginModel>({ username: "", password: "" });

  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setData({ ...data, [id]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data.username == "" || data.password == ""){
        alert("Please fill all the fields")
    }
    try {
        const res = await login(data);
        if (res.status < 299){
            setToken(res.data.accessToken, "accessToken");
            setToken(res.data.refreshToken, "refreshToken");
            navigate("/");
        } else {
            console.log("res.status error")
            alert("Error while signin!")
        }
    } catch (error) {
        console.log("error login fun")
        alert("Error while signin!")
    }
  }

  return (
   <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={handleFormSubmit}>
        <h3>Login Here</h3>

        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          value={data.username}
          id="username"
          onChange={handleInputChange}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={data.password}
          onChange={handleInputChange}
        />

        <button type="submit">Log In</button>
        <div className="social">
          <h4>
            <Link to="/register">Register</Link>
          </h4>
        </div>
      </form>
    </>
  );
};

export default Login;