import createRouter from "@/api/lib/app-config/create-router";

import * as handlers from "./ai.handlers";
import * as routes from "./ai.routes";

const router = createRouter()
  .openapi(routes.optimizeStreamObjectRoute, handlers.handleOptimizeObject)
  .openapi(routes.optimizeStreamTextRoute, handlers.handleOptimizeText);

export default router;
