import { HttpClientFactory } from "./httpClient";
import config from "../config.json";

export class LogOutService {
    httpClientFactory: HttpClientFactory;
    constructor() {
        this.httpClientFactory = new HttpClientFactory();
    }

    logout() {
        return this.httpClientFactory
            .unauthorizedHttpClient()
            .post(config.signupUrl, {});
    }
}