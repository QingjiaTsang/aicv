import { aiSuggestionSchema, optimizeContextSchema } from "@aicv-app/ai-core";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

export const optimizeStreamObjectRoute = createRoute({
  method: "post",
  path: "/ai/optimize/streamObject",
  tags: ["AI"],
  description: "Use AI to optimize resume content",
  request: {
    body: jsonContent(optimizeContextSchema, "Resume optimization request"),
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

export const optimizeStreamTextRoute = createRoute({
  method: "post",
  path: "/ai/optimize/streamText",
  tags: ["AI"],
  description: "Use AI to optimize resume content",
  request: {
    body: jsonContent(optimizeContextSchema, "Resume optimization request"),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "text/event-stream": {
          schema: z.string(),
        },
      },
      description: "Resume optimization suggestions (streaming)",
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(z.object({
      message: z.string(),
    }), "Request error"),
  },
});

export type OptimizeStreamObjectRoute = typeof optimizeStreamObjectRoute;
export type OptimizeStreamTextRoute = typeof optimizeStreamTextRoute;
