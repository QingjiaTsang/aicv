import type { AppRouteHandler } from "@/api/lib/types";

import { createDb } from "@/api/db";
import { seed } from "@/api/db/seeds";

import type { SeedRoute } from "./seed.routes";

export const seedHandler: AppRouteHandler<SeedRoute> = async (c) => {
  try {
    const db = createDb(c.env);
    await seed(db);

    return c.json({
      success: true,
      message: "数据填充成功",
    });
  }
  catch (error) {
    return c.json({
      success: false,
      message: `数据填充失败: ${error}`,
    }, 500);
  }
};
