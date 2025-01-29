import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type {
  UpdateBasicDocumentSchema,
  UpdateEducationSchema,
  UpdateExperienceSchema,
  UpdatePersonalInfoSchema,
  UpdateSkillsSchema,
} from "@/api/db/schema/resume/documents";
import type { AppRouteHandler } from "@/api/lib/types";

import { createDb } from "@/api/db";
import { DOCUMENT_STATUS, documents } from "@/api/db/schema/resume/documents";
import { education } from "@/api/db/schema/resume/education";
import { experience } from "@/api/db/schema/resume/experience";
import { skills } from "@/api/db/schema/resume/skills";
import {
  getDocumentWithRelations,
  handleBasicDocumentUpdate,
  handleOneToManyUpdate,
  handlePersonalInfoUpdate,
} from "@/api/routes/documents/utils";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PublicPreviewRoute,
  RemoveAllRoute,
  RemoveRoute,
  UpdateRoute,
} from "./documents.routes";

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
