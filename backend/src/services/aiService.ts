import { HfInference } from "@huggingface/inference";
import fetch from "node-fetch";
import config from "../config/aiConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Comment from "../models/comments_model";
import Post from "../models/posts_model";

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

const saveAIResponseAsComment = async (postId: string, content: string, modelId: string): Promise<void> => {
    try {
        const postExists = await Post.exists({ _id: postId });
        if (!postExists) {
            throw new Error("Post not found.");
        }

        const comment = new Comment({
            postID: postId,
            content,
            userId: modelId,
            date: new Date(),
        });

        await comment.save();
        console.log("AI response saved as a comment.");
    } catch (error) {
        console.error("Error saving AI response as a comment:", error);
        throw error;
    }
};

export const getFalconResponse = async (input: string, postId: string): Promise<string> => {
    const formattedInput = `# Question: ${input}\n#Answer:`;
    const response = await fetchHuggingFaceResponse(config.FalconApiUrl, formattedInput);
    await saveAIResponseAsComment(postId, response, process.env.Falcon_userId || "");
    return response;
};

export const getMistralResponse = async (input: string, postId: string): Promise<string> => {
    const formattedInput = `# Question: ${input}\n# Answer:`;
    const response = await fetchHuggingFaceResponse(config.MistralApiUrl, formattedInput);
    await saveAIResponseAsComment(postId, response, process.env.Mistral_userId || "");
    return response;
};

export const getGeminiResponse = async (input: string, postId: string): Promise<string> => {
    try {
        const formattedInput = `answer me in the format of: # Question: ${input}\n# Answer:`;
        const result = await model.generateContent(formattedInput);
        const response = result.response.text().trim();
        console.log("Generated Answer (Gemini 1.5 Flash):", response);
        await saveAIResponseAsComment(postId, response, process.env.Gemini_userId || "");
        return response;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
    }
};