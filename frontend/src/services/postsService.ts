import { HttpClientFactory } from "./httpClient";
import config from "../config.json";
import Post from "../models/post";
import User from "../models/user";
import { AxiosInstance } from "axios";

export class PostsService {
  httpClient: AxiosInstance;

  constructor(user?: User, setUser?: (user: User | null) => void) {
    const httpClientFactory = new HttpClientFactory(user, setUser);
    this.httpClient = user
      ? httpClientFactory.authorizedHttpClient()
      : httpClientFactory.unauthorizedHttpClient();
  }

  getPostsByUser(userId: string) {
    const controller = new AbortController();
    const request = this.httpClient.get<Post[]>(
      `${config.backendURL}/posts?userId=${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}
