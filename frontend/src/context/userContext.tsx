import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import User from "../models/user";
import socket from "../sockets/socket.ts";

interface UserContextProps {
    user: User | null;
    setUser: (userData: User | null) => void;
    isUserLoaded: boolean;
    totalUnreadCount: number; 
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);
    const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
        setIsUserLoaded(true);
    }, []);

    useEffect(() => {
        if (user) {
            socket.on("unreadCount", (data: { unreadCount: number }) => {
                setTotalUnreadCount(data.unreadCount);
            });
            socket.emit("getUnreadCount", { userId: user._id });
            return () => {
                socket.off("unreadCount");
            };
        }
    }, [user]); 

    const setUser = (userData: User | null) => {
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
        setUserState(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUser, isUserLoaded, totalUnreadCount }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("UserContext not found");
    return context;
}