import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { DocumentStatus, SelectDocumentWithRelationsSchema, SelectDocumentSchema } from "@aicv-app/api/schema";

import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";

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
  LIST_DOCUMENTS: ["list-documents"] as const,
  LIST_DOCUMENT: (id: string) => [`list-document-${id}`] as const,
  INFINITE_DOCUMENTS: (params: { 
    status?: DocumentStatus, 
    search?: string,
    pageSize?: number 
  }) => [...documentKeys.LIST_DOCUMENTS, params] as const,
} as const;

export const infiniteDocumentsQueryOptionsFn = (params: { 
  status?: DocumentStatus, 
  search?: string,
  pageSize?: number 
}) => {
  return infiniteQueryOptions({
    queryKey: documentKeys.INFINITE_DOCUMENTS(params),
    queryFn: async ({ pageParam = 1 }) => {
      return documentsApi.listDocuments({
        page: pageParam,
        pageSize: params.pageSize || 12,
        status: params.status,
        search: params.search
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
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
    // Note: I'm using queryClient.setQueryData as global state management
    // to update the cached data of the document to preview when the user's filling the resume form
    staleTime: Infinity,
    ...options,
  });

export const publicDocumentQueryOptionsFn = (id: string, options?: DocumentQueryOptions) => 
  queryOptions({
    queryKey: documentKeys.LIST_DOCUMENT(id),
    queryFn: async () => {
      const document = await documentsApi.publicPreview(id);
      return document;
    },
    ...options,
  });
