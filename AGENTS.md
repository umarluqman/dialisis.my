# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app` (layouts, routes, metadata); global styles are in `src/app/globals.css`.
- Shared UI is in `src/components` (primitives in `src/components/ui`); reusable logic/constants in `src/lib`, `src/hooks`, `src/constants`; shared types in `src/types`.
- Contentlayer markdown lives in `posts/`; SEO helpers include `sitemap.ts` and `sitemap-index.ts`; static assets are in `public/`.
- Prisma schema is at `prisma/schema.prisma` (SQL artifact in `migration.sql`); seeding helper sits at `scripts/populate-db.js`.
- Playwright e2e specs are under `e2e/` with config in `playwright.config.ts`.

## Build, Test, and Development Commands
- Prefer `pnpm` (lockfile tracked). `.env.local` is required for DB and public keys.
- `pnpm dev` starts the dev server on port 3003 (`PORT` overrides); `pnpm start` serves the built app.
- `pnpm lint` runs `next lint`. `pnpm build` = `prisma generate` + `next build`; `pnpm prod:build` also runs `prisma migrate deploy` for CI/prod.
- Data helpers: `pnpm db` (migrate dev), `pnpm db:push` (schema sync), `pnpm studio` (Prisma Studio), `pnpm populate-db` (seed).
- Tests: `pnpm test:e2e`; set `SITE_URL=http://localhost:3003` to match the dev port or point to an existing server.

## Coding Style & Naming Conventions
- Strict TypeScript; default to server components, add `"use client"` when hooks/state are needed.
- File names are usually kebab-case; exported components use PascalCase. Use the `@/` alias instead of deep relative imports.
- Tailwind-first styling (`globals.css`, `tailwind.config.ts`); compose utility classes and reuse shared components.
- 2-space indentation; keep imports grouped (external, `@/`, relative). `pnpm lint` is the authority on formatting.

## Testing Guidelines
- Add Playwright specs under `e2e/*.spec.ts` using `test/expect` with descriptive titles.
- Cover primary flows (navigation, search/filtering, forms, SEO-visible copy). Prefer locator-based assertions; inspect traces/screenshots in `test-results/` when failures occur.
- When running against a custom URL/port, set `SITE_URL` to keep the base URL in sync.

## Commit & Pull Request Guidelines
- Commits are short and imperative (e.g., `fix robot issue`, `deploy`); split unrelated changes.
- PRs: concise summary, key changes, migrations/env var notes, screenshots for UI (desktop + mobile), and results for `pnpm lint` + tests. Link issues and keep branches rebased on `main`.
- Sensitive values stay in `.env.local`/secrets; never commit them.

## Environment & Ops Notes
- Copy `.env.example` to `.env.local`. Local Postgres via `docker-compose up -d` (port `5433`); point Prisma to that URL.
- Deployments target Vercel with `pnpm prod:build` so `prisma generate`/`migrate deploy` run before `next build`.
