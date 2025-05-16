import { AxiosInstance } from "axios";
import config from "../config.json";
import Tag from "../models/tag";
import { HttpClientFactory } from "./httpClient";
export class TagsService {
    httpClient: AxiosInstance;

    constructor() {
        const httpClientFactory = new HttpClientFactory();
        this.httpClient = httpClientFactory.unauthorizedHttpClient();
    }
    getTags() {
        const controller = new AbortController();
        const request = this.httpClient.get<Tag[]>(`${config.backendURL}/tags`, {
            signal: controller.signal,
        });

        return { request, cancel: () => controller.abort() };
    }

    getTagbyName(tagName: string) {
        const controller = new AbortController();
        const request = this.httpClient.get<Tag>(`${config.backendURL}/tags/get-tag?tagName=${tagName}`, {
            signal: controller.signal,
        });

        return { request, cancel: () => controller.abort() };
    }
}