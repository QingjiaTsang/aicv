import type { UseMutationOptions } from "@tanstack/react-query";
import type { InsertDocumentSchema, UpdateDocumentDataSchema } from "@aicv-app/api/schema";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { documentsApi } from "./api";
import { documentKeys } from "./queries";

type CreateDocumentOptions = UseMutationOptions<
  Awaited<ReturnType<typeof documentsApi.createDocument>>,
  Error,
  InsertDocumentSchema
>;

type UpdateDocumentOptions = UseMutationOptions<
  void,
  Error,
  { id: string; document: UpdateDocumentDataSchema }
>;

type DeleteDocumentOptions = UseMutationOptions<
  void,
  Error,
  string
>;

export const useCreateDocumentMutation = (options?: CreateDocumentOptions) => {
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};
  return useMutation({
    mutationFn: documentsApi.updateDocument,
    onSuccess: async (...args) => {
      const { id } = args[1];
      await queryClient.invalidateQueries({
        queryKey: [...documentKeys.LIST_DOCUMENT(id)],
      });
      await userOnSuccess?.(...args);
    },
    ...restOptions,
  });
};

export const useDeleteDocumentMutation = (options?: DeleteDocumentOptions) => {
  const queryClient = useQueryClient();
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
