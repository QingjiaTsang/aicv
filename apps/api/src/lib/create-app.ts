import { authHandler, verifyAuth } from "@hono/auth-js";
import { notFound, onError } from "stoker/middlewares";

import type { AppOpenAPI } from "./types";

import { BASE_PATH } from "./constants";
import createAuthConfig from "./create-auth-config";
import createRouter from "./create-router";

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
    // .use("/auth/*", authHandler())
    .use("/*", async (c, next) => {
      if (c.req.path.startsWith("/api/auth/signup")
        || c.req.path.startsWith("/api/auth/verify")) {
        return next();
      }
      // 其他认证相关的路由交给 auth.js 处理
      if (c.req.path.startsWith("/api/auth")) {
        return authHandler()(c, next);
      }
      return verifyAuth()(c, next);
    })
    .use("/*", async (c, next) => {
      console.log("Current path:", c.req.path);
      if (c.req.path.startsWith("/api/auth")) {
        return next();
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
