import type { CredentialsSchema } from "@aicv-app/api/schema";

import { credentialsSchema } from "@aicv-app/api/schema";
import { getSession } from "@hono/auth-js/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/web/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/web/components/shadcn-ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/web/components/shadcn-ui/form";
import { Input } from "@/web/components/shadcn-ui/input";
import {
  useCredentialSigninMutation,
  useGithubSigninMutation,
  useGoogleSigninMutation,
} from "@/web/services/auth";

type SearchParams = {
  callbackUrl?: string;
};

export const Route = createFileRoute("/(auth)/sign-in")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      callbackUrl: search.callbackUrl as string,
    };
  },
  component: SigninPage,
  beforeLoad: async ({ search }) => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: search?.callbackUrl || "/",
      });
    }
  },
});

function SigninPage() {
  const { callbackUrl } = Route.useSearch();

  const form = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
  });

  const {
    mutate: credentialSignin,
    isPending: isCredentialSigningIn,
    error: credentialSigninError,
  } = useCredentialSigninMutation();

  const {
    mutate: githubSignin,
    isPending: isGithubSigningIn,
    error: githubSigninError,
  } = useGithubSigninMutation();

  const {
    mutate: googleSignin,
    isPending: isGoogleSigningIn,
    error: googleSigninError,
  } = useGoogleSigninMutation();

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
    <div className="flex h-full w-full items-center justify-center p-4 mt-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {signinError && (
            <div className="bg-destructive/15 text-destructive mb-6 rounded-md px-3 py-2">
              {signinError.message}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCredentialsSignIn)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        disabled={isSigningIn}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        disabled={isSigningIn}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSigningIn}
                className="w-full"
              >
                {isSigningIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                or
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="secondary"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full"
            >
              Sign in with Google
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleGithubSignIn}
              disabled={isSigningIn}
              className="w-full"
            >
              Sign in with GitHub
            </Button>
          </div>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            Don't have an account?
            <Link
              to="/sign-up"
              className="ml-1 text-primary underline-offset-4 hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
