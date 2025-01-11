import { DropdownItem } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { LogOutService } from "../../services/logoutService";
import { routes } from "../../router/routes";
import { useUser } from "../../context/userContext";

export default function Logout(){
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        let logoutService = new LogOutService();
        logoutService.logout()
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        navigate(routes.SIGN_UP);
    }
    return <DropdownItem onClick={handleLogout}>Sign out</DropdownItem> 
}