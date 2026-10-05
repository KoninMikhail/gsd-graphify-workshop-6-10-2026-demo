# Technology Stack

**Analysis Date:** 2026-10-05

## Languages

**Primary:**
- TypeScript 5.9.3 (range `^5.8.3` in every workspace `package.json`) — all application code in `apps/frontend/src`, `apps/backend/src`, and `packages/shared/src`
- Compiler target `ES2022` from `packages/typescript-config/node.json` and `packages/typescript-config/react.json`

**Secondary:**
- HTML — frontend shell `apps/frontend/index.html` (mounts `#root`, loads `apps/frontend/src/main.tsx`)
- CSS — hand-written styles in `apps/frontend/src/styles.css` (no CSS framework, no preprocessor)
- JSON — workspace manifests, `turbo.json`, and shared tsconfig in `packages/typescript-config/`

## Runtime

**Environment:**
- Node.js — required for the Fastify process, Vite, `tsc`, and `tsx`. The repo does not pin a version: no `engines` field, no `.nvmrc`, no `.node-version`
- Backend imports the built-in `node:sqlite` module (`DatabaseSync`) in `apps/backend/src/db.ts` and does not pass `--experimental-sqlite`. Use a Node.js release that ships that module (types are locked to `@types/node` 22.20.5)
- Browser runtime for the board: Vite dev server on port 5173 (`apps/frontend/vite.config.ts`), production bundle from `vite build`
- Both packages are `"type": "module"` (`apps/backend/package.json`, `apps/frontend/package.json`, `packages/shared/package.json`)

**Package Manager:**
- npm 11.13.0 — declared as `packageManager` in the root `package.json`
- Workspaces: `apps/*` and `packages/*` (root `package.json`)
- Lockfile: `package-lock.json` present (lockfileVersion 3)

## Frameworks

**Core:**
- React 19.3.0 (`react` and `react-dom`, range `^19.1.0`) — UI in `apps/frontend`. Entry: `createRoot` in `apps/frontend/src/main.tsx`, JSX runtime `react-jsx`
- Fastify 5.12.5 (range `^5.3.3`) — HTTP API in `apps/backend/src/index.ts`. Listen defaults: `HOST` `0.0.0.0`, `PORT` `3001`
- `@fastify/cors` 11.3.0 (range `^11.0.1`) — registered with `origin: true` in `apps/backend/src/index.ts`
- npm workspaces + Turborepo 2.11.7 (range `^2.5.4`) — task graph in root `package.json` and `turbo.json`

**Testing:**
- Vitest 5.0.3 in `@repo/frontend` (`vitest run`). Root `npm test` is `turbo run test` (`dependsOn: ["^build"]`). Config: `apps/frontend/vitest.config.ts` (`environment: node`, `src/**/*.test.ts`). First suite: `apps/frontend/src/report.test.ts`. Backend and shared still have no test script. `npm run lint` and `npm run typecheck` both run `tsc --noEmit`

**Build/Dev:**
- TypeScript 5.9.3 — `tsc` builds `@repo/shared` and `@repo/backend` to `dist/`; frontend typecheck is `tsc --noEmit` before `vite build`
- Vite 6.4.3 (range `^6.3.5`) — frontend dev server, production bundle, and `vite preview`. Config: `apps/frontend/vite.config.ts`
- `@vitejs/plugin-react` 4.7.0 (range `^4.4.1`) — React plugin in `apps/frontend/vite.config.ts` (Babel JSX transform is a transitive dependency of the plugin, not an app framework)
- `tsx` 4.23.15 (range `^4.19.4`) — backend dev only: `tsx watch src/index.ts` in `apps/backend/package.json`. Production start is `node dist/index.js`
- Shared compiler presets: `packages/typescript-config/base.json` (`strict`), `node.json` (`NodeNext`, `outDir: dist`), `react.json` (`ESNext` + DOM, `noEmit`)

