import type { CredentialsSchema } from "@aicv-app/api/schema";

import { credentialsSchema } from "@aicv-app/api/schema";
import { getSession } from "@hono/auth-js/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { useCredentialSigninMutation, useGithubSigninMutation, useGoogleSigninMutation } from "@/web/services/auth";

type SearchParams = {
  callbackUrl?: string;
};

export const Route = createFileRoute("/(auth)/signin")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      callbackUrl: search.callbackUrl as string,
    };
  },
  component: LoginPage,
  beforeLoad: async ({ search }) => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: search?.callbackUrl || "/",
      });
    }
  },
});

function LoginPage() {
  const { callbackUrl } = Route.useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
  });

  const { mutate: credentialSignin, isPending: isCredentialSigningIn, error: credentialSigninError } = useCredentialSigninMutation();
  const { mutate: githubSignin, isPending: isGithubSigningIn, error: githubSigninError } = useGithubSigninMutation();
  const { mutate: googleSignin, isPending: isGoogleSigningIn, error: googleSigninError } = useGoogleSigninMutation();

  const handleCredentialsSignIn = async (data: CredentialsSchema) => {
    credentialSignin({
      ...data,
      callbackUrl,
    });
  };

  const handleGoogleSignIn = async () => {
    googleSignin(callbackUrl);
  };

  const handleGithubSignIn = async () => {
    githubSignin(callbackUrl);
  };

  const isSigningIn = isCredentialSigningIn || isGithubSigningIn || isGoogleSigningIn;
  const signinError = credentialSigninError || githubSigninError || googleSigninError;

  return (
    <article className="grid place-items-center h-full">
      <div className="container max-w-sm">
        <h1 className="text-2xl font-bold mb-8 text-center">Sign In</h1>

        {signinError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {signinError.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleCredentialsSignIn)}
          className="space-y-4"
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full"
              disabled={isSigningIn}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full"
              disabled={isSigningIn}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full contrast"
          >
            {isSigningIn ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-8 text-center">
          <span className="text-gray-500">or</span>
        </div>

        <div className="flex flex-col justify-between items-center gap-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full contrast outline"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={isSigningIn}
            className="w-full contrast outline"
          >
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-4 text-center text-gray-500">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-1 text-blue-600 hover:text-blue-800 hover:underline"
          >
            Sign up now
          </Link>
        </p>

        {isSigningIn && <progress className="mt-4" />}
      </div>
    </article>
  );
}
