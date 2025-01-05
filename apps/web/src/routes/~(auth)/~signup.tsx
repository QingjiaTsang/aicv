import type { CreateUserSchema } from "@aicv-app/api/schema";

import { createUserSchema } from "@aicv-app/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSignupMutation } from "@/web/services/auth";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupPage,
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

function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate: signup, isPending: isSigningUp } = useSignupMutation({
    onSuccess: () => {
      navigate({ to: "/signin" });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: CreateUserSchema) => {
    signup(data);
  };

  return (
    <article className="grid place-items-center h-full">
      <div className="container max-w-sm">
        <h1 className="text-2xl font-bold mb-8 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message?.toString()}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full contrast"
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account?</span>
          <a
            href="/signin"
            className="ml-1 text-blue-600 hover:text-blue-800 hover:underline"
          >
            Please sign in
          </a>
        </div>
      </div>
    </article>
  );
}