## Key Dependencies

**Critical:**
- `@repo/shared` (`packages/shared`) — workspace contract (`*`). Exports `Task`, `TaskStatus`, `CreateTaskInput`, `UpdateTaskInput`, `ReorderTasksInput`, `TASK_STATUSES` from `packages/shared/src/index.ts`. Package `exports` point at `dist/`
- `node:sqlite` `DatabaseSync` — only database client. Opened in `apps/backend/src/db.ts` against `apps/backend/data/tasks.db`. No ORM and no SQL migration tool
- `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0, `@dnd-kit/utilities` 3.2.2 — drag-and-drop on the board (`apps/frontend/src/components/`)
- Fastify built-in JSON body parsing and Pino logger (`Fastify({ logger: true })` in `apps/backend/src/index.ts`)

**Infrastructure:**
- Node.js built-ins in `apps/backend/src/db.ts`: `node:fs` (`mkdirSync`), `node:path`, `node:url`, `node:crypto` (`randomUUID`), `node:sqlite`
- Vite dev proxy — `/api` → `http://localhost:3001` with the `/api` prefix stripped (`apps/frontend/vite.config.ts`). The browser client uses `API_BASE = "/api"` in `apps/frontend/src/api.ts`
- Turborepo task graph (`turbo.json`): `build` depends on `^build` and caches `dist/**`; `dev` is `cache: false` and `persistent: true`; `lint` and `typecheck` depend on `^build`

## Configuration

**Environment:**
- No `.env`, `.env.example`, or secrets files are committed. `.gitignore` ignores `.env` and `.env.*` (keeps `!.env.example`, but that example file is absent)
- Only two variables are read, both optional, in `apps/backend/src/index.ts`: `PORT` (default `3001`, passed through `Number`) and `HOST` (default `0.0.0.0`)
- SQLite path is hardcoded in `apps/backend/src/db.ts` (`join` of the module directory, `..`, `data`, `tasks.db`). It is not an environment variable. `apps/backend/data/` is gitignored
- Frontend API base is the constant `"/api"` in `apps/frontend/src/api.ts`, not `import.meta.env`

**Build:**
- Root scripts (`package.json`): `npm run dev` | `build` | `lint` | `typecheck` — each is `turbo run <task>`
- `turbo.json` — task definitions above. `@repo/typescript-config` has no scripts and is not a Turbo task
- `apps/frontend/vite.config.ts` — `server.port` 5173 and the `/api` proxy. `preview` does not declare a proxy. Backend does not serve the Vite `dist`
- `apps/frontend/tsconfig.json` extends `@repo/typescript-config/react.json` and adds `types: ["vite/client"]`
- `apps/backend/tsconfig.json` and `packages/shared/tsconfig.json` extend `@repo/typescript-config/node.json` (`outDir` `dist`, `rootDir` `src`)

## Platform Requirements

**Development:**
- Any OS that runs Node.js and npm 11.13.0 (npm workspaces). No Docker, Compose, or external database process
- Install from the repo root: `npm install`. Run: `npm run dev` (Vite on 5173, Fastify on 3001, `tsc --watch` for `@repo/shared`)
- If `PORT` is not 3001, change `server.proxy["/api"].target` in `apps/frontend/vite.config.ts`; the proxy target is a literal `http://localhost:3001`

**Production:**
- No hosting platform, Dockerfile, or process manager is defined in the repo
- Backend production entry: `npm run build` at the root (Turbo builds `@repo/shared` first), then `node dist/index.js` from `apps/backend` (`start` script)
- Frontend production artifact: static files from `vite build` in `apps/frontend`. Nothing in this repo serves that bundle or proxies `/api` outside Vite dev. A deploy must host the static files and point `/api` at the Fastify origin, or change `API_BASE` in `apps/frontend/src/api.ts`

---

*Stack analysis: 2026-10-05*
*Update after major dependency changes*
