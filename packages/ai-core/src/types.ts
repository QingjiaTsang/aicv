import { z } from "zod";

export const jobDescriptionSchema = z.object({
  content: z.string().min(1, "Job description cannot be empty"),
  title: z.string().optional(),
  company: z.string().optional(),
});
export type JobDescription = z.infer<typeof jobDescriptionSchema>;

export const resumeSectionSchema = z.object({
  type: z.enum(["summary", "experience", "education", "skills"]),
  content: z.string(),
});
export type ResumeSection = z.infer<typeof resumeSectionSchema>;

export const messagePartSchema = z.object({
  type: z.string(),
  text: z.string(),
});

export const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  parts: z.array(messagePartSchema).optional(),
});

export const optimizeContextSchema = z.object({
  id: z.string(),
  messages: z.array(messageSchema),
  jobDescription: jobDescriptionSchema,
  currentContent: z.string(),
  sections: z.array(resumeSectionSchema).optional(),
});
export type OptimizeContext = z.infer<typeof optimizeContextSchema>;
