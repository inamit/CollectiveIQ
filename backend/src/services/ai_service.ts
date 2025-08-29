import {
  CHALLENGE_ME_PROMPT,
  DEFAULT_QUESTION_PROMPT,
  formatPrompt,
} from "../config/aiPropmtsConfig";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Comment from "../models/comments_model";
import Post from "../models/posts_model";
import { GROQ_MODELS } from "../config/groqModelsConfig";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

export const fetchGroqResponse = async (
  input: string,
  modelName: string
): Promise<string> => {
  try {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: input }],
        temperature: 0.1,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${errorMessage}`
      );
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error fetching from Groq:", error);
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
  let formattedInput = formatPrompt(CHALLENGE_ME_PROMPT.question, { question });

  if (answer) {
    formattedInput += " " + formatPrompt(CHALLENGE_ME_PROMPT.answer, { answer });
  } else {
    formattedInput += " " + DEFAULT_QUESTION_PROMPT;
  }

  let response: string;
  if (model === "gemini") {
    const result = await geminiModel.generateContent(formattedInput);
    response = result.response.text().trim();
  } else {
    const groqModel = GROQ_MODELS[model];
    if (!groqModel) {
      throw new Error(`Unknown or unsupported model: ${model}`);
    }
    response = await fetchGroqResponse(formattedInput, groqModel);
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
