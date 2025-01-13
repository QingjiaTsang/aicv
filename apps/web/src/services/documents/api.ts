import type { InsertDocumentSchema, UpdateDocumentSchema } from "@aicv-app/api/schema";

import * as HttpStatusCodes from "stoker/http-status-codes";

import apiClient from "@/web/lib/api-client";
import formatApiError from "@/web/lib/format-api-error";

export const documentsApi = {
  listDocuments: async ({ limit = 10, page = 1 }: { limit?: number; page?: number } = {}) => {
    const response = await apiClient.api.documents.$get({
      query: {
        limit,
        page,
      },
    });

    return response.json();  
  },

  getDocument: async (id: string) => {
    const response = await apiClient.api.documents[":id"].$get({
      param: { id },
    });

    const json = await response.json();

    if ("message" in json) {
      throw new Error(json.message);
    }
    if ("error" in json) {
      const message = formatApiError(json);
      throw new Error(message);
    }

    return json;
  },

  createDocument: async (document: InsertDocumentSchema) => {
    const response = await apiClient.api.documents.$post({
      json: document,
    });

    const json = await response.json();
    if ("error" in json) {
      const message = formatApiError(json);
      throw new Error(message);
    }
    return json;
  },

  updateDocument: async ({ id, document }: { id: string; document: UpdateDocumentSchema }) => {
    const response = await apiClient.api.documents[":id"].$patch({
      param: {
        id,
      },
      json: document,
    });
    if (response.status !== HttpStatusCodes.OK) {
      const json = await response.json();
      if ("message" in json) {
        throw new Error(json.message);
      }
      const message = formatApiError(json);
      throw new Error(message);
    }
  },

  deleteDocument: async (id: string) => {
    const response = await apiClient.api.documents[":id"].$delete({
      param: { id },
    });

     if (response.status !== HttpStatusCodes.NO_CONTENT) {
      const json = await response.json();
      if ("message" in json) {
        throw new Error(json.message);
      }
      const message = formatApiError(json);
      throw new Error(message);
    }
  },
};
