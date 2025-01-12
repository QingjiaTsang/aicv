/* eslint-disable ts/no-redeclare */
import type { AppOpenAPI } from "@/api/lib/types";

import createRouter from "@/api/lib/app-config/create-router";
import { BASE_PATH } from "@/api/lib/constants";
import auth from "@/api/routes/auth/auth.index";
import index from "@/api/routes/index.route";
import me from "@/api/routes/me/me.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/auth", auth)
    .route("/", me);
}

// stand alone router type used for api client
export const router = registerRoutes(
  createRouter().basePath(BASE_PATH),
);
export type router = typeof router;
