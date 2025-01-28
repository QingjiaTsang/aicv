import { streamObject } from "ai";

import type { OptimizeContext } from "./types";

import { createAiClient, type DeepseekConfig } from "./client";
import { aiSuggestionSchema } from "./utils";

export function createOptimizer(config: DeepseekConfig) {
  const aiClient = createAiClient(config);

  return {
    async createOptimizeStream(context: OptimizeContext) {
      const { jobDescription, currentContent } = context;

      const systemPrompt = `
          You are a professional resume optimization consultant. Analyze how well the resume content matches the target position and provide specific optimization suggestions.
          Please return suggestions in the following JSON format:

          type Suggestion = {
            type: "summary" | "experience" | "skills";
            content: string;  // Specific suggestion content
            reason: string;   // Reason for the suggestion
            confidence: number; // Confidence level of suggestion 0.1-1.0
          }

          type Response = {
            suggestions: Suggestion[];
          }

          Notes:
          1. At least one suggestion for each type
          2. Confidence indicates suggestion reliability, range 0.1-1.0
          3. Suggestions should be specific and actionable
          4. Try to use keywords from target position
          5. The response language should be based on the user's input language`;

      const userPrompt = `
          Target Job Description:
          ${jobDescription.content}

          Current Resume Content:
          ${currentContent}

          Please analyze and provide optimization suggestions, focusing on:
          1. Match with target position
          2. Keyword usage
          3. Skills demonstration
          4. Achievement descriptions
          5. Professional terminology usage`;

      const prompt = aiClient.createPrompt([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      return streamObject({
        model: aiClient.model,
        output: "array",
        schema: aiSuggestionSchema,
        prompt,
      });
    },
  };
}
