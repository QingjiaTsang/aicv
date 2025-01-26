import { createDeepSeek } from "@ai-sdk/deepseek";

import { type Env, envSchema } from "./env";

export type DeepseekConfig = {
  env: Env;
};

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

let aiClientInstance: ReturnType<typeof createInternalClient> | null = null;

function createInternalClient(config: DeepseekConfig) {
  const env = envSchema.parse(config.env);

  const deepseekClient = createDeepSeek({
    apiKey: env.DEEPSEEK_API_KEY,
  });

  return {
    model: deepseekClient("deepseek-chat"),
    createPrompt(messages: Message[]) {
      return messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
    },
  };
}

export function createAiClient(config: DeepseekConfig) {
  if (!aiClientInstance) {
    aiClientInstance = createInternalClient(config);
  }
  return aiClientInstance;
}
