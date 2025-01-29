import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["File"];

const uploadRequestSchema = z.object({
  file: z.instanceof(File),
});

const uploadResponseSchema = z.object({
  url: z.string(),
});

export const upload = createRoute({
  tags,
  method: "post",
  path: "/file/upload",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: uploadRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(uploadResponseSchema, "File uploaded"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(uploadRequestSchema),
      "Invalid file upload request",
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.SERVICE_UNAVAILABLE),
      "File upload failed, please try again later",
    ),
  },
});

export const getFile = createRoute({
  tags,
  method: "get",
  path: "/file/{key}",
  request: {
    params: z.object({
      key: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "application/octet-stream": {
          schema: z.instanceof(Blob),
        },
      },
      description: "File content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "File not found",
    ),
  },
});

export type UploadRoute = typeof upload;
export type GetFileRoute = typeof getFile;
