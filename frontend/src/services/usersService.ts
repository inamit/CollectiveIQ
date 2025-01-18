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

  async updateUserById(
    userId: string,
    options: { username?: string; image?: File }
  ) {
    const { username, image } = options;
    const controller = new AbortController();
    const formData = new FormData();
    if (username) {
      formData.append("username", username);
    }
    if (image) {
      formData.append("file", image);
    }
    const request = await this.httpClient.patch(
      `${config.backendURL}/users/${userId}`, formData,
      {
        signal: controller.signal,
      });

    return { request, cancel: () => controller.abort() };
  }

  async updateUserProfileImage(image: File) {
    const controller = new AbortController();
    const formData = new FormData();
    formData.append('file', image);

    const request = await this.httpClient.post(
      `${config.backendURL}${config.avatarUpload}`, formData, {
      headers: {
        'Content-Type': 'image/jpeg'
      }
    })

    return { request, cancel: () => controller.abort() };
  }
}
