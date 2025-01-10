import type { CredentialsSchema } from "@aicv-app/api/schema";

import { credentialsSchema } from "@aicv-app/api/schema";
import { getSession } from "@hono/auth-js/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { motion } from "framer-motion";

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
import { AuthBackground } from "@/web/components/auth-background";

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
  const navigate = useNavigate();

  const form = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const {
    mutate: credentialSignin,
    isPending: isCredentialSigningIn,
    error: credentialSigninError,
  } = useCredentialSigninMutation({
    onSuccess: () => {
      navigate({
        to: callbackUrl || "/",
      });
    },
  });

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
    <div className="flex h-full w-full px-4 items-center justify-center relative">
      <AuthBackground />
      <Card className="w-full max-w-sm border-0 dark:border dark:border-violet-800/20 bg-white/80 dark:bg-gray-950/50 shadow-2xl dark:shadow-violet-900/5 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl dark:text-gray-200">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {signinError && (
            <div className="bg-destructive/15 text-destructive dark:bg-red-900/20 dark:text-red-400 mb-6 rounded-md px-3 py-2">
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
                        className="bg-white/80 dark:bg-gray-900/50 border-violet-100 dark:border-violet-800/20 focus:border-violet-500 dark:focus:border-violet-500"
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 dark:from-violet-600 dark:via-fuchsia-600 dark:to-purple-600 hover:from-violet-600 hover:via-fuchsia-600 hover:to-purple-600 dark:hover:from-violet-500 dark:hover:via-fuchsia-500 dark:hover:to-purple-500 text-white font-medium rounded-xl shadow-lg hover:shadow-violet-500/25 dark:hover:shadow-violet-800/20 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSigningIn ? (
                      "Powering up AI..."
                    ) : (
                      <>
                        <span className="mr-2">Let AI Boost Your Career</span>
                        <span className="group-hover:rotate-180 transition-transform duration-300">
                          ✨
                        </span>
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background dark:bg-gray-950 text-muted-foreground dark:text-gray-400 px-2">
                or
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full bg-white/80 dark:bg-gray-900/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-900 dark:text-gray-200 font-medium border border-violet-200 dark:border-violet-800/20 hover:border-violet-300 dark:hover:border-violet-700 rounded-xl transition-all duration-300"
              >
                <FcGoogle className="mr-3 w-6 h-6 scale-125" />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {isSigningIn ? "Starting..." : "Continue with Google"}
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                type="button"
                onClick={handleGithubSignIn}
                disabled={isSigningIn}
                className="w-full bg-white/80 dark:bg-gray-900/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-900 dark:text-gray-200 font-medium border border-violet-200 dark:border-violet-800/20 hover:border-violet-300 dark:hover:border-violet-700 rounded-xl transition-all duration-300"
              >
                <FaGithub className="mr-3 w-6 h-6 scale-125" />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {isSigningIn ? "Starting..." : "Continue with GitHub"}
                </span>
              </Button>
            </motion.div>
          </div>

          <p className="text-muted-foreground dark:text-gray-400 mt-6 text-center text-sm">
            Don't have an account?
            <Link
              to="/sign-up"
              className="ml-1 text-primary dark:text-blue-400 underline-offset-4 hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
