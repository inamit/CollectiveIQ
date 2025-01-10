import { HttpClientFactory } from "./httpClient";
import config from "../config.json";
import Post from "../models/post";
import User from "../models/user";

export class PostsService {
  httpClientFactory: HttpClientFactory;

  constructor(user: User, setUser: (user: User | null) => void) {
    this.httpClientFactory = new HttpClientFactory(user, setUser);
  }

  getPostsByUser(userId: string) {
    const controller = new AbortController();
    const request = this.httpClientFactory
      .authorizedHttpClient()
      .get<Post[]>(`${config.backendURL}/posts?userId=${userId}`, {
        signal: controller.signal,
      });

    return { request, cancel: () => controller.abort() };
  }
}
