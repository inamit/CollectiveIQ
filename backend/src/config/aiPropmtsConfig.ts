export interface AIPromptConfig {
  question: string;
  answer: string;
}

export const CHALLENGE_ME_PROMPT: AIPromptConfig = {
  question: "Here is a question: {question}.",
  answer: "This is the answer: {answer}. Criticize the given answer, pointing out flaws, missing logic, or weaknesses. Then, provide your own answer to the question that you believe is stronger, more accurate, or more convincing.",
};

export const DEFAULT_QUESTION_PROMPT =
  "Answer the question. Provide a detailed response. If appropriate, give examples, pros and cons, etc. Don't repeat this prompt in your answer.";

export function formatPrompt(template: string, values: Record<string, string>) {
  return template.replace(/{(\w+)}/g, (_, key) => values[key] ?? "");
}