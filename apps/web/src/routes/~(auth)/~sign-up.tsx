import type { CreateUserSchema } from "@aicv-app/api/schema";

import { createUserSchema } from "@aicv-app/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { z } from "zod";
import { motion } from "framer-motion";

import { Button } from "@/web/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useSignupMutation } from "@/web/services/auth";
import { CheckCircle2, Mail } from "lucide-react";
import { getSession } from "@hono/auth-js/react";
import { AuthBackground } from "@/web/components/auth-background";
import LenisLink from "@/web/lenis-link";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: SignUpPage,
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

const signupSchema = createUserSchema
  .extend({
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "The two passwords you entered do not match",
    path: ["confirmPassword"],
  });

type SignupSchema = z.infer<typeof signupSchema>;

function SignUpPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: signup, isPending: isSigningUp, error: signupError } = useSignupMutation({
    onSuccess: () => {
      setIsEmailSent(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: CreateUserSchema) => {
    signup(data);
  };

  if (isEmailSent) {
    return (
      <div className="flex h-full px-4 items-center justify-center relative">
        <AuthBackground />
        <Card className="p-0 w-full max-w-sm border dark:border-gray-800 dark:bg-gray-950/80 shadow-2xl backdrop-blur-sm overflow-hidden">
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 animate-ping">
                <Mail className="size-12 text-primary/40" />
              </div>
              <Mail className="size-12 text-primary relative animate-bounce" />
            </motion.div>

            <div className="space-y-2 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2"
              >
                <CheckCircle2 className="size-5 text-green-500" />
                <CardTitle className="text-2xl text-foreground">
                  Verification Email Sent
                </CardTitle>
              </motion.div>
              <CardDescription className="text-muted-foreground">
                Please check your email and click the verification link to complete the process.
              </CardDescription>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const errorMessage
    = signupError?.message === HttpStatusPhrases.CONFLICT ? "Email already exists" : signupError?.message;

  return (
    <div className="flex h-full w-full px-4 items-center justify-center relative">
      <AuthBackground />
      <Card className="w-full max-w-sm border dark:border-gray-800 dark:bg-gray-950/80 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl dark:text-gray-200">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {signupError && (
            <div className="bg-destructive/15 text-destructive dark:bg-red-900/20 dark:text-red-400 mb-6 rounded-md px-3 py-2">
              {errorMessage}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Confirm Password" {...field} />
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
                  disabled={isSigningUp}
                  className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSigningUp ? (
                      "Creating Your AI Space..."
                    ) : (
                      <>
                        <span className="mr-2">Start Your AI Journey</span>
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

          <p className="text-muted-foreground dark:text-gray-400 mt-6 text-center text-sm">
            Already have an account?{" "}
            <LenisLink
              to="/sign-in"
              className="text-primary dark:text-blue-400 underline-offset-4 hover:underline"
            >
              Sign in now
            </LenisLink>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
