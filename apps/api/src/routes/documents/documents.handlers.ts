import type { DrizzleD1Database } from "drizzle-orm/d1";

import { and, eq, or } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type * as schema from "@/api/db/schema";
import type { UpdateBasicDocumentSchema, UpdateEducationSchema, UpdateExperienceSchema, UpdatePersonalInfoSchema, UpdateSkillsSchema } from "@/api/db/schema/resume/documents";
import type { AppRouteHandler } from "@/api/lib/types";

import { createDb } from "@/api/db";
import { DOCUMENT_STATUS, documents } from "@/api/db/schema/resume/documents";
import { education } from "@/api/db/schema/resume/education";
import { experience } from "@/api/db/schema/resume/experience";
import { personalInfo } from "@/api/db/schema/resume/personal-info";
import { skills } from "@/api/db/schema/resume/skills";

import type { CreateRoute, GetOneRoute, ListRoute, PublicPreviewRoute, RemoveAllRoute, RemoveRoute, UpdateRoute } from "./documents.routes";

type HandleDocumentUpdateParams = {
  db: DrizzleD1Database<typeof schema>;
  id: string;
  data: UpdateBasicDocumentSchema;
};
async function handleBasicDocumentUpdate({ db, id, data }: HandleDocumentUpdateParams) {
  const [updated] = await db
    .update(documents)
    .set(data)
    .where(eq(documents.id, id))
    .returning();
  return updated;
}

type HandlePersonalInfoUpdateParams = {
  db: DrizzleD1Database<typeof schema>;
  id: string;
  data: UpdatePersonalInfoSchema;
};
async function handlePersonalInfoUpdate({ db, id, data }: HandlePersonalInfoUpdateParams) {
  const [updated] = await db
    .update(personalInfo)
    .set(data)
    .where(eq(personalInfo.documentId, id))
    .returning();

  return updated;
}

