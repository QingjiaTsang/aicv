import type { CreateUserSchema, CredentialsSigninSchema } from "@aicv-app/api/schema";

import { signIn } from "@hono/auth-js/react";
import * as HttpStatusCodes from "stoker/http-status-codes";

import apiClient from "@/web/lib/api-client";
import formatApiError from "@/web/lib/format-api-error";