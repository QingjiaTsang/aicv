import { defineWorkersConfig, readD1Migrations } from "@cloudflare/vitest-pool-workers/config";
import path from "node:path";

export default defineWorkersConfig(async () => {
  const migrationsPath = path.join(__dirname, "src", "db", "migrations");
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      poolOptions: {
        workers: {
          isolatedStorage: false,
          wrangler: {
            configPath: "./wrangler.toml",
          },
          miniflare: {
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
    resolve: {
      alias: {
        "@/api": path.resolve(__dirname, "./src"),
      },
    },
  };
});
