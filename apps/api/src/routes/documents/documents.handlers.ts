import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/api/lib/types";

import { createDb } from "@/api/db";
import { documents } from "@/api/db/schema/resume/documents";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/api/lib/constants";

import type { CreateRoute, GetOneRoute, ListRoute, RemoveRoute, UpdateRoute } from "./documents.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDb(c.env);

  const page = Number(c.req.query("page") ?? 1);
  const pageSize = Number(c.req.query("pageSize") ?? 10);

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const [documentsList, total] = await Promise.all([
    db.query.documents.findMany({
      limit,
      offset,
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

  const document = await db.query.documents.findFirst({
    where: (documents, { eq }) => eq(documents.id, String(id)),
  });

  if (!document) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(document, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDb(c.env);

  const document = c.req.valid("json");

  const session = c.get("authUser");

  const [inserted] = await db.insert(documents).values({
    ...document,
    userId: session.user!.id,
  }).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const db = createDb(c.env);

  const { id } = c.req.valid("param");
  const dataToUpdate = c.req.valid("json");

  if (Object.keys(dataToUpdate).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updatedData] = await db.update(documents).set(dataToUpdate).where(eq(documents.id, String(id))).returning();

  if (!updatedData) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedData, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = createDb(c.env);

  const { id } = c.req.valid("param");

  const [deleted] = await db.delete(documents).where(eq(documents.id, id)).returning();

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
