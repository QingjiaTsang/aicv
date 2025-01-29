import type { DrizzleD1Database } from "drizzle-orm/d1";

import { and, eq, or } from "drizzle-orm";

import * as schema from "@/api/db/schema";
import { personalInfo } from "@/api/db/schema/resume/personal-info";

type HandleDocumentUpdateParams = {
  db: DrizzleD1Database<typeof schema>;
  id: string;
  data: schema.UpdateBasicDocumentSchema;
};
export async function handleBasicDocumentUpdate({ db, id, data }: HandleDocumentUpdateParams) {
  const [updated] = await db
    .update(schema.documents)
    .set(data)
    .where(eq(schema.documents.id, id))
    .returning();
  return updated;
}

type HandlePersonalInfoUpdateParams = {
  db: DrizzleD1Database<typeof schema>;
  id: string;
  data: schema.UpdatePersonalInfoSchema;
};
export async function handlePersonalInfoUpdate({ db, id, data }: HandlePersonalInfoUpdateParams) {
  const [updated] = await db
    .update(personalInfo)
    .set(data)
    .where(eq(personalInfo.documentId, id))
    .returning();

  return updated;
}

type HandleOneToManyUpdateParams<T extends { id?: string }> = {
  db: DrizzleD1Database<typeof schema>;
  table: typeof schema.experience | typeof schema.education | typeof schema.skills;
  documentId: string;
  items: T[];
  getLatestDisplayOrder: () => Promise<number>;
};
export async function handleOneToManyUpdate<T extends { id?: string }>({
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

type GetDocumentOptions = {
  isPublicPreview?: boolean;
  userId?: string;
};
export async function getDocumentWithRelations(
  db: DrizzleD1Database<typeof schema>,
  id: string,
  options: GetDocumentOptions = {},
) {
  const { isPublicPreview = false, userId } = options;

  const whereCondition = isPublicPreview
    ? and(
        eq(schema.documents.id, id),
        or(
          eq(schema.documents.status, schema.DOCUMENT_STATUS.PUBLIC),
          eq(schema.documents.userId, userId ?? ""),
        ),
      )
    : and(
        eq(schema.documents.id, id),
        eq(schema.documents.userId, userId ?? ""),
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
