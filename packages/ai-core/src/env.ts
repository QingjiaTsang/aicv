import { z } from "zod";

export const envSchema = z.object({
  DEEPSEEK_API_KEY: z.string().min(1, "DEEPSEEK_API_KEY is required"),
});

export type Env = z.infer<typeof envSchema>;
