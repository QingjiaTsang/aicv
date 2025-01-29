import { createId } from "@paralleldrive/cuid2";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/api/lib/types";

import type { GetFileRoute, UploadRoute } from "./file.routes";

export const upload: AppRouteHandler<UploadRoute> = async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;

  const fileKey = `${file.name}_${createId()}`;

  try {
    await c.env.RESUME_THUMBNAIL_BUCKET.put(fileKey, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });
    const url = `${c.env.APP_URL}/api/file/${fileKey}`;
    return c.json({ url }, HttpStatusCodes.OK);
  }
  catch (error) {
    console.error(error);
    return c.json(
      { message: HttpStatusPhrases.SERVICE_UNAVAILABLE },
      HttpStatusCodes.SERVICE_UNAVAILABLE,
    );
  }
};

export const getFile: AppRouteHandler<GetFileRoute> = async (c) => {
  const key = c.req.valid("param").key;

  const object = await c.env.RESUME_THUMBNAIL_BUCKET.get(key);

  if (!object) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000",
      "ETag": object.httpEtag,
    },
  });
};
