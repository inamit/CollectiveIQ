import {AxiosInstance} from "axios";
import User from "../models/user.ts";
import {HttpClientFactory} from "./httpClient.ts";
import config from "../config.json";
import Chat from "../models/chat.ts";

export class ChatService {
    httpClient: AxiosInstance;

    constructor(user?: User, setUser?: (user: User | null) => void) {
        const httpClientFactory = new HttpClientFactory(user, setUser);
        this.httpClient = user
            ? httpClientFactory.authorizedHttpClient()
            : httpClientFactory.unauthorizedHttpClient();
    }

    getChatHistory(receiverId: string, senderId: string) {
        const controller = new AbortController();
        const request = this.httpClient.get<Chat[]>(
            `${config.backendURL}/chats/${receiverId}/${senderId}`,
            {
                signal: controller.signal,
            }
        );

        return {request, cancel: () => controller.abort()};
    }
}