import type { CreateUserSchema, CredentialsSigninSchema } from "@aicv-app/api/schema";

import { signIn } from "@hono/auth-js/react";
import * as HttpStatusCodes from "stoker/http-status-codes";

import apiClient from "@/web/lib/api-client";
import formatApiError from "@/web/lib/format-api-error";

export const authApi = {
  signup: async (data: CreateUserSchema) => {
    const response = await apiClient.api.auth.signup.$post({
      json: data,
    });

    if (response.status === HttpStatusCodes.CREATED) {
      return await response.json() as void;
    }

    const json = await response.json();

    if ("message" in json) {
      throw new Error(json.message);
    }
    if ("error" in json) {
      const message = formatApiError(json);
      throw new Error(message);
    }
  },

  credentialSignin: async (data: CredentialsSigninSchema) => {
    const response = await apiClient.api.auth.credentials.signin.$post({
      json: data,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  githubSignin: async (callbackUrl?: string) => {
    const response = await signIn("github", {
      callbackUrl,
    });

    if (response && response.status !== HttpStatusCodes.OK) {
      throw new Error(response.error);
    }

    return response;
  },

  googleSignin: async (callbackUrl?: string) => {
    const response = await signIn("google", {
      callbackUrl,
    });

    if (response && response.status !== HttpStatusCodes.OK) {
      throw new Error(response.error);
    }

    return response;
  },
} as const;
