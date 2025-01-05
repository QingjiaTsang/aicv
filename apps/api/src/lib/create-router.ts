import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";

import type { AppEnv } from "./types";

export default function createRouter() {
  return new OpenAPIHono<AppEnv>({
    strict: false,
    defaultHook,
  });
}
