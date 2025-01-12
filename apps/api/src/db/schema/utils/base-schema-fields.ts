import { integer, text } from "drizzle-orm/sqlite-core";

export const baseFields = {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
};

export const baseFieldsOmitConfig = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const;
