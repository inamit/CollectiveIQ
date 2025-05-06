import User from "../models/user";
import { HttpClientFactory } from "./httpClient";
import config from "../config.json";
import { AxiosInstance } from "axios";

export abstract class AbsLikeableService {
  httpClient: AxiosInstance;
  endpoint: string;

  constructor(
    endpoint: string,
    user?: User,
    setUser?: (user: User | null) => void
  ) {
    const httpClientFactory = new HttpClientFactory(user, setUser);
    this.httpClient = user
      ? httpClientFactory.authorizedHttpClient()
      : httpClientFactory.unauthorizedHttpClient();
    this.endpoint = endpoint;
  }

  like(likeableId: string) {
    const controller = new AbortController();
    let request = this.httpClient.post<{
      likesAmount: number;
      dislikesAmount: number;
    }>(
      `${config.backendURL}/${this.endpoint}/${likeableId}/like`,
      {},
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  dislike(likeableId: string) {
    const controller = new AbortController();
    let request = this.httpClient.post<{
      likesAmount: number;
      dislikesAmount: number;
    }>(
      `${config.backendURL}/${this.endpoint}/${likeableId}/dislike`,
      {},
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}
