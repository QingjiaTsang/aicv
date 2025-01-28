import { createOptimizer } from "@aicv-app/ai-core";
import { stream } from "hono/streaming";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { OptimizeContext } from "./ai.routes";

export async function handleOptimize(c: OptimizeContext) {
  try {
    const optimizer = createOptimizer({
      env: {
        DEEPSEEK_API_KEY: c.env.DEEPSEEK_API_KEY,
      },
    });

    const body = await c.req.json();
    const { partialObjectStream } = await optimizer.createOptimizeStream({
      jobDescription: body.jobDescription,
      currentContent: body.currentContent,
    });

    return stream(c, async (stream) => {
      try {
        for await (const chunk of partialObjectStream) {
          if (chunk.length) {
            const lastSuggestion = chunk[chunk.length - 1];
            await stream.write(JSON.stringify(lastSuggestion));
          }
        }
      }
      catch (error) {
        console.error("AI response stream processing failed:", error);
        await stream.write(JSON.stringify({
          type: "summary",
          content: "Sorry, an error occurred during AI analysis. Please try again later.",
          reason: "Response stream processing failed",
          confidence: 0.1,
        }));
      }
    });
  }
  catch (error) {
    console.error("AI optimization failed:", error);
    return c.json({
      message: "AI optimization failed",
    }, HttpStatusCodes.BAD_REQUEST);
  }
}
