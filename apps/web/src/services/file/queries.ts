import type { UseSuspenseQueryOptions } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { fileApi } from "./api";

export const fileKeys = {
  GET_FILE: (key: string) => ["get-file", key],
} as const;

type GetFileQueryOptions = Partial<UseSuspenseQueryOptions<Blob>>;

export const getFileQueryOptionsFn = (key: string, options?: GetFileQueryOptions) =>
  queryOptions({
    queryKey: fileKeys.GET_FILE(key),
    queryFn: () => fileApi.getFile(key),
    ...options,
  });
