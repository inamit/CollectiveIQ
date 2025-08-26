export interface AIPromptConfig {
  question: string;
  answer: string;
}

export const CHALLENGE_ME_PROMPT: AIPromptConfig = {
  question: "Here is a question: {question}.",
  answer: "This is the answer: {answer}. Give your opinion on the answer.",
};

export const DEFAULT_QUESTION_PROMPT =
  "Answer the question. Provide a detailed response. If appropriate, give examples, pros and cons, etc. Don't repeat this prompt in your answer.";

export function formatPrompt(template: string, values: Record<string, string>) {
  return template.replace(/{(\w+)}/g, (_, key) => values[key] ?? "");
}