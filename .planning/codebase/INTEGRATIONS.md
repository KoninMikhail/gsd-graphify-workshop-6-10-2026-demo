# External Integrations

**Analysis Date:** 2026-10-05

## APIs & External Services

**Payment Processing:**
- None

**Email/SMS:**
- None

**External APIs:**
- Google Fonts — page fonts only, loaded by the browser from `apps/frontend/index.html`
  - Integration method: `<link>` stylesheets, not an SDK. Preconnect to `https://fonts.googleapis.com` and `https://fonts.gstatic.com`. CSS URL requests Fraunces (`opsz`, weights 600 and 700) and Manrope (weights 400, 500, 600, 700)
  - Auth: none
  - Rate limits: not configured in this repo
  - Application code does not call Google. Task CRUD does not depend on the stylesheet
- No other outbound HTTP client. Backend source (`apps/backend/src`) does not use `fetch`, axios, or a third-party SDK. Frontend `fetch` in `apps/frontend/src/api.ts` targets the same-origin path `/api` only

**In-repo HTTP hop (not a third-party service):**
- Vite dev proxy — browser to Fastify during `npm run dev`
  - Config: `apps/frontend/vite.config.ts` (`server.proxy["/api"]`)
  - Target: `http://localhost:3001` (literal; not an env var)
  - `changeOrigin: true`; rewrite strips the leading `/api` (`path.replace(/^\/api/, "")`)
  - Client base: `API_BASE = "/api"` in `apps/frontend/src/api.ts`
  - `vite preview` does not set this proxy. Fastify routes are unprefixed (`/tasks`, `/health` in `apps/backend/src/index.ts`)

## Data Storage

**Databases:**
- SQLite file on the local filesystem — the only data store
  - Connection: path built in `apps/backend/src/db.ts` as `join(dirname(fileURLToPath(import.meta.url)), "..", "data", "tasks.db")`. From source that is `apps/backend/data/tasks.db`. No `DATABASE_URL`
  - Client: Node.js built-in `node:sqlite`, class `DatabaseSync`. No ORM
  - On open: `PRAGMA journal_mode = WAL` and `PRAGMA foreign_keys = ON` (the `tasks` table has no foreign keys)
  - Schema: `CREATE TABLE IF NOT EXISTS tasks` in `apps/backend/src/db.ts`. No migrations directory and no migration CLI
  - Directory `apps/backend/data/` is gitignored (WAL/SHM files can appear beside `tasks.db`)
  - Empty database is seeded with three demo tasks (`seedIfEmpty`). `POST /tasks/reset` deletes rows and reseeds (`resetToDemo`)

**File Storage:**
- Local filesystem only. The SQLite file above is the only persisted artifact. No object storage SDK

**Caching:**
- None. No Redis or other cache client. Task reads hit SQLite on each request (`listTasks` / `getTask` in `apps/backend/src/db.ts`)

## Authentication & Identity

**Auth Provider:**
- None. Routes in `apps/backend/src/index.ts` have no session, JWT, API key, or user model
- CORS: `@fastify/cors` with `origin: true` (reflects the request origin). That is browser cross-origin policy, not authentication
- Token storage: not applicable
- Session management: not applicable

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry or equivalent DSN

**Analytics:**
- None

**Logs:**
- Fastify's default logger (Pino) to stdout
  - Enabled with `Fastify({ logger: true })` in `apps/backend/src/index.ts`
  - Listen failure: `app.log.error(error)` then `process.exit(1)`
  - No log-level env var, no log shipper, no metrics, no traces
  - `GET /health` returns `{ ok: true }` and does not check the database

## CI/CD & Deployment

**Hosting:**
- None configured. No Dockerfile, Compose file, serverless config, or platform manifest
- Local processes only: Vite (`apps/frontend`, port 5173) and Fastify (`apps/backend`, `HOST`:`PORT`, default `0.0.0.0:3001`)
- Production-shaped commands that exist in package scripts, with no deployer attached:
  - Root `npm run build` → Turbo `build` (`turbo.json`, `dependsOn: ["^build"]`, outputs `dist/**`)
  - `@repo/backend` `start`: `node dist/index.js`
  - `@repo/frontend` `build`: `tsc --noEmit && vite build` (static output; backend does not serve it)

**CI Pipeline:**
- None. No `.github/workflows`, `.gitlab-ci.yml`, `Jenkinsfile`, or other CI config
- Checks available locally: `npm run typecheck` and `npm run lint` (both `tsc --noEmit` after `^build`). No test job

## Environment Configuration

**Development:**
- Required env vars: none
- Optional env vars (read only in `apps/backend/src/index.ts`): `PORT` (default `3001`), `HOST` (default `0.0.0.0`)
- Secrets location: no secrets are read. `.gitignore` ignores `.env` and `.env.*` and would keep `.env.example`, but no env file is in the repo
- Mock/stub services: none. Demo data is inserted into the local SQLite file when the `tasks` table is empty

**Staging:**
- Not defined. No staging host, database, or env split

**Production:**
- Secrets management: not applicable (no third-party credentials)
- Failover/redundancy: not configured. One SQLite file on the machine that runs the backend process

## Webhooks & Callbacks

**Incoming:**
- None. No webhook routes. HTTP surface is the task API and `GET /health` in `apps/backend/src/index.ts`

**Outgoing:**
- None

---

*Integration audit: 2026-10-05*
*Update when adding/removing external services*
