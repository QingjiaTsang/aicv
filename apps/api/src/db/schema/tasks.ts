import type { z } from "zod";

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text()
    .notNull(),
  done: integer({ mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer()
    .notNull()
    .$defaultFn(() => Date.now())
    .$onUpdate(() => Date.now()),
});

export const selectTasksSchema = createSelectSchema(tasks);
export type SelectTasksSchema = z.infer<typeof selectTasksSchema>;

export const insertTasksSchema = createInsertSchema(
  tasks,
  {
    name: schema => schema.min(1).max(500),
  },
).required({
  done: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTasksSchema = z.infer<typeof insertTasksSchema>;

export const patchTasksSchema = insertTasksSchema.partial();
export type PatchTasksSchema = z.infer<typeof patchTasksSchema>;
