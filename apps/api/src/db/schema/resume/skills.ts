import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { documents } from "@/api/db/schema/resume/documents";
import { baseFields, baseFieldsOmitConfig } from "@/api/db/schema/utils/base-schema-fields";

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

export const insertSkillsSchema = createInsertSchema(skills, {
  name: z.string()
    .min(1, "Skill name is required")
    .max(255, "Skill name cannot exceed 255 characters"),
  rating: z.number()
    .int("Rating must be an integer")
    // .min(0, "Rating cannot be negative")
    // .max(5, "Rating cannot exceed 5") // Assuming the rating range is 0-5
    .default(0),
}).omit(baseFieldsOmitConfig);

export type InsertSkillsSchema = z.infer<typeof insertSkillsSchema>;
