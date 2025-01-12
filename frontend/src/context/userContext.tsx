import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import User from "../models/user";

interface UserContextProps {
  user: User | null;
  setUser: (userData: User | null) => void;
  isUserLoaded: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }

    setIsUserLoaded(true);
  }, []);

  const setUser = (userData: User | null) => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
    setUserState(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isUserLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext not found");
  return context;
}
