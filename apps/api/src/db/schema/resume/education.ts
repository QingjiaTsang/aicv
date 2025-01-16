import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields, baseFieldsOmitConfig } from "@/api/db/schema/utils/base-schema-fields";

export const education = sqliteTable("education", {
  ...baseFields,
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  universityName: text("university_name", { length: 255 }),
  degree: text("degree", { length: 255 }),
  major: text("major", { length: 255 }),
  description: text("description", { length: 1000 }),
  startDate: integer("start_date", { mode: "timestamp_ms" }),
  endDate: integer("end_date", { mode: "timestamp_ms" }),
});

export const educationRelations = relations(education, ({ one }) => ({
  document: one(documents, {
    fields: [education.documentId],
    references: [documents.id],
  }),
}));

const insertEducationWithoutDateValidationSchema = createInsertSchema(education, {
  universityName: z.string().max(255, "University name cannot exceed 255 characters"),
  degree: z.string().max(255, "Degree cannot exceed 255 characters"),
  major: z.string().max(255, "Major cannot exceed 255 characters"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional(),
  startDate: z.coerce.date({
    required_error: "Please select the start date",
    invalid_type_error: "Please enter a valid date",
  }),
  endDate: z.coerce.date({
    invalid_type_error: "Please enter a valid date",
  }),
}).omit(baseFieldsOmitConfig);

export const insertEducationSchema = insertEducationWithoutDateValidationSchema.superRefine((data, ctx) => {
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date cannot be earlier than the start date",
      path: ["endDate"],
    });
  }
});
export type InsertEducationSchema = z.infer<typeof insertEducationSchema>;
