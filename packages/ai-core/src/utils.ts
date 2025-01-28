import { z } from "zod";

export const aiSuggestionSchema = z.object({
  type: z.enum(["summary", "experience", "skills"]),
  content: z.string().min(1, "Content cannot be empty"),
  reason: z.string().optional(),
  confidence: z.number().min(0.1).max(1),
});
export type AiSuggestion = z.infer<typeof aiSuggestionSchema>;