type HandleOneToManyUpdateParams<T extends { id?: string }> = {
  db: DrizzleD1Database<typeof schema>;
  table: typeof experience | typeof education | typeof skills;
  documentId: string;
  items: T[];
  getLatestDisplayOrder: () => Promise<number>;
};
async function handleOneToManyUpdate<T extends { id?: string }>({
  db,
  table,
  documentId,
  items,
  getLatestDisplayOrder,
}: HandleOneToManyUpdateParams<T>) {
  if (items.length === 0) {
    const deleted = await db.delete(table).where(eq(table.documentId, documentId));
    return deleted;
  }

  const results = await Promise.all(
    items.map(async (item, index) => {
      // one-to-many relationship(experience/education/skills) upsert has to depend on the id field
      if (item.id) {
        const [updated] = await db
          .update(table)
          .set({ ...item, documentId })
          .where(eq(table.id, item.id))
          .returning();
        return updated;
      }
      const [inserted] = await db
        .insert(table)
        .values({
          ...item,
          documentId,
          // Placed at the end of the list by default
          displayOrder: await getLatestDisplayOrder() + index + 1,
        })
        .returning();
      return inserted;
    }),
  );
  return results[results.length - 1];
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDb(c.env);

  const page = Number(c.req.query("page") ?? 1);
  const pageSize = Number(c.req.query("pageSize") ?? 10);

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const authUser = c.get("authUser");

  const [documentsList, total] = await Promise.all([
    db.query.documents.findMany({
      limit,
      offset,
      where: (documents, { eq }) => eq(documents.userId, authUser.user!.id),
      orderBy: (documents, { desc }) => [desc(documents.updatedAt)],
    }),
    db.select({ count: documents.id }).from(documents).then(result => result.length),
  ]);

  return c.json({
    data: documentsList,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
};

type GetDocumentOptions = {
  isPublicPreview?: boolean;
  userId?: string;
};

async function getDocumentWithRelations(
  db: DrizzleD1Database<typeof schema>,
  id: string,
  options: GetDocumentOptions = {},
) {
  const { isPublicPreview = false, userId } = options;

  const whereCondition = isPublicPreview
    ? and(
        eq(documents.id, id),
        or(
          eq(documents.status, DOCUMENT_STATUS.PUBLIC),
          eq(documents.userId, userId ?? ""),
        ),
      )
    : and(
        eq(documents.id, id),
        eq(documents.userId, userId ?? ""),
      );

  const document = await db.query.documents.findFirst({
    where: () => whereCondition,
    with: {
      experience: {
        orderBy: (experience, { asc }) => [asc(experience.displayOrder)],
      },
      education: {
        orderBy: (education, { asc }) => [asc(education.displayOrder)],
      },
      skills: {
        orderBy: (skills, { asc }) => [asc(skills.displayOrder)],
      },
      personalInfo: true,
    },
  });

  if (!document)
    return null;

  return document;
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = createDb(c.env);
  const { id } = c.req.valid("param");
  const authUser = c.get("authUser");

  const document = await getDocumentWithRelations(db, id, { userId: authUser.user!.id });

  if (!document) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(document, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDb(c.env);

  const document = c.req.valid("json");

  const authUser = c.get("authUser");

  const [inserted] = await db.insert(documents).values({
    title: document.title,
    userId: authUser.user!.id,
    status: DOCUMENT_STATUS.PRIVATE,
  }).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const db = createDb(c.env);
  const { id } = c.req.valid("param");
  const { type, data } = c.req.valid("json");
  const authUser = c.get("authUser");

  const document = await db.query.documents.findFirst({
    where: (documents, { eq }) =>
      and(eq(documents.id, String(id)), eq(documents.userId, authUser.user!.id)),
    with: {
      personalInfo: true,
      experience: true,
      education: true,
      skills: true,
    },
  });

  if (!document) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  try {
    let updatedData;

    switch (type) {
      case "document":
        updatedData = await handleBasicDocumentUpdate({ db, id, data: data as UpdateBasicDocumentSchema });
        break;

      case "personalInfo":
        updatedData = await handlePersonalInfoUpdate({ db, id, data: data as UpdatePersonalInfoSchema });
        break;

      case "experience":
        updatedData = await handleOneToManyUpdate({
          db,
          table: experience,
          documentId: id,
          items: data as UpdateExperienceSchema,
          getLatestDisplayOrder: async () => await db
            .query
            .experience
            .findMany({
              where: (experience, { eq }) => eq(experience.documentId, id),
              orderBy: (experience, { desc }) => [desc(experience.displayOrder)],
            })
            .then(result => result[0]?.displayOrder ?? 0),
        });
        break;

      case "education":
        updatedData = await handleOneToManyUpdate({
          db,
          table: education,
          documentId: id,
          items: data as UpdateEducationSchema,
          getLatestDisplayOrder: async () => await db
            .query
            .education
            .findMany({
              where: (education, { eq }) => eq(education.documentId, id),
              orderBy: (education, { desc }) => [desc(education.displayOrder)],
            })
            .then(result => result[0]?.displayOrder ?? 0),
        });
        break;

      case "skills":
        updatedData = await handleOneToManyUpdate({
          db,
          table: skills,
          documentId: id,
          items: data as UpdateSkillsSchema,
          getLatestDisplayOrder: async () => await db
            .query
            .skills
            .findMany({
              where: (skills, { eq }) => eq(skills.documentId, id),
              orderBy: (skills, { desc }) => [desc(skills.displayOrder)],
            })
            .then(result => result[0]?.displayOrder ?? 0),
        });
        break;
    }

    if (!updatedData) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const updatedDocument = await getDocumentWithRelations(db, id, { userId: authUser.user!.id });

    if (!updatedDocument) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    return c.json(updatedDocument, HttpStatusCodes.OK);
  }
  catch (error) {
    console.error("Update document failed:", error);
    return c.json(
      { message: "Update document failed" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = createDb(c.env);

  const { id } = c.req.valid("param");

  const authUser = c.get("authUser");

  const [deleted] = await db
    .delete(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, authUser.user!.id)))
    .returning();

  if (!deleted) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const removeAll: AppRouteHandler<RemoveAllRoute> = async (c) => {
  const db = createDb(c.env);
  const authUser = c.get("authUser");

  await db.delete(documents).where(eq(documents.userId, authUser.user!.id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const publicPreview: AppRouteHandler<PublicPreviewRoute> = async (c) => {
  const db = createDb(c.env);
  const { id } = c.req.valid("param");
  const authUser = c.get("authUser");

  const document = await getDocumentWithRelations(db, id, {
    isPublicPreview: true,
    userId: authUser?.user?.id,
  });

  if (!document) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(document, HttpStatusCodes.OK);
};
