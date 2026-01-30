# Production Management System Documentation

## 1. Purpose and Scope
- End-to-end production, inventory, sales, purchasing, and accounting for multi-tenant businesses.
- Provides REST APIs, seeded demo data, and a ready-to-wire React frontend.
- Designed for on-prem or cloud deployment with Postgres + Redis.

## 2. Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand.
- Backend: NestJS 11 (Express), TypeScript, Prisma ORM, BullMQ, cache-manager.
- Data: PostgreSQL 16, Redis 7 (cache/queues), 40+ Prisma models, 100+ demo records.
- Auth: JWT (access + refresh), RBAC with 4 roles and 12 permissions, multi-tenant isolation.

## 3. System Architecture (high level)
- React SPA (http://localhost:8081) calls NestJS APIs (http://localhost:3000).
- NestJS uses Prisma for Postgres, Redis for cache/queues, BullMQ for jobs.
- Multi-tenant enforced in application layer; data rows carry tenantId.
- PWA-ready frontend with service worker and install prompt support.

## 4. Core Capabilities
- Authentication and RBAC: login, register, refresh; roles (Admin, Manager, Supervisor, User); permission guards.
- Tenant Management: create/update tenants; scoped data access per tenant.
- User Management: CRUD users, assign roles/permissions.
- Product Catalog: products, categories, pricing, costs, SKUs.
- Inventory: stock levels for products/raw materials, low-stock alerts, warehouse tracking.
- Sales: sales orders, customers, payment tracking, sales stats.
- Purchases: purchase orders, suppliers, payment tracking, purchase stats.
- Production: production runs, stages, losses/waste tracking, efficiency stats.
- Accounting: chart of accounts, accounting transactions, trial balance, balance sheet, P&L.
- Reporting: sales, purchase, production, inventory, expenses, customers, suppliers, dashboard KPIs.
- Background Work: BullMQ-ready queues with Redis prefix support.

## 5. APIs
- 100+ REST endpoints across 14 modules (auth, users, tenants, roles/permissions, products, product categories, productions, production stages/losses, customers, suppliers, sales, purchases, stock, accounts, accounting transactions/reports, reports).
- Full endpoint catalogue: [server/IMPLEMENTATION_COMPLETE.md](server/IMPLEMENTATION_COMPLETE.md).
- Quick start commands for the backend are in [server/README.md](server/README.md).

## 6. Data Model
- 40+ Prisma models with tenantId scoping, relationships, and indexes.
- Seeded demo data: tenants, users, roles, products, raw materials, customers, suppliers, accounts, transactions.
- Schema reference: [SCHEMA_EXTENDED.md](SCHEMA_EXTENDED.md).

## 7. Environments and Running Locally
- Prereqs: Node 18+, npm, Postgres, Redis (or Docker via docker-compose in server/).
- Backend (from server/):
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```
- Frontend (from repo root):
```bash
npm install
npm run dev
```
- Docker option (from server/):
```bash
docker-compose up -d
```
- Database GUI: `cd server && npx prisma studio` (http://localhost:5555).
- Demo login: Email admin@demo.com (password configured via auth flow), Tenant "Demo Company".

## 8. Authentication and Security
- JWT with RS256 support (public key via JWT_PUBLIC_KEY) and HS256 fallback for dev.
- Access + refresh tokens; issuer validation via JWT_ISSUER.
- Guards for roles/permissions; multi-tenant checks in services.
- Configure secrets in .env (see [server/README.md](server/README.md)).

## 9. Frontend Notes
- Routing and layout ready; uses shadcn/ui and Tailwind; mobile-first and PWA-ready.
- Key components in src/components and pages scaffolded for dashboard/login.
- Connect to backend via `import.meta.env` Vite envs; ensure CORS on backend if domain changes.

## 10. Development Workflow
- Lint/format: `npm run lint` and `npm run format` (frontend); `npm run lint` and `npm run format` (backend from server/).
- Tests: `npm run test` (backend unit), `npm run test:e2e` (backend e2e). Frontend tests can be added via Vitest/Playwright (playwright config present).
- Migrations: `npx prisma migrate dev --name <change>`; regenerate client on schema changes.

## 11. Monitoring and Troubleshooting
- Health: `curl http://localhost:3000/api` for backend; frontend via dev server page.
- Logs: `npm run start:dev` output (backend); `npm run dev` output (frontend); `docker-compose logs -f` for services.
- Common issues: CORS (update main.ts), DB connectivity (check DATABASE_URL), Redis availability for cache/queues.

## 12. Deployment Considerations
- Build frontend: `npm run build` then serve from static host or reverse proxy.
- Backend: `npm run build && npm run start:prod` (server/); set env vars for database, redis, JWT keys, and BullMQ prefix.
- Use HTTPS termination at proxy; set CORS origins; configure RLS in Postgres if desired.

## 13. References
- Overall system status: [STATUS.md](STATUS.md) and [READY_TO_USE.md](READY_TO_USE.md).
- Full system overview: [SYSTEM_COMPLETE.md](SYSTEM_COMPLETE.md).
- Quick actions and onboarding: [START_HERE.md](START_HERE.md).
- Backend guides: [server/README.md](server/README.md), [server/IMPLEMENTATION_COMPLETE.md](server/IMPLEMENTATION_COMPLETE.md).
- Docker setup: [DOCKER_SETUP.md](DOCKER_SETUP.md).
