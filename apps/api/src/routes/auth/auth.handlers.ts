import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/api/lib/types";

import { users } from "@/api/db/schema/auth";
import { hashPassword } from "@/api/lib/auth-utils";

import type { SignupRoute } from "./auth.routes";

export const signup: AppRouteHandler<SignupRoute> = async (c) => {
  const body = c.req.valid("json");
  const db = drizzle(c.env.DB);

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email!));

  if (existingUser) {
    return c.json(
      { message: HttpStatusPhrases.CONFLICT },
      HttpStatusCodes.CONFLICT,
    );
  }

  const hashedPassword = await hashPassword(body.password!);

  await db.insert(users).values({
    ...body,
    password: hashedPassword,
  });

  return c.body(null, HttpStatusCodes.CREATED);
};
