import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields, baseFieldsOmitConfig } from "@/api/db/schema/utils/base-schema-fields";

export const experience = sqliteTable("experience", {
  ...baseFields,
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  title: text("title"),
  companyName: text("company_name"),
  state: text("state"),
  city: text("city"),
  isCurrentlyEmployed: integer("is_currently_employed").$defaultFn(() => 0),
  workSummary: text("work_summary"),
  startDate: integer("start_date", { mode: "timestamp_ms" }),
  endDate: integer("end_date", { mode: "timestamp_ms" }),
});

export const experienceRelations = relations(experience, ({ one }) => ({
  document: one(documents, {
    fields: [experience.documentId],
    references: [documents.id],
  }),
}));

export const insertExperienceWithoutDateValidationSchema = createInsertSchema(experience, {
  title: z.string().max(255, "Job title cannot exceed 255 characters"),
  companyName: z.string().max(255, "Company name cannot exceed 255 characters"),
  city: z.string().max(255, "City name cannot exceed 255 characters"),
  state: z.string().max(255, "State/province name cannot exceed 255 characters"),
  isCurrentlyEmployed: z.boolean().default(false),
  workSummary: z.string().max(2000, "Work description cannot exceed 2000 characters").optional(),
  startDate: z.coerce.date({
    required_error: "Please select the start date",
    invalid_type_error: "Please enter a valid date",
  }),
  endDate: z.coerce.date({
    invalid_type_error: "Please enter a valid date",
  }),
}).omit(baseFieldsOmitConfig);

export const insertExperienceSchema = insertExperienceWithoutDateValidationSchema.superRefine((data, ctx) => {
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date cannot be earlier than the start date",
      path: ["endDate"],
    });
  }
});
export type InsertExperienceSchema = z.infer<typeof insertExperienceSchema>;
