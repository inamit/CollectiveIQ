import {useEffect, useState} from "react";
import UserDropdown from "../UsersList/UsersDropDown.tsx";
import User from "../../models/user.ts";
import {useUser} from "../../context/userContext.tsx";
import {UsersService} from "../../services/usersService.ts";
import ChatBoxComponent from "./ChatBoxComponent.tsx";

interface IMessage {
    senderId: string;
    message: string;
}
const ChatComponent = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const {user, setUser} = useUser();


    useEffect(() => {
        if (user) {
            const usersService = new UsersService(user!, setUser);
            const {request} = usersService.getAllUsers();
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
        setSelectedUser(selectedUser);
        setMessages([]);
    };

    return (
        <div>
            {user && (<UserDropdown users={users} onSelectUser={handleSelectUser}/>)}
            {selectedUser && user && (
                <ChatBoxComponent
                    open={Boolean(selectedUser)}
                    onClose={() => setSelectedUser(null)}
                    user={user}
                    senderId={user._id}
                    receiverId={selectedUser._id}
                />
            )}
        </div>
    );
};

export default ChatComponent;