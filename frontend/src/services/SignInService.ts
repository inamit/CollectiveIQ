import axios, { AxiosResponse } from "axios"
import { ILoginModel } from "../models/SignInModel";
import config from '../config.json';
import { jwtDecode } from 'jwt-decode';

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

const deleteToken = (TokenName: string) => {
    localStorage.removeItem(TokenName);
}

const getTokenData = (tokenName: string) => {
    const token = getToken(tokenName);
    if (token == null) {
        return null;
    }

    try {
        return jwtDecode(token)
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}

const isValidToken = (tokenName: string) => {
    const tokenData = getTokenData(tokenName);
    if (tokenData == null || tokenData.exp == null) {
        return false;
    }
    const expirationTime = tokenData.exp * millisecondsPerSecond;
    const currentTime = Date.now();

    return expirationTime > (currentTime + bufferTime);
}

const refreshAccessToken = async () => {
    const refreshToken = getToken('refreshToken');

    if (!refreshToken) {
        console.error('No refresh token found');
        return false;
    }
    try {
        const response = await axios.post(config.backendURL + config.refreshTokenURL, { refreshToken: refreshToken });
        if (response.status !== 200) {
            console.error('Failed to refresh access token');
            return false;
        }

        deleteToken("accessToken");
        deleteToken("refreshToken");

        setToken(response.data.accessToken, 'accessToken');
        setToken(response.data.refreshToken, 'refreshToken')

        return true;
    } catch (error) {
        console.error('Failed to fetch refresh token');
    }
};


export { login, getToken, setToken, isValidToken, refreshAccessToken };