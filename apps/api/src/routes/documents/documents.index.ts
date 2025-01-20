import createRouter from "@/api/lib/app-config/create-router";

import * as handlers from "./documents.handlers";
import * as routes from "./documents.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.publicPreview, handlers.publicPreview);

export default router;
