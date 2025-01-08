import config from "../config.json";
import { HttpClientFactory } from "./httpClient";

export class SignUpService {
  httpClientFactory: HttpClientFactory;

  constructor() {
    this.httpClientFactory = new HttpClientFactory();
  }

  signUp(username: string, email: string, password: string) {
    return this.httpClientFactory
      .unauthorizedHttpClient()
      .post(config.signupUrl, {
        username,
        email,
        password,
      });
  }

  googleSignUp(credentials: string) {
    return this.httpClientFactory
      .unauthorizedHttpClient()
      .post(config.signupGoogleUrl, {
        credentials,
      });
  }
}
