import { text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const baseFields = {
  id: text()
    .primaryKey()
    .$defaultFn(() => ulid()),
  createdAt: text("created_at")
    .notNull()
    .$default(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$default(() => new Date().toISOString())
    .$onUpdate(() => new Date().toISOString()),
};

export const baseFieldsOmitConfig = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const;
