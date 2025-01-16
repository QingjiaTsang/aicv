import { Resend } from "resend";

import type { AppEnv } from "@/api/lib/types";

export async function sendVerificationEmail(
  email: string,
  token: string,
  env: AppEnv["Bindings"],
) {
  const resend = new Resend(env.RESEND_API_KEY);

  const confirmLink = `${env.APP_URL}/api/auth/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "AICV <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email",
      html: `
      <h1>Verify your email</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${confirmLink}">${confirmLink}</a>
      <p>This link will expire in 24 hours</p>
    `,
    });
    if (error) {
      console.error("Resend email sending failed:", error);
      throw new Error("Email sending failed");
    }

    return data;
  }
  catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email sending failed");
  }
}
