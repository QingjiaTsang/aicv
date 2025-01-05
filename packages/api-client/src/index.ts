import type { router } from "@aicv-app/api/routes";

import { hc } from "hono/client";

const _client = hc<router>("");
// create instance to inline type in build
// https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended

export type Client = typeof _client;

export default (...args: Parameters<typeof hc>): Client =>
  hc<router>(...args);
export type ErrorSchema = {
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message?: string | undefined;
    }[];
    name: string;
  };
  success: boolean;
};
