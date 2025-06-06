import { Request, Response } from "express";
import {
  getGeminiResponse,
  getPhiResponse,
  getMistralResponse,
} from "../services/ai_service";
import Post, { IPost } from "../models/posts_model";

const handleAIResponse = (
  getResponse: (
    input: string,
    postId: string,
    parentCommentID: string
  ) => Promise<string>
) => {
  return async (req: Request, res: Response): Promise<void> => {
    const { input, parentCommentID } = req.body;
    const { post_id }: { post_id?: string } = req.query;

    try {
      const post: IPost | null = await Post.findById(post_id).populate(
        "userId"
      );
      const formattedInput = `Here is a question: ${post?.content}. 
        This is the answer: ${input}. Give your opinion on the answer.`;
      const response = await getResponse(
        formattedInput,
        post_id || "",
        parentCommentID
      );
      res.json({ response });
    } catch (error) {
      console.error("Error handling AI response:", error);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  };
};

export const handleGeminiResponse = handleAIResponse(getGeminiResponse);
export const handlePhiResponse = handleAIResponse(getPhiResponse);
export const handleMistralResponse = handleAIResponse(getMistralResponse);
