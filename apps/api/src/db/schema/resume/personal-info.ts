import { relations } from "drizzle-orm";
import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { baseFields } from "../utils/base-schema-fields";
import { documents } from "./documents";

export const personalInfo = sqliteTable("personal_info", {
  ...baseFields,
  documentId: text("document_id")
    .notNull()
    .unique(),
  firstName: text("first_name", { length: 50 }),
  lastName: text("last_name", { length: 50 }),
  jobTitle: text("job_title", { length: 255 }),
  state: text("state", { length: 255 }),
  city: text("city", { length: 255 }),
  phone: text("phone", { length: 11 }),
  email: text("email", { length: 255 }),
}, table => ([
  uniqueIndex("document_id_unique_idx").on(table.documentId),
  index("phone_idx").on(table.phone),
  index("email_idx").on(table.email),
]));

export const personalInfoRelations = relations(personalInfo, ({ one }) => ({
  document: one(documents, {
    fields: [personalInfo.documentId],
    references: [documents.id],
  }),
}));
