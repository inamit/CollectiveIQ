import axios, { CanceledError } from "axios";
import config from "../config.json";
import { jwtDecode } from "jwt-decode";
import User from "../models/user";

export { CanceledError };

export class HttpClientFactory {
  user: User | undefined = undefined;
  setUser: ((user: User | null) => void) | undefined;
  constructor(user?: User, setUser?: (user: User | null) => void) {
    this.user = user;
    this.setUser = setUser;
  }

  unauthorizedHttpClient() {
    return axios.create({ baseURL: config.backendURL });
  }

  authorizedHttpClient() {
    if (!this.user || !this.setUser) {
      throw new Error("User is not authenticated");
    }

    return axios.create({
      baseURL: config.backendURL,
      headers: {
        Authorization: `Bearer ${this.user.accessToken}`,
      },
      transformRequest: (data) => {
        if (this.user && this.user.accessToken && this.user.refreshToken) {
          const decodedAccessToken = jwtDecode(this.user.accessToken);
          const decodedRefreshToken = jwtDecode(this.user.refreshToken);

          if (decodedAccessToken.exp! < Date.now() / 1000) {
            if (decodedRefreshToken.exp! > Date.now() / 1000) {
              this.refreshAccessToken(this.user);
            } else {
              this.setUser!(null);
            }
          }
        }
        return data
      },
    });
  }

  private async refreshAccessToken(user: User) {
    const refreshResponse = await this.unauthorizedHttpClient().post(
      "/users/refresh",
      { refreshToken: user.refreshToken }
    );
    const newTokens = refreshResponse.data;

    user.accessToken = newTokens.accessToken;
    user.refreshToken = newTokens.refreshToken;

    this.setUser!(user);
  }
}
