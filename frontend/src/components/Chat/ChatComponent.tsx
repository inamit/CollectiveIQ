import { useEffect, useState } from "react";
import UserDropdown from "../UsersList/UsersDropDown.tsx";
import User from "../../models/user.ts";
import { useUser } from "../../context/userContext.tsx";
import { UsersService } from "../../services/usersService.ts";
import { useNavigate } from "react-router";
import { routes } from "../../router/routes.ts";
import socket from "../../sockets/socket.ts";

const ChatComponent = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { user, setUser, totalUnreadCount } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const usersService = new UsersService(user, setUser);
            const { request } = usersService.getAllUsers();
            request
                .then((response) => {
                    const filtered = response.data
                        .filter((u: User) => u._id !== user._id && !u.isAI)
                    setUsers(filtered);
                    filtered.forEach(receiver => {
                        socket.emit("getUnreadCountPerSender", { userId: user._id, fromUserId: receiver._id });
                    });
                })
                .catch((err) => {
                    console.error(err);
                });

            socket.on("unreadCountPerSender", (data: { fromUserId: string; unreadCount: number }) => {
                setUsers(prevUsers => {
                    return prevUsers.map(u => {
                        if (u._id === data.fromUserId) {
                            return { ...u, unreadCount: data.unreadCount };
                        }
                        return u;
                    });
                });
            });

            return () => {
                socket.off("unreadCountPerSender");
            };
        }
    }, [user, setUser]);

    const handleSelectUser = (selectedUser: User) => {
        navigate(`${routes.USER_PROFILE}/${selectedUser._id}`, {
            state: { tab: "chat" }
        });
    };
    return (
        <div>
            {user && (
                <UserDropdown
                    users={users.filter(receiver => receiver._id !== user._id)}
                    onSelectUser={handleSelectUser}
                    totalUnreadCount={totalUnreadCount}
                />
            )}
        </div>
    );
};

export default ChatComponent;