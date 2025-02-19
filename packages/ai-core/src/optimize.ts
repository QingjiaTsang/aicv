import { streamObject, streamText } from "ai";

import type { OptimizeContext } from "./types";

import { createAiClient, type DeepseekConfig } from "./client";
import { aiSuggestionSchema } from "./utils";

export function createOptimizeObjectStream(config: DeepseekConfig) {
  const aiClient = createAiClient(config);

  return {
    async createOptimizeStream(_context: OptimizeContext) {
      // const { sections } = context;

      const systemPrompt = `
          You are a professional resume optimization consultant. Analyze how well the resume content matches the target position and provide specific optimization suggestions and explanations.
          
          Firstly, you must ask the user to give you the target job description.
          If the user doesn't provide, you should ask the user to provide, otherwise, don't answer anything.

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

export function createOptimizeText(config: DeepseekConfig) {
  const aiClient = createAiClient(config);

  return {
    async createOptimizeTextStream(context: OptimizeContext) {
      const { messages, resumeContext } = context;

      // Note: resume context only has to be one of sections and uploadedResume
      const resumeContent = resumeContext.uploadedResume?.content
        ? resumeContext.uploadedResume.content
        : resumeContext.sections?.content;

      const systemMessage = {
        role: "system" as const,
        content: `
          You are a professional resume optimization consultant. Your role is to help users optimize their resumes through interactive chat.
          
          Firstly, you must ask the user to give you the target job description.
          If the user doesn't provide, you should ask the user to provide, otherwise, don't answer anything.
          
          When analyzing the resume, consider:
          1. You MUST detect the language from user's input and resume content and respond in the SAME language
          2. If input contains multiple languages, prioritize the main language used
          3. Match with target position
          4. Keyword usage and optimization
          5. Skills demonstration and achievements
          6. Professional terminology
          7. Overall structure and formatting
          
          Important notes:
          1. Be concise but professional
          2. Provide specific, actionable suggestions
          3. Use a friendly, supportive tone
          4. Base response language on user's input language
          5. Ask clarifying questions when needed
          
          Resume context:
          ${resumeContent}
        `,
      };

      return streamText({
        model: aiClient.model,
        messages: [systemMessage, ...messages],
      });
    },
  };
}
