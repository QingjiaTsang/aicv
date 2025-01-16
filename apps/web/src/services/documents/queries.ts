import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { DocumentStatus, SelectDocumentWithRelationsSchema, SelectDocumentSchema } from "@aicv-app/api/schema";

import { queryOptions } from "@tanstack/react-query";

import { documentsApi, ListDocumentsParams } from "./api";

type DocumentsResponse = {
  data: SelectDocumentSchema[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type DocumentsQueryOptions = Partial<UseSuspenseQueryOptions<DocumentsResponse>>;
type DocumentQueryOptions = Partial<UseSuspenseQueryOptions<SelectDocumentWithRelationsSchema>>;

export const documentKeys = {
  LIST_DOCUMENTS: ["list-documents"],
  LIST_DOCUMENT: (id: string) => [`list-document-${id}`],
} as const;



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

export const documentQueryOptionsFn = (id: string, options?: DocumentQueryOptions) => 
  queryOptions({
    queryKey: documentKeys.LIST_DOCUMENT(id),
    queryFn: async () => {
      const document = await documentsApi.getDocument(id);
      return {
        ...document,
        status: document.status as DocumentStatus
      };
    },
    ...options,
  });