import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { createUserSchema } from "@/api/db/schema/auth";
import { conflictSchema } from "@/api/lib/constants";

const tags = ["Auth"];

export const signup = createRoute({
  tags,
  method: "post",
  path: "/signup",
  request: {
    body: jsonContent(
      createUserSchema,
      "注册信息",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      description: "Signup succeeded",
    },
    [HttpStatusCodes.CONFLICT]: jsonContent(
      conflictSchema,
      "Email already exists",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createUserSchema),
      "Signup failed",
    ),
  },
});

export type SignupRoute = typeof signup;
