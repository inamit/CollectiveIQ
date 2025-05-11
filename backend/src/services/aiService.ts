import { HfInference } from "@huggingface/inference";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Comment from "../models/comments_model";
import Post from "../models/posts_model";
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
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

const saveAIResponseAsComment = async (postId: string, content: string, modelId: string, parentCommentID: string | null): Promise<void> => {
    try {
        const postExists = await Post.exists({ _id: postId });
        if (!postExists) {
            throw new Error("Post not found.");
        }

        const comment = new Comment({
            postID: postId,
            parentCommentID: parentCommentID,
            content,
            userId: modelId,
            date: new Date(),
        });

        await comment.save();
        console.log("Huggingface AI response saved as a comment.");
    } catch (error) {
        console.error("Error saving AI response as a comment:", error);
        throw error;
    }
};

export const getPhiResponse = async (input: string, postId: string, parentCommentID?: string): Promise<string> => {
    const formattedInput = `<|user|>${input}<|end|><|assistant|>`;
    const response = await fetchHuggingFaceResponse(process.env.Phi_API_URL || "", formattedInput);
    await saveAIResponseAsComment(postId, response, process.env.Phi_USERID || "", parentCommentID || null);
    return response;
};

export const getMistralResponse = async (input: string, postId: string, parentCommentID?: string): Promise<string> => {
    const formattedInput = `# Question: ${input}\n# Answer:`;
    const response = await fetchHuggingFaceResponse(process.env.MISTRAL_API_URL || "", formattedInput);
    await saveAIResponseAsComment(postId, response, process.env.MISTRAL_USERID || "", parentCommentID || "");
    return response;
};

export const getGeminiResponse = async (input: string, postId?: string, parentCommentID?: string): Promise<string> => {
    try {
        const result = await model.generateContent(input);
        const response = result.response.text().trim();
        if (postId != null) {
            await saveAIResponseAsComment(postId, response, process.env.GEMINI_USERID || "", parentCommentID || "");
        }
        return response;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
    }
};