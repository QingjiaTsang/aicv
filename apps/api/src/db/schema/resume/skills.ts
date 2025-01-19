import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields } from "@/api/db/schema/utils/base-schema-fields";

export const skills = sqliteTable("skills", {
  ...baseFields,
  documentId: text()
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  name: text("name"),
  rating: integer("rating").notNull().default(0),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  document: one(documents, {
    fields: [skills.documentId],
    references: [documents.id],
  }),
}));
