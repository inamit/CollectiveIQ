import { useState } from "react";
import { ILoginModel } from "../models/SignInModel";

export function useLoginCredentials() {
  const [data, setData] = useState<ILoginModel>({ username: "", password: "" });

  return {data, setData};
}