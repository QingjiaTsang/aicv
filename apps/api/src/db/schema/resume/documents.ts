import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/api/db/schema/auth/auth";
import { education, insertEducationSchema } from "@/api/db/schema/resume/education";
import { experience, insertExperienceSchema } from "@/api/db/schema/resume/experience";
import { insertPersonalInfoSchema, personalInfo } from "@/api/db/schema/resume/personal-info";
import { insertSkillsSchema, skills } from "@/api/db/schema/resume/skills";
import { baseFields, baseFieldsOmitConfig } from "@/api/db/schema/utils/base-schema-fields";

export const statusEnum = z.enum(["private", "public", "archived"]);
type Status = z.infer<typeof statusEnum>;

export const documents = sqliteTable("document", {
  ...baseFields,
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary"),
  themeColor: text("theme_color")
    .notNull()
    .default("#7c3aed"),
  thumbnail: text("thumbnail"),
  currentPosition: integer("current_position")
    .notNull()
    .default(1),
  status: text("status").$type<Status>().notNull().default("private"),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
});

export const documentRelations = relations(documents, ({ one, many }) => ({
  personalInfo: one(personalInfo),
  experience: many(experience),
  education: many(education),
  skills: many(skills),
}));

export const insertDocumentSchema = createInsertSchema(documents, {
  title: z.string().min(1, "Title cannot be empty").max(255, "Title cannot exceed 255 characters"),
  summary: z.string().max(1000, "Summary cannot exceed 1000 characters").optional(),
  themeColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hexadecimal color value")
    .default("#7c3aed")
    .optional(),
  thumbnail: z.string().url("Please enter a valid URL address").optional(),
  currentPosition: z.number().int().min(1).default(1).optional(),
  status: statusEnum,
  authorName: z.string().min(1, "Author name cannot be empty").max(255, "Author name cannot exceed 255 characters"),
  authorEmail: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email address cannot exceed 255 characters"),
}).omit(baseFieldsOmitConfig);
export type InsertDocumentSchema = z.infer<typeof insertDocumentSchema>;

export const updateDocumentSchema = z.object({
  title: insertDocumentSchema.shape.title.optional(),
  summary: insertDocumentSchema.shape.summary.optional(),
  themeColor: insertDocumentSchema.shape.themeColor.optional(),
  thumbnail: insertDocumentSchema.shape.thumbnail.optional(),
  currentPosition: insertDocumentSchema.shape.currentPosition.optional(),
  status: insertDocumentSchema.shape.status.optional(),
  authorName: insertDocumentSchema.shape.authorName.optional(),
  authorEmail: insertDocumentSchema.shape.authorEmail.optional(),

  personalInfo: insertPersonalInfoSchema.optional(),
  education: z.array(insertEducationSchema).optional(),
  experience: z.array(insertExperienceSchema).optional(),
  skills: z.array(insertSkillsSchema).optional(),
});
export type UpdateDocumentSchema = z.infer<typeof updateDocumentSchema>;

export const selectDocumentSchema = createSelectSchema(documents);
export type SelectDocumentSchema = z.infer<typeof selectDocumentSchema>;
