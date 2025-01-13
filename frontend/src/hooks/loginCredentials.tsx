import { useState } from "react";

export function useLoginCredentials() {
  const [data, setData] = useState({ username: "", password: "" });

  return {data, setData};
}