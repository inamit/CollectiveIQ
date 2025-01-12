import { Box, Button, TextField } from "@mui/material"
import { useUser } from "../../context/userContext";
import { useState } from "react";
import { UsersService } from "../../services/usersService";

export default function EditProfile() {
  const { user, setUser } = useUser();
  const usersService = user
      ? new UsersService(user, setUser)
      : new UsersService();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "*******",
    verifyPassword: "*******"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(user != null){
        const res = (await usersService.updateUserById(user._id, formData.username)).request;
    }
  };
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user context with the new data

    alert("Profile updated successfully!");
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user context with the new data

    alert("Profile updated successfully!");
  };

    return (
        <Box
        component="form"
        sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: 500,
            margin: "50px auto",
            padding: 2,
            boxShadow: 3,
            borderRadius: 2,
        }}
        >
            <TextField
                label="Name"
                name="username"
                value={formData.username}
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
            <Button type="submit" variant="contained" color="primary" onClick={handleNameSubmit}>
                Username Save
            </Button>
            <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                type="email"
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
            <Button type="submit" variant="contained" color="primary">
                Email Save
            </Button>
            <TextField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                type="password"
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
            <TextField
                label="Verify Password"
                name="Verify Password"
                value={formData.verifyPassword}
                onChange={handleChange}
                variant="outlined"
                type="password"
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
      <Button type="submit" variant="contained" color="primary">
        Save Password Changes
      </Button>
    </Box>
    )
}