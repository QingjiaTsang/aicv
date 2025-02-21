import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "../utils/base-schema-fields";
import { documents } from "./documents";

export const skills = sqliteTable("skills", {
  ...baseFields,
  documentId: text()
    .notNull(),
  name: text("name"),
  rating: integer("rating").notNull().default(0),
  displayOrder: integer("display_order").notNull().default(0),
});

export const skillsRelations = relations(skills, ({ one }) => ({
  document: one(documents, {
    fields: [skills.documentId],
    references: [documents.id],
  }),
}));
