import type { AuthConfig } from "@hono/auth-js";

import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/d1";

import type { AppEnv } from "./types";

// import { AuthError, CredentialsSignin } from "@auth/core/errors";
// import { encode } from "@auth/core/jwt";
// import Credentials from "@auth/core/providers/credentials";
// import { createId } from "@paralleldrive/cuid2";
// import { getUserFromDb } from "./auth-utils";

// Note: it doesn't support custom error handling when it comes to credentials in auth.js.
// The solution from docs is also not working for stacks with Vite, React and Honojs.
// Related issue: https://github.com/nextauthjs/next-auth/issues/12479
// So I handle it manually by building my endpoint compatible with auth.js.

// Docs' solution: https://authjs.dev/getting-started/providers/credentials
// class InvalidLoginError extends CredentialsSignin {
//   code = "custom_error";
// }

export default function createAuthConfig(env: AppEnv["Bindings"]): AuthConfig {
  const adapter = DrizzleAdapter(drizzle(env.DB));
  // const db = drizzle(env.DB);

  return {
    adapter,
    secret: env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
      Google({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
      // Credentials({
      //   credentials: {
      //     email: {
      //       label: "Email",
      //       type: "email",
      //       placeholder: "Please enter your email",
      //     },
      //     password: {
      //       label: "Password",
      //       type: "password",
      //       placeholder: "Please enter your password",
      //     },
      //   },
      //   async authorize(credentials) {
      //     if (!credentials?.email || !credentials?.password) {
      //       return null;
      //     }

      //     const result = await getUserFromDb(db, credentials.email as string, credentials.password as string);

      //     // Wrong password or email not verified
      //     if (!result.success) {
      //       throw new InvalidLoginError("hello world");
      //     }

      //     return result.user!;
      //   },
      // }),
    ],
    // callbacks: {
    //   async jwt({ token, account }) {
    //     if (account?.provider === "credentials") {
    //       token.credentials = true;
    //     }
    //     return token;
    //   },
    // },
    // jwt: {
    //   encode: async (params) => {
    //     if (params.token?.credentials) {
    //       const sessionToken = createId()

    //       if (!params.token.sub) {
    //         throw new Error("No user ID found in token");
    //       }

    //       const createdSession = await adapter.createSession?.(
    //         {
    //           sessionToken,
    //           userId: params.token.sub,
    //           expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    //         },
    //       );

    //       if (!createdSession) {
    //         throw new Error("Failed to create session");
    //       }

    //       return sessionToken;
    //     }

    //     return await encode(params);
    //   },
    // },
  };
}
