import { useEffect, useState } from "react";
import UserDropdown from "../UsersList/UsersDropDown.tsx";
import User from "../../models/user.ts";
import { useUser } from "../../context/userContext.tsx";
import { UsersService } from "../../services/usersService.ts";
import { useNavigate } from "react-router";
import { routes } from "../../router/routes.ts";

const ChatComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const usersService = new UsersService(user, setUser);
            const { request } = usersService.getAllUsers();
            request
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [user]);

    const handleSelectUser = (selectedUser: User) => {
        navigate(`${routes.USER_PROFILE}/${selectedUser._id}`, {
            state: { tab: "chat" }
        });
    };

    return (
        <div>
            {user && (
                <UserDropdown
                    users={users}
                    onSelectUser={handleSelectUser}
                />
            )}
        </div>
    );
};

export default ChatComponent;
