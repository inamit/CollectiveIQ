import axios, { AxiosResponse } from "axios"
import { ILoginModel, ITokenData } from "../models/SignInModel";

const api_url = "http://localhost:3000"
const login = (data: ILoginModel): Promise<AxiosResponse> => {
    return axios.post(api_url + "/users/login", { username: data.username, password: data.password }, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

const setToken = (token: string, tokenLabel: string) => {
    localStorage.setItem(tokenLabel, token);
}

const getToken = (TokenName: string) => {
    return localStorage.getItem(TokenName);
}

const getTokenData = () => {
    const token = getToken("accessToken");
    if (token == null) {
        return null;
    }

    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload)) as ITokenData;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}

const isValidToken = () => {
    const tokenData = getTokenData();
    if (tokenData == null) {
        return false;
    }
    const expirationTime = tokenData.exp * 1000;
    const currentTime = Date.now();

    const bufferTime = 5000;

    return expirationTime > (currentTime + bufferTime);
}

export { login, getToken, setToken, isValidToken };