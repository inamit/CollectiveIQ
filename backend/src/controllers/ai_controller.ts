import { Request, Response } from "express";
import { getGeminiResponse, getFalconResponse, getMistralResponse } from "../services/aiService";

export const handleGeminiResponse = async (req: Request, res: Response): Promise<any> => {
  const { input } = req.body;

  try {
    const response = await getGeminiResponse(input);
    return res.json({ response });
  } catch (error) {
    console.error("Error handling AI response:", error);
    return res.status(500).json({ error: "Failed to fetch AI response" });
  }
};

export const handleFalconResponse = async (req: Request, res: Response): Promise<any> => {
  const { input } = req.body;

  try {
    const response = await getFalconResponse(input);
    return res.json({ response });
  } catch (error) {
    console.error("Error handling Falcon response:", error);
    return res.status(500).json({ error: "Failed to fetch Falcon response" });
  }
};

export const handleMistralResponse = async (req: Request, res: Response): Promise<any> => {
  const { input } = req.body;

  try {
    const response = await getMistralResponse(input);
    return res.json({ response });
  } catch (error) {
    console.error("Error handling Mistral response:", error);
    return res.status(500).json({ error: "Failed to fetch Mistral response" });
  }
};