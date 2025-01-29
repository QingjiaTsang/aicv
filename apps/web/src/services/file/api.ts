import apiClient from "@/web/lib/api-client";
import formatApiError from "@/web/lib/format-api-error";

export const fileApi = {
  uploadFile: async (file: File) => {
    const response = await apiClient.api.file.upload.$post({
      form: { file },
    });

    const json = await response.json();
    if ("error" in json) {
      const message = formatApiError(json);
      throw new Error(message);
    }

    if ("message" in json) {
      throw new Error(json.message);
    }

    return json as { url: string };
  },

  getFile: async (key: string) => {
    const response = await apiClient.api.file[":key"].$get({
      param: { key },
    });

    if (!response.ok) {
      const json = await response.json();
      if ("message" in json) {
        throw new Error(json.message);
      }
      throw new Error("Failed to get file");
    }

    return response.blob();
  },
};
