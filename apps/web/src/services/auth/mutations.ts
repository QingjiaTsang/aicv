import type { CreateUserSchema, CredentialsSigninSchema } from "@aicv-app/api/schema";
import type { UseMutationOptions } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";

import { authApi } from "./api";

type SignupOptions = UseMutationOptions<
  Awaited<ReturnType<typeof authApi.signup>>,
  Error,
  CreateUserSchema
>;

type CredentialsSigninOptions = UseMutationOptions<
  Awaited<ReturnType<typeof authApi.credentialSignin>>,
  Error,
  CredentialsSigninSchema
>;

type GithubSigninOptions = UseMutationOptions<
  Awaited<ReturnType<typeof authApi.githubSignin>>,
  Error,
  string | undefined
>;

type GoogleSigninOptions = UseMutationOptions<
  Awaited<ReturnType<typeof authApi.googleSignin>>,
  Error,
  string | undefined
>;

export const useSignupMutation = (options?: SignupOptions) => {
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: async (...args) => {
      await userOnSuccess?.(...args);
    },
    ...restOptions,
  });
};

export const useCredentialSigninMutation = (options?: CredentialsSigninOptions) => {
  return useMutation({
    mutationFn: authApi.credentialSignin,
    ...options,
  });
};

export const useGithubSigninMutation = (options?: GithubSigninOptions) => {
  return useMutation({
    mutationFn: authApi.githubSignin,
    ...options,
  });
};

export const useGoogleSigninMutation = (options?: GoogleSigninOptions) => {
  return useMutation({
    mutationFn: authApi.googleSignin,
    ...options,
  });
};
