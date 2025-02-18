import { streamObject, streamText } from "ai";

import type { OptimizeContext } from "./types";

import { createAiClient, type DeepseekConfig } from "./client";
import { aiSuggestionSchema } from "./utils";

export function createOptimizer(config: DeepseekConfig) {
  const aiClient = createAiClient(config);

  return {
    async createOptimizeStream(context: OptimizeContext) {
      const { jobDescription, currentContent } = context;

      const systemPrompt = `
          You are a professional resume optimization consultant. Analyze how well the resume content matches the target position and provide specific optimization suggestions and explanations.
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

export function createOptimizeText(config: DeepseekConfig) {
  const aiClient = createAiClient(config);

  return {
    async createOptimizeTextStream(context: OptimizeContext) {
      const { messages, jobDescription, currentContent, sections } = context;

      const systemMessage = {
        role: "system" as const,
        content: `
          You are a professional resume optimization consultant. Your role is to help users optimize their resumes through interactive chat.
          
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
          6. All your response should be based on the user's input language

          Resume Context:
          Job Description: ${jobDescription.content}
          ${sections
            ? `Resume Sections:
          ${sections.map(section => `
          ## ${section.type.toUpperCase()}
          ${section.content}
          `).join("\n")}`
            : `Current Resume Content:
          ${currentContent}`}

          Please analyze and provide optimization suggestions, focusing on:
          1. Match with target position
          2. Keyword usage
          3. Skills demonstration
          4. Achievement descriptions
          5. Professional terminology usage

          For each section, provide specific suggestions on:
          - Content improvement
          - Keyword optimization
          - Achievement highlighting
          - Professional terminology
        `,
      };

      const chatMessages = messages?.length
        ? messages
        : [{
            role: "user" as const,
            content: "Please analyze the current resume content and provide optimization suggestions.",
          }];

      return streamText({
        model: aiClient.model,
        messages: [systemMessage, ...chatMessages],
      });
    },
  };
}
