import axios, { AxiosResponse } from "axios"
import { ILoginModel, ITokenData } from "../models/SignInModel";
import config from '../../config.json';

const bufferTime = 5000;
const millisecondsPerSecond = 1000;

const login = (data: ILoginModel): Promise<AxiosResponse> => {
    return axios.post(config.backendURL + config.signinUrl, { username: data.username, password: data.password }, {
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
    const expirationTime = tokenData.exp * millisecondsPerSecond;
    const currentTime = Date.now();

    return expirationTime > (currentTime + bufferTime);
}

export { login, getToken, setToken, isValidToken };