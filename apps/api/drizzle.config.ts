import { defineConfig } from "drizzle-kit";

// only used to create migrations
// we use wrangler to apply migrations (see package.json)
export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  // dbCredentials: {
  //   url: "../api/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/f190009084a5e2eff8d1db590d18a3201df3a7a33c29ae062e23dd0a6d51bce4.sqlite",
  // },
});
