import { getAIResponse } from "../services/ai_service";
import Post from "../models/posts_model";
import { Request, Response } from "express";


export const handleAIResponse = async (req: Request, res: Response): Promise<any> => {
  const { input, parentCommentID, model } = req.body;
  const { post_id } = req.query;

  try {
    const post = await Post.findById(post_id).populate("userId");
    if (!post) return res.status(404).json({ error: "Post not found" });

    const response = await getAIResponse(
      model,
      post.content,
      input,
      post_id as string,
      parentCommentID
    );
    res.json({ response });
  } catch (error) {
    console.error("Error handling AI response:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
};