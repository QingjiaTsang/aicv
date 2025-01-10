import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields, baseFieldsOmitConfig } from "@/api/db/schema/utils/base-schema-fields";

export const personalInfo = sqliteTable("personal_info", {
  ...baseFields,
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  jobTitle: text("job_title"),
  city: text("city"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
});

export const personalInfoRelations = relations(personalInfo, ({ one }) => ({
  document: one(documents, {
    fields: [personalInfo.documentId],
    references: [documents.id],
  }),
}));

export const insertPersonalInfoSchema = createInsertSchema(personalInfo, {
  firstName: z.string().max(255, "First name cannot exceed 255 characters").optional(),
  lastName: z.string().max(255, "Last name cannot exceed 255 characters").optional(),
  jobTitle: z.string().max(255, "Job title cannot exceed 255 characters").optional(),
  city: z.string().max(255, "City cannot exceed 255 characters").optional(),
  address: z.string().max(500, "Address cannot exceed 500 characters").optional(),
  phone: z.string()
    .max(50, "Phone number cannot exceed 50 characters")
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number format")
    .optional(),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email address cannot exceed 255 characters")
    .optional(),
}).omit(baseFieldsOmitConfig);

export type InsertPersonalInfoSchema = z.infer<typeof insertPersonalInfoSchema>;
