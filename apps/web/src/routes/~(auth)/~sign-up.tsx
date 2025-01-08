import type { CreateUserSchema } from "@aicv-app/api/schema";

import { createUserSchema } from "@aicv-app/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { z } from "zod";

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
  FormLabel,
  FormMessage,
} from "@/web/components/shadcn-ui/form";
import { Input } from "@/web/components/shadcn-ui/input";
import { useSignupMutation } from "@/web/services/auth";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: SignUpPage,
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
  const [emailSent, setEmailSent] = useState(false);

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
      setEmailSent(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: CreateUserSchema) => {
    signup(data);
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Verification Email Sent</CardTitle>
            <CardDescription className="text-center">
              We have sent a verification link to your email, please check your email and click the link to complete the verification.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const errorMessage
    = signupError?.message === HttpStatusPhrases.CONFLICT ? "Email already exists" : signupError?.message;

  return (
    <div className="flex h-full w-full items-center justify-center p-4 mt-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {signupError && (
            <div className="bg-destructive/15 text-destructive mb-3 rounded-md px-3 py-2">
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Please enter your name" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Please enter your email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Please enter your password" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Please re-enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>
            <Link
              to="/sign-in"
              className="text-primary ml-1 font-medium hover:underline"
            >
              Sign in now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
