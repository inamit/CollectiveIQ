import { HttpClientFactory } from "./httpClient";
import config from "../config.json";
import Post from "../models/post";
import User from "../models/user";
import { AxiosInstance } from "axios";

export class CommentsService {
  httpClient: AxiosInstance;

  constructor(user?: User, setUser?: (user: User | null) => void) {
    const httpClientFactory = new HttpClientFactory(user, setUser);
    this.httpClient = user
      ? httpClientFactory.authorizedHttpClient()
      : httpClientFactory.unauthorizedHttpClient();
  }

  getCommentsByPost(postId: string) {
    const controller = new AbortController();
    const request = this.httpClient.get<Comment[]>(
      `${config.backendURL}/comments?post_id=${postId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  saveNewComment(content: string, postId: string) {
    const controller = new AbortController();

    let request = this.httpClient.post<Post>(
      `${config.backendURL}/comments?post_id=${postId}`,
      { content },
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}
