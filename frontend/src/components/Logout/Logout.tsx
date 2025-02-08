import { useNavigate } from "react-router";
import { routes } from "../../router/routes";
import { useUser } from "../../context/userContext";
import { AuthenticationService } from "../../services/authenticationService";
import { MenuItem } from "@mui/material";
import { toast } from "react-toastify";

export default function Logout(){
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        let authenticationService = new AuthenticationService();
        if(user?.refreshToken != null){
            authenticationService.signOut(user?.refreshToken).then((res) => {
                if(res.status === 200){
                    localStorage.clear();
                    setUser(null);
                    navigate(routes.SIGN_UP);
                }
            }).catch((error) => {
                console.error(error)
                toast.error("Error during sign out, try again!");
            })
        }
    }
    return <MenuItem onClick={handleLogout}>Sign out</MenuItem> 
}