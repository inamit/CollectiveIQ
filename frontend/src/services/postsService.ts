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

  getPostById(postId: string) {
    const controller = new AbortController();
    const request = this.httpClient.get<Post>(
      `${config.backendURL}/posts/${postId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  saveNewPost(title: string, content: string, image: File | null) {
    const controller = new AbortController();
    const formData = new FormData();

    if (image) {
      formData.append("file", image);
    }

    formData.append("title", title);
    formData.append("content", content);

    let request = this.httpClient.post<Post>(
      `${config.backendURL}/posts`,
      formData,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | null
  ) {
    const controller = new AbortController();
    const formData = new FormData();

    if (image) {
      formData.append("file", image);
    }
    formData.append("title", title);
    formData.append("content", content);

    let request = this.httpClient.put<Post>(
      `${config.backendURL}/posts/${postId}`,
      formData,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  deletePost(postId: string) {
    const controller = new AbortController();
    let request = this.httpClient.delete<Post>(
      `${config.backendURL}/posts/${postId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}
