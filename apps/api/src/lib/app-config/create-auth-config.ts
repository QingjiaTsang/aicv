import type { AuthConfig } from "@hono/auth-js";

import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/d1";

import type { AppEnv } from "@/api/lib/types";

export default function createAuthConfig(env: AppEnv["Bindings"]): AuthConfig {
  const adapter = DrizzleAdapter(drizzle(env.DB));
  // const db = drizzle(env.DB);

  return {
    adapter,
    secret: env.AUTH_SECRET,
    // Important note:
    // Since we customize the credentials signin logic in the credentialsSignin route where we set the cookie by ourselves,
    // we need to set the cookie options here to be the same as the ones in the credentialsSignin route
    // to tell auth.js to use this exact cookie opting out of the built-in dynamic policy, instead of using the default one.
    // (otherwise, it'll surprisingly cause some weird issues in production but in dev it's fine)
    cookies: {
      sessionToken: {
        name: "authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: env.ENV === "production",
          domain: env.ENV === "production"
            ? env.COOKIE_DOMAIN
            : undefined,
        },
      },
    },
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
