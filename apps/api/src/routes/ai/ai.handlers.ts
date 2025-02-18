import { createOptimizer, createOptimizeText } from "@aicv-app/ai-core";
import { stream as honoStream } from "hono/streaming";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/api/lib/types";
import type { OptimizeStreamObjectRoute, OptimizeStreamTextRoute } from "@/api/routes/ai/ai.routes";

export const handleOptimize: AppRouteHandler<OptimizeStreamObjectRoute> = async (c) => {
  try {
    const optimizer = createOptimizer({
      env: {
        DEEPSEEK_API_KEY: c.env.DEEPSEEK_API_KEY,
      },
    });

    const body = c.req.valid("json");
    const result = await optimizer.createOptimizeStream({
      id: body.id,
      messages: body.messages,
      jobDescription: body.jobDescription,
      currentContent: body.currentContent,
    });

    return honoStream(c, async (stream) => {
      try {
        for await (const chunk of result.partialObjectStream) {
          if (chunk.length) {
            // 返回数组，但是数组里会重复前面出现过的元素，需要取最后一个
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
};

export const handleOptimizeText: AppRouteHandler<OptimizeStreamTextRoute> = async (c) => {
  try {
    const body = c.req.valid("json");
    
    const optimizer = createOptimizeText({
      env: {
        DEEPSEEK_API_KEY: c.env.DEEPSEEK_API_KEY,
      },
    });

    const result = await optimizer.createOptimizeTextStream({
      id: body.id,
      messages: body.messages,
      jobDescription: body.jobDescription,
      currentContent: body.currentContent,
      sections: body.sections,
    });

    c.header("Content-Type", "text/event-stream");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");

    return honoStream(c, async (stream) => {
      try {
        for await (const textPart of result.textStream) {
          await stream.write(textPart);
        }
      }
      catch (error) {
        console.error("Stream processing failed:", error);
        await stream.write("An error occurred during analysis. Please try again.");
      }
    });
  }
  catch (error) {
    console.error("Optimization failed:", error);
    return c.json({
      message: "Optimization failed. Please try again.",
    }, HttpStatusCodes.BAD_REQUEST);
  }
};
