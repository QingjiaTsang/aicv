import { z } from "zod";

export const jobDescriptionSchema = z.object({
  content: z.string().min(1, "Job description cannot be empty"),
  title: z.string().optional(),
  company: z.string().optional(),
});
export type JobDescription = z.infer<typeof jobDescriptionSchema>;

export type OptimizeContext = {
  jobDescription: JobDescription;
  currentContent: string;
};
