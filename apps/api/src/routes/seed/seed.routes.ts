import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const seedRoute = createRoute({
  method: "get",
  path: "/seed",
  tags: ["Admin"],
  description: "填充测试数据到数据库",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(responseSchema, "数据填充成功"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(responseSchema, "服务器错误"),
  },
});

export type SeedRoute = typeof seedRoute;
