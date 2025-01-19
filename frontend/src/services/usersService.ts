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

  getAllUsers() {
    const controller = new AbortController();

    const request = this.httpClient.get<User[]>(
        `${config.backendURL}/users/`,
        {
          signal: controller.signal,
        }
    );

    return { request, cancel: () => controller.abort() };
  }
}
