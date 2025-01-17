import { HttpClientFactory } from "./httpClient";
import config from "../config.json";
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

  deleteCommentById(commentId: string) {
    const controller = new AbortController();
    const request = this.httpClient.delete<Comment>(
      `${config.backendURL}/comments?commentId=${commentId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}
