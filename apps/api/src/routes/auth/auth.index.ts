import createRouter from "@/api/lib/create-router";

import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

const router = createRouter()
  .openapi(routes.signup, handlers.signup)
  .openapi(routes.verifyEmail, handlers.verifyEmail);

export default router;
