import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields } from "@/api/db/schema/utils/base-schema-fields";

export const education = sqliteTable("education", {
  ...baseFields,
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  universityName: text("university_name", { length: 255 }),
  degree: text("degree", { length: 255 }),
  major: text("major", { length: 255 }),
  // Note: since the editor is using Quill, the content would be much longer with html tags, so it has to be set to a large value
  description: text("description", { length: 10000 }),
  displayOrder: integer("display_order").notNull().default(0),
  startDate: integer("start_date", { mode: "timestamp_ms" }),
  endDate: integer("end_date", { mode: "timestamp_ms" }),
});

export const educationRelations = relations(education, ({ one }) => ({
  document: one(documents, {
    fields: [education.documentId],
    references: [documents.id],
  }),
}));
