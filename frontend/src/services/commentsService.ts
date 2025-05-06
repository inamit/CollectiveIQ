import config from "../config.json";
import User from "../models/user";
import Comment from "../models/comment";
import { AbsLikeableService } from "./abslikeableService";

export class CommentsService extends AbsLikeableService {
  constructor(user?: User, setUser?: (user: User | null) => void) {
    super("comments", user, setUser);
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

  getComments() {
    const controller = new AbortController();
    const request = this.httpClient.get<Comment[]>(
      `${config.backendURL}/comments`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getCommentsByUser(userId: string) {
    const controller = new AbortController();
    const request = this.httpClient.get<Comment[]>(
      `${config.backendURL}/comments/by_user?userId=${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  saveNewComment(content: string, postId: string) {
    const controller = new AbortController();

    let request = this.httpClient.post<Comment>(
      `${config.backendURL}/comments?post_id=${postId}`,
      { content },
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  deleteComment(commentId: string) {
    const controller = new AbortController();
    let request = this.httpClient.delete<Comment>(
      `${config.backendURL}/comments/${commentId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}
