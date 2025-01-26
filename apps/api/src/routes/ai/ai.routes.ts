import type { Context } from "hono";

import { aiSuggestionSchema, jobDescriptionSchema } from "@aicv-app/ai-core";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import type { AppEnv } from "@/api/lib/types";

const optimizeRequestSchema = z.object({
  jobDescription: jobDescriptionSchema,
  currentContent: z.string().min(1, "Resume content cannot be empty"),
});

const optimizeResponseSchema = z.object({
  suggestions: z.array(aiSuggestionSchema),
});

export const optimizeRoute = createRoute({
  method: "post",
  path: "/ai/optimize",
  tags: ["AI"],
  description: "Use AI to optimize resume content",
  request: {
    body: jsonContent(optimizeRequestSchema, "Resume optimization request"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(optimizeResponseSchema, "Optimization suggestions"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(z.object({
      message: z.string(),
    }), "Request error"),
  },
});

export type OptimizeRequest = z.infer<typeof optimizeRequestSchema>;
export type OptimizeResponse = z.infer<typeof optimizeResponseSchema>;
export type OptimizeContext = Context<AppEnv, "/ai/optimize">;
