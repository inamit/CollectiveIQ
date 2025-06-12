export interface AIPromptConfig {
  question: string;
  answer: string;
}

export const AI_PROMPTS: Record<string, AIPromptConfig> = {
  gemini: {
    question: "Here is a question: {question}.",
    answer: "This is the answer: {answer}. Give your opinion on the answer.",
  },
  phi: {
    question: "<|user|>{question}.",
    answer: "<|assistant|>{answer} Give your opinion about this answer.<|end|>",
  },
  mistral: {
    question: "# Question: {question}.",
    answer: "# Answer: {answer}. Provide your opinion on the answer.",
  },
};

export const DEFAULT_QUESTION_PROMPT =
  "Answer the question. Provide a detailed response. If appropriate, give examples, pros and cons, etc. Don't repeat this prompt in your answer.";

export function formatPrompt(template: string, values: Record<string, string>) {
  return template.replace(/{(\w+)}/g, (_, key) => values[key] ?? "");
}
