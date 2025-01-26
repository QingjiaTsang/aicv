import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields } from "@/api/db/schema/utils/base-schema-fields";

export const experience = sqliteTable("experience", {
  ...baseFields,
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  title: text("title", { length: 255 }),
  companyName: text("company_name", { length: 255 }),
  state: text("state", { length: 255 }),
  city: text("city", { length: 255 }),
  isCurrentlyEmployed: integer("is_currently_employed", { mode: "boolean" }).notNull().default(false),
  // Note: since the editor is using Quill, the content would be much longer with html tags, so it has to be set to a large value
  workSummary: text("work_summary", { length: 10000 }),
  displayOrder: integer("display_order").notNull().default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
});

export const experienceRelations = relations(experience, ({ one }) => ({
  document: one(documents, {
    fields: [experience.documentId],
    references: [documents.id],
  }),
}));
