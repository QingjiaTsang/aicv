import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { createUserSchema, credentialsSigninSchema, selectUsersSchema, verifyEmailSchema } from "@/api/db/schema/auth/auth";
import { conflictSchema } from "@/api/lib/constants";

const tags = ["Auth"];

export const signup = createRoute({
  tags,
  method: "post",
  path: "/signup",
  request: {
    body: jsonContentRequired(
      createUserSchema,
      "Sign-up info",
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

export const verifyEmail = createRoute({
  tags: ["Auth"],
  method: "get",
  path: "/verify",
  request: {
    query: verifyEmailSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Email verified successfully",
    },
    [HttpStatusCodes.BAD_REQUEST]: {
      description: "Invalid or expired token",
    },
  },
});

export const credentialsSignin = createRoute({
  tags: ["Auth"],
  method: "post",
  path: "/credentials/signin",
  request: {
    body: jsonContentRequired(credentialsSigninSchema, "Sign-in info"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "Signin success",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Signin failed"),
      "Signin failed",
    ),
  },
});

export type SignupRoute = typeof signup;
export type VerifyEmailRoute = typeof verifyEmail;
export type CredentialsSigninRoute = typeof credentialsSignin;
