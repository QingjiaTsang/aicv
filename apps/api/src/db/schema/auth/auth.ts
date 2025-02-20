import type { AdapterAccountType } from "@auth/core/adapters";

import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { ulid } from "ulid";
import { z } from "zod";

export const users = sqliteTable("user", {
  id: text()
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text(),
  email: text().unique(),
  password: text(),
  emailVerified: integer({ mode: "timestamp_ms" }),
  image: text(),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  verificationToken => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  authenticator => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ],
);

export const createUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    emailVerified: true,
    image: true,
  })
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").optional(),
    email: z.string()
      .min(1, "Email cannot be empty")
      .email("Please enter a valid email address"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(18, "Password cannot exceed 18 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,18}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      )
      .refine(
        password => !/\s/.test(password),
        "Password cannot contain spaces",
      ),
  });
export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
  emailVerified: true,
});
export type SelectUsersSchema = z.infer<typeof selectUsersSchema>;

export const credentialsSigninSchema = createUserSchema.omit({
  name: true,
}).extend({
  email: z.string()
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email address")
    .transform(value => value.toLowerCase()),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});
export type CredentialsSigninSchema = z.infer<typeof credentialsSigninSchema>;

export const verificationTokenSchema = createSelectSchema(verificationTokens);
export type VerificationToken = z.infer<typeof verificationTokenSchema>;

export const verifyEmailSchema = verificationTokenSchema.pick({
  token: true,
});
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
