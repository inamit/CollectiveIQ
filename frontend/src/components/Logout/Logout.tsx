import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";
import { useUser } from "../../context/userContext";
import { AuthenticationService } from "../../services/authenticationService";
import { MenuItem } from "@mui/material";

export default function Logout(){
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        let authenticationService = new AuthenticationService();
        authenticationService.signOut()
        sessionStorage.clear();
        setUser(null);
        navigate(routes.SIGN_UP);
    }
    return <MenuItem onClick={handleLogout}>Sign out</MenuItem> 
}