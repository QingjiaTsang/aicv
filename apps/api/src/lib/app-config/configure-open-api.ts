import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "@/api/lib/types";

import { BASE_PATH } from "@/api/lib/constants";

import packageJSON from "../../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "AICV API",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: `${BASE_PATH}/doc`,
      },
    }),
  );
}
