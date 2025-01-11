import { createId } from "@paralleldrive/cuid2";
import { addDays, addHours } from "date-fns";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/api/lib/types";

import { createDb } from "@/api/db";
import { sessions, users, verificationTokens } from "@/api/db/schema/auth/auth";
import { getUserFromDb, hashPassword } from "@/api/routes/auth/lib/auth-utils";
import { sendVerificationEmail } from "@/api/routes/auth/lib/email-utils";

import type { CredentialsSigninRoute, SignupRoute, VerifyEmailRoute } from "./auth.routes";

export const signup: AppRouteHandler<SignupRoute> = async (c) => {
  const body = c.req.valid("json");
  const db = createDb(c.env);

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email!));

  if (existingUser && existingUser.emailVerified) {
    return c.json(
      { message: HttpStatusPhrases.CONFLICT },
      HttpStatusCodes.CONFLICT,
    );
  }

  const [existingToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, body.email!));

  const now = new Date();

  if (existingToken && existingToken.expires > now) {
    return c.json({
      message: `Verification email has been sent, please check your email to complete verification. If not received, please wait ${Math.floor((existingToken.expires.getTime() - now.getTime()) / 60000)} minutes before retrying`,
    }, HttpStatusCodes.CONFLICT);
  }

  // Delete the existing token if it exists
  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, body.email!));
  }

  const hashedPassword = await hashPassword(body.password!);
  const verificationToken = createId();
  const expires = addHours(now, 1);

  if (existingUser) {
    await db.batch([
      db.update(users).set({
        password: hashedPassword,
      }).where(eq(users.id, existingUser.id)),
      db.insert(verificationTokens).values({
        identifier: body.email!,
        token: verificationToken,
        expires,
      }),
    ]);
  }
  else {
    await db.batch([
      db.insert(users).values({
        ...body,
        password: hashedPassword,
        emailVerified: null,
      }),
      db.insert(verificationTokens).values({
        identifier: body.email!,
        token: verificationToken,
        expires,
      }),
    ]);
  }

  await sendVerificationEmail(body.email!, verificationToken, c.env);

  return c.json({
    message: "Verification email has been sent, please check your email to complete verification",
  }, HttpStatusCodes.CREATED);
};

export const verifyEmail: AppRouteHandler<VerifyEmailRoute> = async (c) => {
  const { token } = c.req.valid("query");
  const db = createDb(c.env);

  const [verificationToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token));

  if (!verificationToken) {
    return c.json({
      message: "Invalid verification link",
    }, HttpStatusCodes.BAD_REQUEST);
  }

  if (verificationToken.expires < new Date()) {
    return c.json({
      message: "Verification link has expired",
    }, HttpStatusCodes.BAD_REQUEST);
  }

  await db.batch([
    db.update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, verificationToken.identifier)),
    db.delete(verificationTokens)
      .where(eq(verificationTokens.token, token)),
  ]);

  return c.redirect("/sign-in");
};

export const credentialsSignin: AppRouteHandler<CredentialsSigninRoute> = async (c) => {
  const db = createDb(c.env);
  const body = c.req.valid("json");

  const result = await getUserFromDb(db, body.email, body.password);

  if (!result.success) {
    return c.json({
      message: result.message!,
    }, HttpStatusCodes.UNAUTHORIZED);
  }

  const sessionToken = createId();
  const expires = addDays(new Date(), 30);

  await db.insert(sessions).values({
    sessionToken,
    userId: result.user!.id,
    expires,
  });

  setCookie(c, "authjs.session-token", sessionToken, {
    expires,
    httpOnly: true,
    secure: c.env.ENV === "production",
    path: "/",
  });

  return c.json(result.user, HttpStatusCodes.OK);
};
