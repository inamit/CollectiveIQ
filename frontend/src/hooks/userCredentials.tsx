import User from "../models/user";

export function useUserCredentials() {
  const setUser = (userData: User) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const sessionStorageUser = sessionStorage.getItem("user");
  const user: User | null = sessionStorageUser
    ? (JSON.parse(sessionStorageUser!) as User)
    : null;

  return { user, setUser };
}
