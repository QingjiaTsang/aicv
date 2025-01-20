import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { insertDocumentSchema, selectDocumentSchema, selectDocumentWithRelationsSchema, updateDocumentDataSchema } from "@/api/db/schema";
import { notFoundSchema } from "@/api/lib/constants";
import { idStringParamsSchema, paginatedResponseSchemaGenerator, paginationQuerySchema } from "@/api/lib/schemas";

const tags = ["Documents"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/documents",
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContentRequired(
      paginatedResponseSchemaGenerator(selectDocumentSchema),
      "Documents",
    ),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/documents/{id}",
  request: {
    params: idStringParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectDocumentWithRelationsSchema, "Document with relations"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Document not found"),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/documents",
  request: {
    body: jsonContentRequired(insertDocumentSchema, "Document"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectDocumentSchema, "Document created"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertDocumentSchema),
      "The validation error(s)",
    ),
  },
});

export const update = createRoute({
  tags,
  method: "patch",
  path: "/documents/{id}",
  request: {
    params: idStringParamsSchema,
    body: jsonContentRequired(updateDocumentDataSchema, "Update document data based on type"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectDocumentWithRelationsSchema, "Document updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Document not found"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Update document failed"),
      "Update document failed",
    ),
  },
});

export const remove = createRoute({
  tags,
  method: "delete",
  path: "/documents/{id}",
  request: {
    params: idStringParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: "Document deleted" },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Document not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(idStringParamsSchema),
      "Invalid document ID",
    ),
  },
});

export const publicPreview = createRoute({
  tags: ["Public", "Documents"],
  method: "get",
  path: "/public/documents/{id}",
  request: {
    params: idStringParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectDocumentWithRelationsSchema, "Document with relations"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Document not found"),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type PublicPreviewRoute = typeof publicPreview;
