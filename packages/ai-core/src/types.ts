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
  experimental_attachments: z.array(z.object({
    name: z.string(),
    contentType: z.string(),
    url: z.string(),
  })).optional(),
  parts: z.array(z.object({
    type: z.string(),
    text: z.string(),
  })).optional(),
});

export const optimizeContextSchema = z.object({
  id: z.string(),
  messages: z.array(messageSchema),
  resumeContext: z.object({
    sections: z.object({
      content: z.string(),
    }).nullable(),
    uploadedResume: z.object({
      content: z.string(),
    }).nullable(),
  }),
});
export type OptimizeContext = z.infer<typeof optimizeContextSchema>;
