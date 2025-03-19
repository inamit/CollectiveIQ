import { HfInference } from "@huggingface/inference";
import fetch from "node-fetch";
import config from "../config/aiConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(config.GeminiAIapiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const fetchHuggingFaceResponse = async (url: string, input: string): Promise<string> => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: input,
                parameters: { max_new_tokens: 50, temperature: 0.7 }
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        console.log("Generated Answer:", data[0]?.generated_text || "No response");
        return data[0]?.generated_text;
    } catch (error) {
        console.error("Error fetching from Hugging Face:", error);
        throw error;
    }
};

export const getFalconResponse = async (input: string): Promise<string> => {
    return fetchHuggingFaceResponse(config.FalconApiUrl, input);
};

export const getMistralResponse = async (input: string): Promise<string> => {
    const formattedInput = `### User: ${input}\n### Assistant:`;
    return fetchHuggingFaceResponse(config.MistralApiUrl, formattedInput);
};

export const getGeminiResponse = async (input: string): Promise<string> => {
    try {
        const result = await model.generateContent(input);
        console.log("Generated Answer (Gemini 1.5 Flash):", result.response.text().trim());
        return result.response.text().trim();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
};