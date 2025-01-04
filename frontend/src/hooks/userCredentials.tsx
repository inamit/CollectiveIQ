import { useState } from "react";

export function useUserCredentials() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  return {username, setUsername, password, setPassword, email, setEmail};
}