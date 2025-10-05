## A-Line v0 (Personal Edition)

Private, manual life-tracker for one user. Local-first with clean upgrade paths to Supabase, auth, and AI coach later.

### Tech Stack

- Next.js App Router (TypeScript)
- Prisma ORM
- SQLite (local) → ready for Supabase Postgres later
- Zod validation
- TanStack Query
- TailwindCSS
- Recharts
- Vitest + Playwright
- ESLint + Prettier + Husky + lint-staged

### ENV

Create `.env` with:

```
DATABASE_URL="file:./dev.db"
FEATURE_AUTH=0
FEATURE_CLOUD_SYNC=0
FEATURE_AI_COACH=0
ADMIN_EMAIL=
```

### Commands

```
pnpm dev          # run app
pnpm prisma:migrate --name init
pnpm prisma:seed
pnpm test         # unit tests
pnpm e2e          # e2e tests (Playwright)
pnpm lint         # lint
```

### Data Model

See `prisma/schema.prisma`.

### Export/Import

- Export: `/api/export?year=YYYY&month=MM&format=json|csv`
- Import: `POST /api/import` `{ days: [{ date, checks, values, note }] }`

### Migration to Supabase

1) Update `datasource db` in `schema.prisma` to Postgres and change `DATABASE_URL`.
2) Run migrations; keep repository APIs as-is.
# aline
