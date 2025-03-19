import { Request, Response } from "express";
import { getGeminiResponse, getFalconResponse, getMistralResponse } from "../services/aiService";

const handleAIResponse = (getResponse: (input: string) => Promise<string>) => {
  return async (req: Request, res: Response): Promise<any> => {
    const { input } = req.body;

    try {
      const response = await getResponse(input);
      return res.json({ response });
    } catch (error) {
      console.error("Error handling AI response:", error);
      return res.status(500).json({ error: "Failed to fetch AI response" });
    }
  };
};

export const handleGeminiResponse = handleAIResponse(getGeminiResponse);
export const handleFalconResponse = handleAIResponse(getFalconResponse);
export const handleMistralResponse = handleAIResponse(getMistralResponse);