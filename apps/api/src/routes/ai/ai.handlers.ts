import { createOptimizer } from "@aicv-app/ai-core";
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
    const suggestions = await optimizer.optimizeResume({
      jobDescription: body.jobDescription,
      currentContent: body.currentContent,
    });

    return c.json({
      suggestions,
    }, HttpStatusCodes.OK);
  }
  catch (error) {
    console.error("AI optimization failed:", error);
    return c.json({
      message: "AI optimization failed",
    }, HttpStatusCodes.BAD_REQUEST);
  }
}
