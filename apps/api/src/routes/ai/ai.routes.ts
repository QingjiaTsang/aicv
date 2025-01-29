import type { Context } from "hono";

import { aiSuggestionSchema, jobDescriptionSchema } from "@aicv-app/ai-core";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

const optimizeRequestSchema = z.object({
  jobDescription: jobDescriptionSchema,
  currentContent: z.string().min(1, "Resume content cannot be empty"),
});
export type OptimizeRequest = z.infer<typeof optimizeRequestSchema>;

export const optimizeRoute = createRoute({
  method: "post",
  path: "/ai/optimize",
  tags: ["AI"],
  description: "Use AI to optimize resume content",
  request: {
    body: jsonContent(optimizeRequestSchema, "Resume optimization request"),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "text/event-stream": {
          schema: aiSuggestionSchema,
        },
      },
      description: "Resume optimization suggestions (streaming)",
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(z.object({
      message: z.string(),
    }), "Request error"),
  },
});

export type OptimizeRoute = typeof optimizeRoute;
