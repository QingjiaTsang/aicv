import type { AuthConfig, AuthUser } from "@hono/auth-js";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

import type { BASE_PATH } from "./constants";

export type AppEnv = {
  Bindings: {
    ENV: string;
    AUTH_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    RESEND_API_KEY: string;
    APP_URL: string;
    DEEPSEEK_API_KEY: string;
    COOKIE_DOMAIN: string;

    ASSETS: Fetcher;
    DB: D1Database;
    RESUME_THUMBNAIL_BUCKET: R2Bucket;
  };
  Variables: {
    authUser: AuthUser;
    authConfig: AuthConfig;
  };
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI = OpenAPIHono<AppEnv, {}, typeof BASE_PATH>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;
