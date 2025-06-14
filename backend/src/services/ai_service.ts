import {
  AI_PROMPTS,
  DEFAULT_QUESTION_PROMPT,
  formatPrompt,
} from "../config/aiPropmtsConfig";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Comment from "../models/comments_model";
import Post from "../models/posts_model";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const fetchHuggingFaceResponse = async (
  url: string,
  input: string
): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${errorMessage}`
      );
    }

    const data = await response.json();
    console.log("Generated Answer:", data[0]?.generated_text || "No response");
    return data[0]?.generated_text;
  } catch (error) {
    console.error("Error fetching from Hugging Face:", error);
    throw error;
  }
};

const saveAIResponseAsComment = async (
  postId: string,
  content: string,
  modelId: string,
  parentCommentID?: string
): Promise<void> => {
  try {
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      throw new Error("Post not found.");
    }

    const comment = new Comment({
      postID: postId,
      content,
      parentCommentID: parentCommentID ?? null,
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

export const getAIResponse = async (
  model: string,
  question: string,
  answer: string | undefined,
  postId: string,
  addComment: boolean,
  parentCommentID?: string
): Promise<string> => {
  const prompts = AI_PROMPTS[model];
  if (!prompts) throw new Error("Unknown AI model");

  let formattedInput = formatPrompt(prompts.question, { question });

  if (answer) {
    formattedInput += " " + formatPrompt(prompts.answer, { answer });
  } else {
    formattedInput += " " + DEFAULT_QUESTION_PROMPT;
  }

  let response: string;
  if (model === "gemini") {
    const result = await geminiModel.generateContent(formattedInput);
    response = result.response.text().trim();
  } else {
    const url =
      model === "phi"
        ? process.env.PHI_API_URL
        : model === "mistral"
        ? process.env.MISTRAL_API_URL
        : "";
    response = await fetchHuggingFaceResponse(url || "", formattedInput);
  }

  if (addComment) {
    await saveAIResponseAsComment(
      postId,
      response,
      process.env[`${model.toUpperCase()}_USERID`] || "",
      parentCommentID
    );
  }
  return response;
};
