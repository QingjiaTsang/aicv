import { z } from "@hono/zod-openapi";

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export function paginatedResponseSchemaGenerator<T>(dataSchema: z.ZodSchema<T>) {
  return z.object({
    data: z.array(dataSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
}

export const idStringParamsSchema = z.object({
  id: z.string(),
});
