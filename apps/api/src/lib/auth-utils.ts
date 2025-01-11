import type { DrizzleD1Database } from "drizzle-orm/d1";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { users } from "@/api/db/schema/auth/auth";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUserFromDb(db: DrizzleD1Database, email: string, password: string) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email as string));

  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
    };
  }

  if (!existingUser.password) {
    return {
      success: false,
      message: "Password is required",
    };
  }

  if (!existingUser.emailVerified) {
    return {
      success: false,
      message: "Email not verified",
    };
  }

  const isValid = await verifyPassword(password, existingUser.password);

  if (!isValid) {
    return {
      success: false,
      message: "Invalid password",
    };
  }

  const { password: _, ...user } = existingUser;

  return {
    success: true,
    user,
  };
}
