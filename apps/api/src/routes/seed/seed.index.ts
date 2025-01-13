import createRouter from "@/api/lib/app-config/create-router";

import { seedHandler } from "./seed.handlers";
import { seedRoute } from "./seed.routes";

const router = createRouter()
  .openapi(seedRoute, seedHandler);

export default router;
