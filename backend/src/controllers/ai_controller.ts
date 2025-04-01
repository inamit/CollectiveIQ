import { Request, Response } from "express";
import { getGeminiResponse, getFalconResponse, getMistralResponse } from "../services/aiService";

const handleAIResponse = (getResponse: (input: string, postId: string) => Promise<string>) => {
  return async (req: Request, res: Response): Promise<void> => {
    const { input } = req.body;
    const { post_id }: { post_id?: string } = req.query;

    try {
      const response = await getResponse(input, post_id || "");
      res.json({ response });
    } catch (error) {
      console.error("Error handling AI response:", error);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }
  };
};

export const handleAllResponses = async (req: Request, res: Response): Promise<any> => {
  const { input } = req.body;
  const { post_id }: { post_id?: string } = req.query;

  try {
    const [geminiResponse, falconResponse, mistralResponse] = await Promise.all([
      getGeminiResponse(input, post_id || ""),
      getFalconResponse(input, post_id || ""),
      getMistralResponse(input, post_id || ""),
    ]);

    return res.json({
      gemini: geminiResponse,
      falcon: falconResponse,
      mistral: mistralResponse,
    });
  } catch (error) {
    console.error("Error handling all AI responses:", error);
    return res.status(500).json({ error: "Failed to fetch AI responses" });
  }
};

export const handleGeminiResponse = handleAIResponse(getGeminiResponse);
export const handleFalconResponse = handleAIResponse(getFalconResponse);
export const handleMistralResponse = handleAIResponse(getMistralResponse);