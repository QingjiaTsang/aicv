import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import createRouter from "@/api/lib/app-config/create-router";

const authUserInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.string().nullable(),
  image: z.string(),
});

const router = createRouter()
  .openapi(
    createRoute({
      tags: ["UserSession"],
      method: "get",
      path: "/me",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          authUserInfoSchema,
          "Auth User Session",
        ),
      },
    }),
    async (c) => {
      const authUser = c.get("authUser");
      const userInfo = authUser.session.user;
      return c.json(userInfo, HttpStatusCodes.OK);
    },
  );

export default router;
