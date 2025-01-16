import config from '../config.json';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(config.AIapiKey);
const model = genAI.getGenerativeModel({ model: config.AImodel });

export const getAIResponse = async (input: string): Promise<string> => {
    try {
        const message: string = "summarize me this in two sentences: " + input;
        const result = await model.generateContent(message);
        return result.response.text().trim();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
};
