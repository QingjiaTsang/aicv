import type { UseMutationOptions } from "@tanstack/react-query";
import type { InsertDocumentSchema, SelectDocumentWithRelationsSchema, UpdateDocumentDataSchema } from "@aicv-app/api/schema";

import { useMutation } from "@tanstack/react-query";
import queryClient from "@/web/lib/query-client";

import { documentsApi } from "./api";
import { documentKeys } from "./queries";

type CreateDocumentOptions = UseMutationOptions<
  Awaited<ReturnType<typeof documentsApi.createDocument>>,
  Error,
  InsertDocumentSchema
>;

type UpdateDocumentOptions = UseMutationOptions<
  SelectDocumentWithRelationsSchema,
  Error,
  {
    id: string;
    document: UpdateDocumentDataSchema;
  },
  {
    previousData?: SelectDocumentWithRelationsSchema;
  }
>;

type DeleteDocumentOptions = UseMutationOptions<
  void,
  Error,
  string
>;

type DeleteAllDocumentsOptions = UseMutationOptions<
  void,
  Error,
  void
>;

export const useCreateDocumentMutation = (options?: CreateDocumentOptions) => {
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: documentsApi.createDocument,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: documentKeys.LIST_DOCUMENTS,
      });
      await userOnSuccess?.(...args);
    },
    ...restOptions,
  });
};

export const useUpdateDocumentByTypeMutation = (options?: UpdateDocumentOptions) => {
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: documentsApi.updateDocument,
    onSuccess: async (...args) => {
      const { id } = args[1];
      // await queryClient.invalidateQueries({
      //   queryKey: [...documentKeys.LIST_DOCUMENT(id)],
      // });
      const { themeColor, status, sectionOrder, experience, education, skills } = args[0]

      queryClient.setQueryData(documentKeys.LIST_DOCUMENT(id), (old: SelectDocumentWithRelationsSchema) => {
        if (!old) return old;
        return {
          ...old,
          themeColor,
          status,
          sectionOrder,
          experience,
          education,
          skills,
        }
      });

      await userOnSuccess?.(...args);
    },
    ...restOptions,
  });
};

export const useDeleteDocumentMutation = (options?: DeleteDocumentOptions) => {
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};
  return useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: documentKeys.LIST_DOCUMENTS,
      });
      await userOnSuccess?.(...args);
    },
    ...restOptions,
  });
};

export const useDeleteAllDocumentsMutation = (options?: DeleteAllDocumentsOptions) => {
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};
  return useMutation({
    mutationFn: async () => {
      await documentsApi.deleteAll();
      return;
    },
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: documentKeys.LIST_DOCUMENTS,
      });
      await userOnSuccess?.(...args);
    },
    ...restOptions,
  });
};
