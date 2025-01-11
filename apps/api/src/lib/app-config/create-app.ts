import { authHandler, verifyAuth } from "@hono/auth-js";
import { notFound, onError } from "stoker/middlewares";

import type { AppOpenAPI } from "@/api/lib/types";

import createAuthConfig from "@/api/lib/app-config/create-auth-config";
import createRouter from "@/api/lib/app-config/create-router";
import { BASE_PATH } from "@/api/lib/constants";

export default function createApp() {
  const app = createRouter()
    .use("*", (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }
      // SPA redirect to /index.html
      const requestUrl = new URL(c.req.raw.url);
      return c.env.ASSETS.fetch(new URL("/index.html", requestUrl.origin));
    })
    .basePath(BASE_PATH) as AppOpenAPI;

  app
    .use(
      "*",
      async (c, next) => {
        c.set("authConfig", createAuthConfig(c.env));
        return next();
      },
    )
    .use("/*", async (c, next) => {
      // Handle credential signup and verify
      if (c.req.path.startsWith("/api/auth/signup")
        || c.req.path.startsWith("/api/auth/verify")
        || c.req.path.startsWith("/api/auth/credentials/signin")) {
        return next();
      }

      // Other authentication-related routes are handled by auth.js
      if (c.req.path.startsWith("/api/auth")) {
        return authHandler()(c, next);
      }
      return verifyAuth()(c, next);
    })
    .notFound(notFound)
    .onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
