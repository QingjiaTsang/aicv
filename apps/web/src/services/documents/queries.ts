import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { DocumentStatus, SelectDocumentSchema } from "@aicv-app/api/schema";

import { queryOptions } from "@tanstack/react-query";

import { documentsApi } from "./api";

type DocumentsResponse = {
  data: SelectDocumentSchema[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type DocumentsQueryOptions = Partial<UseSuspenseQueryOptions<DocumentsResponse>>;
type DocumentQueryOptions = Partial<UseSuspenseQueryOptions<SelectDocumentSchema>>;

export const documentKeys = {
  LIST_DOCUMENTS: ["list-documents"],
  LIST_DOCUMENT: (id: string) => [`list-document-${id}`],
} as const;

type ListDocumentsParams = {
  limit?: number;
  page?: number;
};

export const documentsQueryOptionsFn = (params?: ListDocumentsParams, options?: DocumentsQueryOptions) => queryOptions({
  queryKey: [...documentKeys.LIST_DOCUMENTS, params],
  queryFn: async () => {
    const response = await documentsApi.listDocuments(params);
    // Note: we need to manually cast the status back to DocumentStatus type here
    // because the status enum type would be lost in the response because JSON serialization/deserialization 
    // process only preserves the string value but loses the TypeScript enum type information
    return {
      ...response,
      data: response.data.map(doc => ({
        ...doc,
        status: doc.status as DocumentStatus
      }))
    };
  },
  ...options,
});

export function documentQueryOptionsFn(id: string, options?: DocumentQueryOptions) {
  return queryOptions({
    queryKey: documentKeys.LIST_DOCUMENT(id),
    queryFn: async () => {
      const response = await documentsApi.getDocument(id);
      return {
        ...response,
        status: response.status as DocumentStatus
      };
    },
    ...options,
  });
}