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
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
}, table => ([
  index("user_id_idx").on(table.userId),
  index("user_created_at_idx").on(table.userId, table.createdAt),
  index("user_updated_at_idx").on(table.userId, table.updatedAt),
  // TODO: for filtering
  index("user_status_idx").on(table.userId, table.status),
  // TODO: for searching
  index("user_title_idx").on(table.userId, table.title),
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
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDocumentSchema = z.infer<typeof insertDocumentSchema>;

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
// export const selectExperienceSchema = createSelectSchema(experience).nullable();
// export const selectEducationSchema = createSelectSchema(education).nullable();
// export const selectSkillsSchema = createSelectSchema(skills).nullable();

// so I have to write this way which is not so clean:
export const selectPersonalInfoSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  firstName: z.string().max(50, "First name cannot exceed 50 characters").nullable(),
  lastName: z.string().max(50, "Last name cannot exceed 50 characters").nullable(),
  jobTitle: z.string().max(255, "Job title cannot exceed 255 characters").nullable(),
  state: z.string().max(255, "State name cannot exceed 255 characters").nullable(),
  city: z.string().max(255, "City name cannot exceed 255 characters").nullable(),
  phone: z.string().min(11, "Phone number cannot exceed 11 digits").nullable(),
  email: z.string().email("Please enter a valid email address").max(255, "Email address cannot exceed 255 characters").nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const selectExperienceSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  title: z.string().max(255, "Job title cannot exceed 255 characters").nullable(),
  companyName: z.string().max(255, "Company name cannot exceed 255 characters").nullable(),
  state: z.string().max(255, "State name cannot exceed 255 characters").nullable(),
  city: z.string().max(255, "City name cannot exceed 255 characters").nullable(),
  isCurrentlyEmployed: z.boolean().default(false),
  workSummary: z.string().max(2000, "Work summary cannot exceed 2000 characters").nullable(),
  startDate: z.number().nullable(),
  endDate: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SelectExperienceSchema = z.infer<typeof selectExperienceSchema>;
export const selectEducationSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  universityName: z.string()
    .max(255, "University name cannot exceed 255 characters")
    .nullable(),
  degree: z.string()
    .max(255, "Degree name cannot exceed 255 characters")
    .nullable(),
  major: z.string()
    .max(255, "Major name cannot exceed 255 characters")
    .nullable(),
  description: z.string()
    .max(1000, "Description cannot exceed 1000 characters")
    .nullable(),
  startDate: z.number().nullable(),
  endDate: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const selectSkillsSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  name: z.string()
    .max(255, "Skill name cannot exceed 255 characters")
    .nullable(),
  rating: z.number()
    .int("Rating must be an integer")
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const selectDocumentWithRelationsSchema = selectDocumentSchema.extend({
  personalInfo: selectPersonalInfoSchema.nullable(),
  experience: selectExperienceSchema.nullable().array(),
  education: selectEducationSchema.nullable().array(),
  skills: selectSkillsSchema.nullable().array(),
});
export type SelectDocumentWithRelationsSchema = z.infer<typeof selectDocumentWithRelationsSchema>;

const omitConfig = {
  id: true,
  documentId: true,
  createdAt: true,
  updatedAt: true,
} as const;
export const updatePersonalInfoSchema = selectPersonalInfoSchema.omit(omitConfig).required();
export type UpdatePersonalInfoSchema = z.infer<typeof updatePersonalInfoSchema>;

export const updateExperienceSchema = selectExperienceSchema
  .omit(omitConfig)
  .required()
  .extend({ id: z.string().optional() })
  .superRefine((data, ctx) => {
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than the start date",
        path: ["endDate"],
      });
    }
  })
  .array();
export type UpdateExperienceSchema = z.infer<typeof updateExperienceSchema>;

export const updateEducationSchema = selectEducationSchema
  .omit(omitConfig)
  .required()
  .extend({ id: z.string().optional() })
  .superRefine((data, ctx) => {
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than the start date",
        path: ["endDate"],
      });
    }
  })
  .array();
export type UpdateEducationSchema = z.infer<typeof updateEducationSchema>;

export const updateSkillsSchema = selectSkillsSchema
  .omit(omitConfig)
  .required()
  .extend({ id: z.string().optional() })
  .array();
export type UpdateSkillsSchema = z.infer<typeof updateSkillsSchema>;

export const updateBasicDocumentSchema = insertDocumentSchema.partial();
export type UpdateBasicDocumentSchema = z.infer<typeof updateBasicDocumentSchema>;

export const updateDocumentDataSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("document"),
    data: updateBasicDocumentSchema,
  }),
  z.object({
    type: z.literal("personalInfo"),
    data: updatePersonalInfoSchema,
  }),
  z.object({
    type: z.literal("experience"),
    data: updateExperienceSchema,
  }),
  z.object({
    type: z.literal("education"),
    data: updateEducationSchema,
  }),
  z.object({
    type: z.literal("skills"),
    data: updateSkillsSchema,
  }),
]);

export type UpdateDocumentDataSchema = z.infer<typeof updateDocumentDataSchema>;
