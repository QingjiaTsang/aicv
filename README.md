# Hono + React / Vite + Cloudflare + pnpm workspaces monorepo

A monorepo setup using pnpm workspaces with a Hono API and React / vite client deployed to Cloudflare Workers / Static Assets / D1.

Features:

- Run tasks in parallel across apps / packages with pnpm
- Hono API [proxied with vite](./apps/web/vite.config.ts) during development
- Hono [RPC client](packages/api-client/src/index.ts) built during development for faster inference
- Shared Zod validators with drizzle-zod
- Shared eslint config
- Shared tsconfig

Tech Stack:

- api
  - hono
  - hono openapi
  - authjs
  - stoker
  - drizzle
  - drizzle-zod
- web
  - react
  - vite
  - react-hook-form
  - tanstack router
- dev tooling
  - typescript
  - eslint with `@antfu/eslint-config`

Tour:

- Base [tsconfig.json](./tsconfig.json) with default settings lives in the root
- Shared packages live in [/packages] directory
  - Base [eslint.config.js](./packages/eslint-config/eslint.config.js) with default settings
- Applications live in [/apps] directory
  - Use any cli to create new apps in here
  - If cloning a git repo in here be sure to delete the `.git` folder so it is not treated as a submodule

> All pnpm commands are run from the root of the repo.

## Local **Setup**

### Install dependencies

```sh
pnpm i
```

### Create / Update Cloudflare D1 Database id

```sh
pnpm dlx wrangler d1 create replace-with-your-database-name-here
```

Update `database_name` and `database_id` in [apps/api/wrangler.toml](./apps/api/wrangler.toml) with the output from wrangler.

### Run DB migrations locally

```sh
pnpm run -r db:migrate:local
```

### Configure Environment Variables

For local development and production, copy the example configuration file:

```sh
cp apps/api/wrangler.toml.example apps/api/wrangler.toml
```

Update the following variables in `apps/api/wrangler.toml`:

- `database_name`: Your database name
- `database_id`: Your database ID
- `AUTH_URL`: Authentication URL
- `GITHUB_CLIENT_ID`: GitHub client ID
- `GITHUB_CLIENT_SECRET`: GitHub client secret
- `AUTH_SECRET`: Authentication secret
- `AUTH_GOOGLE_ID`: Google client ID
- `AUTH_GOOGLE_SECRET`: Google client secret
- `RESEND_API_KEY`: Resend API key
- `APP_URL`: Your application URL
- `COOKIE_DOMAIN`: Cookie domain
- `DEEPSEEK_API_KEY`: DeepSeek API key

For development, create a `.dev.vars` file in the `apps/api` directory with the following content:

```env
LOG_LEVEL=debug
ENV=development

AUTH_URL=http://localhost:5173/api/auth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
AUTH_SECRET=your-auth-secret
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
APP_URL=http://localhost:5173
DEEPSEEK_API_KEY=your-deepseek-api-key
COOKIE_DOMAIN=localhost
```

### Start Apps

```sh
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

All requests to `/api` will be proxied to the hono server running on [http://localhost:8787](http://localhost:8787)

## Production Setup

### Run DB migrations on Cloudflare D1

```sh
pnpm run -r db:migrate:remote
```

### Deploy

```sh
pnpm run deploy
```

## Tasks

### Lint

```sh
pnpm run lint
```

### Test

```sh
pnpm run test
```

### Build

```sh
pnpm run build
```
