import type { UseMutationOptions } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import { fileApi } from "./api";

type UploadFileOptions = UseMutationOptions<
  { url: string },
  Error,
  File
>;

export const useUploadFileMutation = (options?: UploadFileOptions) => {
  return useMutation({
    mutationFn: fileApi.uploadFile,
    ...options,
  });
};