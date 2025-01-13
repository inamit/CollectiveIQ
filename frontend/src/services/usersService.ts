import { HttpClientFactory } from "./httpClient";
import config from "../config.json";
import User from "../models/user";
import { AxiosInstance } from "axios";

export class UsersService {
  httpClient: AxiosInstance;

  constructor(user?: User, setUser?: (user: User | null) => void) {
    const httpClientFactory = new HttpClientFactory(user, setUser);
    this.httpClient = user
      ? httpClientFactory.authorizedHttpClient()
      : httpClientFactory.unauthorizedHttpClient();
  }

  getUserById(userId: string) {
    const controller = new AbortController();

    const request = this.httpClient.get<User>(
      `${config.backendURL}/users/${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  async updateUserById(userId: string, username: string, email: string, password: string) {
    const controller = new AbortController();
    const request = await this.httpClient.patch(
      `${config.backendURL}/users/${userId}`, {
      signal: controller.signal,
      username,
      email,
      password,
    });

    return { request, cancel: () => controller.abort() };
  }
}
