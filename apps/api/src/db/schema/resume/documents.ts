import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/api/db/schema/auth/auth";
import { education } from "@/api/db/schema/resume/education";
import { experience } from "@/api/db/schema/resume/experience";
import { personalInfo } from "@/api/db/schema/resume/personal-info";
import { skills } from "@/api/db/schema/resume/skills";

export const DOCUMENT_STATUS = {
  PRIVATE: "private",
  PUBLIC: "public",
  ARCHIVED: "archived",
} as const;
export type DocumentStatus = typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS];

export const documents = sqliteTable("document", {
  // Note: can't use baseFields to replace id, createdAt and updatedAt because it's not good for type inference here
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title", { length: 255 }).notNull(),
  summary: text("summary", { length: 1000 }),
  themeColor: text("theme_color")
    .notNull()
    .default("#7c3aed"),
  thumbnail: text("thumbnail"),
  currentPosition: integer("current_position")
    .notNull()
    .default(1),
  status: text("status")
    .notNull()
    .$type<DocumentStatus>()
    .default(DOCUMENT_STATUS.PRIVATE),
  authorName: text("author_name", { length: 255 }).notNull(),
  authorEmail: text("author_email", { length: 255 }).notNull(),
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
}, table => ([
  index("user_status_idx").on(table.userId, table.status),
  index("title_idx").on(table.title),
  index("author_name_idx").on(table.authorName),
  index("author_email_idx").on(table.authorEmail),
  index("created_at_idx").on(table.createdAt),
  index("updated_at_idx").on(table.updatedAt),
]));

export const documentRelations = relations(documents, ({ one, many }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  personalInfo: one(personalInfo),
  experience: many(experience),
  education: many(education),
  skills: many(skills),
}));

export const insertDocumentSchema = createInsertSchema(documents, {
  userId: z.string().optional(),
  title: z.string().min(1, "Title cannot be empty").max(255, "Title cannot exceed 255 characters"),
  summary: z.string().max(1000, "Summary cannot exceed 1000 characters").optional(),
  themeColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hexadecimal color value")
    .default("#7c3aed")
    .optional(),
  thumbnail: z.string().url("Please enter a valid URL address").optional(),
  currentPosition: z.number().int().min(1).default(1).optional(),
  status: z.enum([DOCUMENT_STATUS.PRIVATE, DOCUMENT_STATUS.PUBLIC, DOCUMENT_STATUS.ARCHIVED]).default(DOCUMENT_STATUS.PRIVATE).optional(),
  authorName: z.string().min(1, "Author name cannot be empty").max(255, "Author name cannot exceed 255 characters").optional(),
  authorEmail: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email address cannot exceed 255 characters")
    .transform(value => value.toLowerCase())
    .optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDocumentSchema = z.infer<typeof insertDocumentSchema>;

export const updateDocumentSchema = insertDocumentSchema.partial();
export type UpdateDocumentSchema = z.infer<typeof updateDocumentSchema>;

export const selectDocumentSchema = createSelectSchema(documents).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum([
    DOCUMENT_STATUS.PRIVATE,
    DOCUMENT_STATUS.PUBLIC,
    DOCUMENT_STATUS.ARCHIVED,
  ]),
});
export type SelectDocumentSchema = z.infer<typeof selectDocumentSchema>;

// FIXME: why it's not working for type inference in frontend when written in this way?
// export const selectUserSchema = createSelectSchema(users).omit({
//   password: true,
//   emailVerified: true,
// });
// export const selectPersonalInfoSchema = createSelectSchema(personalInfo).nullable();
// export const selectExperienceSchema = createSelectSchema(experience);
// export const selectEducationSchema = createSelectSchema(education);
// export const selectSkillsSchema = createSelectSchema(skills);

// so I have to write this way which is not so clean:
export const selectPersonalInfoSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  jobTitle: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).nullable();
export const selectExperienceSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  title: z.string().nullable(),
  companyName: z.string().nullable(),
  state: z.string().nullable(),
  city: z.string().nullable(),
  isCurrentlyEmployed: z.boolean(),
  workSummary: z.string().nullable(),
  startDate: z.number().nullable(),
  endDate: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const selectEducationSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  universityName: z.string().nullable(),
  degree: z.string().nullable(),
  major: z.string().nullable(),
  description: z.string().nullable(),
  startDate: z.number().nullable(),
  endDate: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const selectSkillsSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  name: z.string().nullable(),
  rating: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const selectDocumentWithRelationsSchema = selectDocumentSchema.extend({
  personalInfo: selectPersonalInfoSchema,
  experience: selectExperienceSchema.array(),
  education: selectEducationSchema.array(),
  skills: selectSkillsSchema.array(),
});

export type SelectDocumentWithRelationsSchema = z.infer<typeof selectDocumentWithRelationsSchema>;
