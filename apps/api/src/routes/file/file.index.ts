import createRouter from "@/api/lib/app-config/create-router";

import * as handlers from "./file.handlers";
import * as routes from "./file.routes";

const router = createRouter()
  .openapi(routes.upload, handlers.upload)
  .openapi(routes.getFile, handlers.getFile);

export default router;
