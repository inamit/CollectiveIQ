import { Box, Button, TextField } from "@mui/material"
import { useUser } from "../../context/userContext";
import { useState } from "react";
import { UsersService } from "../../services/usersService";
import UserAvatar from "../UserAvatar/UserAvatar";
import User from "../../models/user";
import { jwtDecode } from "jwt-decode";

export default function EditProfile() {
  const { user, setUser } = useUser();
  const usersService = user
      ? new UsersService(user, setUser)
      : new UsersService();
  const [username, setUserName] = useState(user?.username || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserName(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(user != null){
        const res = (await usersService.updateUserById(user._id, username)).request;
        console.log(res)
        if(res.status === 200){
            const responseJson = res.data;
            const decodedAccessToken = jwtDecode<User>(responseJson.accessToken);
            setUser({
                username: decodedAccessToken.username,
                email: decodedAccessToken.email,
                refreshToken: responseJson.refreshToken,
                accessToken: responseJson.accessToken,
                _id: decodedAccessToken._id,
            });
        }
    }
  };

    return (
        <Box
        component="form"
        sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: 500,
            margin: "20px auto",
            padding: 2,
            boxShadow: 3,
            borderRadius: 2,
            justifyContent: "center",
            alignItems: "center"

        }}
        >   
            <UserAvatar className="userAvatar" user={user || undefined} />
            <TextField
                label="UserName"
                name="username"
                value={username}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputProps={{
                    style: { backgroundColor: '#e0e0e0',
                        borderRadius: "10px"
                    }
                }}
                InputLabelProps={{
                    style: { color: 'white',
                    position: 'absolute', // Move label higher
                    top: '-15px',
                    fontSize: '1.4rem'
                    } 
                }}
            />
      <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
        Save Changes
      </Button>
    </Box>
    )
}