import type { DrizzleD1Database } from "drizzle-orm/d1";

import { and, eq } from "drizzle-orm";
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

import type { CreateRoute, GetOneRoute, ListRoute, RemoveRoute, UpdateRoute } from "./documents.routes";

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

  // Convert Date objects to strings for API response
  const formattedDocuments = documentsList.map(document => ({
    ...document,
    createdAt: document.createdAt?.toISOString() ?? null,
    updatedAt: document.updatedAt?.toISOString() ?? null,
  }));

  return c.json({
    data: formattedDocuments,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = createDb(c.env);

  const { id } = c.req.valid("param");

  const authUser = c.get("authUser");

  const document = await db.query.documents.findFirst({
    where: (documents, { eq }) => and(eq(documents.id, String(id)), eq(documents.userId, authUser.user!.id)),
    with: {
      education: true,
      experience: true,
      skills: true,
      personalInfo: true,
    },
  });

  if (!document) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  const formattedDocument = {
    ...document,
    experience: document.experience.map(exp => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).getTime() : null,
      endDate: exp.endDate ? new Date(exp.endDate).getTime() : null,
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    })),
    education: document.education.map(edu => ({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate).getTime() : null,
      endDate: edu.endDate ? new Date(edu.endDate).getTime() : null,
      createdAt: edu.createdAt.toISOString(),
      updatedAt: edu.updatedAt.toISOString(),
    })),
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };

  return c.json(formattedDocument, HttpStatusCodes.OK);
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
  transformData?: (item: T) => any;
};
async function handleOneToManyUpdate<T extends { id?: string }>({
  db,
  table,
  documentId,
  items,
  transformData,
}: HandleOneToManyUpdateParams<T>) {
  const results = await Promise.all(
    items.map(async (item) => {
      const data = transformData ? transformData(item) : item;
      // one-to-many relationship(experience/education/skills) upsert has to depend on the id field
      if (item.id) {
        const [updated] = await db
          .update(table)
          .set({ ...data, documentId })
          .where(eq(table.id, item.id))
          .returning();
        return updated;
      }
      const [inserted] = await db
        .insert(table)
        .values({ ...data, documentId })
        .returning();
      return inserted;
    }),
  );
  return results[results.length - 1];
}

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const db = createDb(c.env);
  const { id } = c.req.valid("param");
  const { type, data } = c.req.valid("json");
  const authUser = c.get("authUser");

  console.log('update logger',{
    type,
    data,
  });

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
          transformData: item => ({
            ...item,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
          }),
        });
        break;

      case "education":
        updatedData = await handleOneToManyUpdate({
          db,
          table: education,
          documentId: id,
          items: data as UpdateEducationSchema,
          transformData: item => ({
            ...item,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
          }),
        });
        break;

      case "skills":
        updatedData = await handleOneToManyUpdate({
          db,
          table: skills,
          documentId: id,
          items: data as UpdateSkillsSchema,
        });
        break;
    }

    if (!updatedData) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const updatedDocument = await db.query.documents.findFirst({
      where: (documents, { eq }) => eq(documents.id, id),
      with: {
        personalInfo: true,
        experience: true,
        education: true,
        skills: true,
      },
    });

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
