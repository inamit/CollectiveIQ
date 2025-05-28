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
    question: "<|user|>{question}. Give your opinion about this<|end|>",
    answer: "<|assistant|>{answer}",
  },
  mistral: {
    question: "# Question: {question}",
    answer: "# Answer: {answer}",
  },
};

export function formatPrompt(template: string, values: Record<string, string>) {
  return template.replace(/{(\w+)}/g, (_, key) => values[key] ?? "");
}