import { z } from "@hono/zod-openapi";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});
export type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>;

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
