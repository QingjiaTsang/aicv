import createRouter from "@/api/lib/app-config/create-router";

import * as handlers from "./auth.handlers";
import * as routes from "./auth.routes";

const router = createRouter()
  .openapi(routes.signup, handlers.signup)
  .openapi(routes.verifyEmail, handlers.verifyEmail)
  .openapi(routes.credentialsSignin, handlers.credentialsSignin);

export default router;
