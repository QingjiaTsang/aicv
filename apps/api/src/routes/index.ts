/* eslint-disable ts/no-redeclare */
import type { AppOpenAPI } from "@/api/lib/types";

import createRouter from "@/api/lib/app-config/create-router";
import { BASE_PATH } from "@/api/lib/constants";
import auth from "@/api/routes/auth/auth.index";
import documents from "@/api/routes/documents/documents.index";
import index from "@/api/routes/index.route";
import seed from "@/api/routes/seed/seed.index";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/", index)
    .route("/auth", auth)
    .route("/", seed)
    .route("/", documents);
}

// stand alone router type used for api client
export const router = registerRoutes(
  createRouter().basePath(BASE_PATH),
);
export type router = typeof router;
