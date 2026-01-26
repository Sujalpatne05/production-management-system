## Backend (NestJS + Prisma) for Production Management

This service provides the API layer with multi-tenant RBAC (super-admin -> admin -> user), Postgres via Prisma, Redis caching, and BullMQ for background jobs.

### Stack
- NestJS 11 (Fastify-ready) with ConfigModule, Passport JWT
- Prisma (Postgres provider)
- Redis cache (cache-manager) and BullMQ queues
- Auth via JWT (Keycloak-compatible), role/permission guards

### Prerequisites
- Node 18+ and npm
- Postgres database (DATABASE_URL)
- Redis (REDIS_URL) for cache/queues

### Setup
1) Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` (Postgres connection string)
   - `REDIS_URL` (e.g., redis://localhost:6379)
   - `JWT_PUBLIC_KEY` (Keycloak realm public key, PEM; uses `dev-secret` fallback if not set)
   - `JWT_ISSUER` (Keycloak issuer URL)
2) Install deps:
   - `npm install` (from `server/`)
3) Generate client & migrate:
   - `npm run prisma:generate`
   - `npm run prisma:migrate` (creates schema)
4) Seed base roles/permissions:
   - `npm run prisma:seed`

### Running
- Dev: `npm run start:dev`
- Prod build: `npm run build` then `npm run start:prod`

### Testing & linting
- Unit: `npm run test`
- E2E: `npm run test:e2e`
- Lint: `npm run lint`

### Notes
- JWT strategy accepts RS256 with `JWT_PUBLIC_KEY`; falls back to HS256 with `dev-secret` for local use only.
- RLS is enforced at the app layer; DB rows are tenant-scoped (`tenantId` on domain tables). Add Postgres RLS policies in your DB when ready.
- Default BullMQ queue: `default`, prefix from `BULLMQ_PREFIX`.
