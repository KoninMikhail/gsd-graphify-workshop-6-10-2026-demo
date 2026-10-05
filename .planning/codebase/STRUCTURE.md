# Codebase Structure

**Analysis Date:** 2026-10-05

## Directory Layout

```
gsd-graphify-workshop/
├── apps/
│   ├── backend/                 # Fastify process (@repo/backend)
│   │   ├── src/                 # index.ts routes, db.ts SQLite
│   │   ├── data/                # Runtime tasks.db (gitignored)
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/                # React + Vite (@repo/frontend)
│       ├── src/                 # Board UI, api client, styles
│       │   └── components/      # Column, sortable wrapper, card
│       ├── index.html           # #root and module entry
│       ├── vite.config.ts       # Port 5173 and /api proxy
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/                  # @repo/shared task contract
│   │   └── src/index.ts
│   └── typescript-config/       # base.json, node.json, react.json
├── docs/                        # Human docs plus Memory Bank
│   ├── _ai/                     # Agent snapshot
│   ├── 00-start/                # Local setup
│   ├── 01-architecture/         # HTTP, SQLite, policies
│   ├── 02-tooling/              # npm, Turbo, graphify
│   ├── 03-reference/            # Routes, entities, domain
│   ├── 04-ops/                  # Observability and runbooks
│   └── adr/                     # ADR slot (index only)
├── .cursor/
│   ├── rules/                   # Agent rules for this repo
│   └── skills/                  # create-adr, create-pr
├── .planning/codebase/          # GSD codebase maps (this file)
├── graphify-out/                # Graph cache markers only
├── package.json                 # Workspaces and root scripts
├── package-lock.json
├── turbo.json
├── AGENTS.md
└── .gitignore
```

## Directory Purposes

**apps/backend/**

- Purpose: HTTP API and the only database
- Contains: TypeScript source, package manifest, tsconfig. Build output `dist/` is gitignored
- Key files: `apps/backend/src/index.ts` (Fastify routes and listen), `apps/backend/src/db.ts` (SQLite), `apps/backend/package.json`
- Subdirectories: `src/` (two modules, no nested folders), `data/` (created at startup, gitignored)

**apps/frontend/**

- Purpose: Single-page kanban board
- Contains: React source, global CSS, Vite config, HTML shell
- Key files: `apps/frontend/index.html`, `apps/frontend/src/main.tsx`, `apps/frontend/src/App.tsx`, `apps/frontend/src/api.ts`, `apps/frontend/vite.config.ts`
- Subdirectories: `src/components/` (three components, flat)

**packages/shared/**

- Purpose: Types and constants imported as `@repo/shared`
- Contains: One source module. `package.json` `exports` points at `dist/index.js` and `dist/index.d.ts`
- Key files: `packages/shared/src/index.ts`, `packages/shared/package.json`, `packages/shared/tsconfig.json`
- Subdirectories: `src/` only (plus generated `dist/`)

**packages/typescript-config/**

- Purpose: Shared `tsc` presets. No runtime code
- Contains: JSON configs listed in `files`
- Key files: `packages/typescript-config/base.json`, `node.json`, `react.json`, `package.json`
- Subdirectories: None

**docs/**

- Purpose: Human documentation. Numbered areas `00`–`04`, plus `adr/`
- Contains: Markdown. Map is `docs/README.md`. Placement rule is `.cursor/rules/docs-structure.mdc`
- Key files: `docs/README.md`, `docs/03-reference/routes-catalog.md`, `docs/01-architecture/persistence-and-database.md`
- Subdirectories: `_ai/`, `00-start/`, `01-architecture/`, `02-tooling/`, `03-reference/` (includes `domains/`), `04-ops/runbooks/`, `adr/`

**docs/_ai/**

- Purpose: Memory Bank for agents. Compressed snapshot, not a second copy of the guides
- Contains: Fixed reading set
- Key files: `docs/_ai/README.md`, `architecture.md`, `codebase-map.md`, `data-flow.md`, `tech-stack.md`
- Subdirectories: None

**.cursor/**

- Purpose: Cursor rules and two project skills
- Contains: `.mdc` rules and `SKILL.md` files
- Key files: `.cursor/rules/memory-bank.mdc`, `.cursor/rules/graphify.mdc`, `.cursor/skills/create-adr/SKILL.md`, `.cursor/skills/create-pr/SKILL.md`
- Subdirectories: `rules/` (includes `rules/roles/`), `skills/create-adr/`, `skills/create-pr/`

**.planning/codebase/**

- Purpose: GSD maps consumed by later planning commands
- Contains: Analysis markdown produced by codebase mapping
- Key files: `ARCHITECTURE.md`, `STRUCTURE.md`
- Subdirectories: None

## Key File Locations

**Entry Points:**

- `apps/frontend/index.html`: HTML shell and `/src/main.tsx`
- `apps/frontend/src/main.tsx`: `createRoot` on `#root`
- `apps/frontend/src/App.tsx`: Board state, drag-and-drop, create, delete, reset
- `apps/backend/src/index.ts`: Fastify process, routes, `listen`
- `package.json`: Root scripts `dev`, `build`, `lint`, `typecheck` via Turbo
- `turbo.json`: Task graph. `build`, `lint`, and `typecheck` depend on `^build`

**Configuration:**

- `package.json`: npm workspaces `apps/*` and `packages/*`, `packageManager` npm
- `apps/frontend/package.json`: `@repo/frontend` scripts and React, Vite, dnd-kit dependencies
- `apps/backend/package.json`: `@repo/backend` scripts (`dev` is `tsx watch`, `start` is `node dist/index.js`)
- `packages/shared/package.json`: `exports` to `dist/`
- `apps/frontend/vite.config.ts`: Port `5173`, proxy `/api` → `http://localhost:3001` with prefix rewrite
- `apps/frontend/tsconfig.json`: Extends `@repo/typescript-config/react.json`
- `apps/backend/tsconfig.json`: Extends `@repo/typescript-config/node.json`, `outDir` `dist`, `rootDir` `src`
- `packages/shared/tsconfig.json`: Same node preset and `outDir` as the backend
- `packages/typescript-config/base.json`: `strict`, declarations, source maps
- `.gitignore`: Ignores `node_modules`, `dist`, `.turbo`, `.env`, `.env.*` (keeps `.env.example` if added), `coverage`, `*.db`, `apps/backend/data/`
- Runtime env: only `PORT` and `HOST`, read in `apps/backend/src/index.ts`. No `.env` or `.env.example` is in the tree

**Core Logic:**

- `apps/backend/src/db.ts`: Schema, CRUD, reorder transaction, seed, reset, row mapping
- `apps/backend/src/index.ts`: Route table for `/health` and `/tasks`
- `apps/frontend/src/api.ts`: `fetch` wrapper and task methods, including `updateTask` (no board caller)
- `packages/shared/src/index.ts`: `Task`, status union, inputs, `COLUMN_LABELS`, `WORKSHOP_NAME`
- `apps/frontend/src/components/Column.tsx`: Droppable column and sortable list
- `apps/frontend/src/components/SortableTask.tsx`: `useSortable` wrapper
- `apps/frontend/src/components/TaskCard.tsx`: Card markup and Delete
- `apps/frontend/src/styles.css`: Board styles

**Testing:**

- Frontend tests live next to source: `apps/frontend/src/report.test.ts`. Root script `npm test` runs `turbo run test`. Backend and shared still have no tests
- `lint` in each workspace is `tsc --noEmit` (frontend build also typechecks before `vite build`)

**Documentation:**

- `docs/README.md`: Index of human docs and the Memory Bank
- `docs/_ai/`: Agent reading order
- `docs/03-reference/routes-catalog.md`: Method, path, status codes
- `docs/03-reference/services-catalog.md`: Exports of `db.ts`
- `docs/03-reference/domains/tasks.md`: Task domain
- `docs/adr/README.md`: ADR index. No decision files yet
- `AGENTS.md`: Turborepo agent guidance block at the repo root

## Naming Conventions

**Files:**

- PascalCase `.tsx` for React components: `App.tsx`, `Column.tsx`, `SortableTask.tsx`, `TaskCard.tsx`
- camelCase `.ts` for non-component modules: `api.ts`, `db.ts`, `main.tsx` is the exception used as the Vite entry name
- `index.ts` is the package or process entry (`apps/backend/src/index.ts`, `packages/shared/src/index.ts`), not a barrel that re-exports a folder of modules
- kebab-case for docs, rules, and skills: `persistence-and-database.md`, `create-adr`
- Workspace `package.json` `name` is `@repo/<folder>`: `@repo/frontend`, `@repo/backend`, `@repo/shared`, `@repo/typescript-config`
- Backend source imports local files with a `.js` suffix (`./db.js`) because packages are `"type": "module"` and the node tsconfig uses `NodeNext`

**Directories:**

- kebab-case or a single role word: `apps`, `packages`, `components`, `docs`
- Numbered doc areas: `00-start` through `04-ops`
- Plural collection names: `apps/`, `packages/`, `components/`, `rules/`, `skills/`, `runbooks/`
- One feature folder is not used. Frontend components sit flat in `apps/frontend/src/components/`

**Special Patterns:**

- Shared types stay in `packages/shared/src/index.ts`. Do not copy `Task` into an app
- Props types are local to the component file (`ColumnProps`, `SortableTaskProps`, `TaskCardProps`), not exported
- Persistence helpers that are not part of the API stay unexported: `mapRow`, `assertStatus`, `nextPosition`, `seedDemoTasks`
- ADR files, when added, are `docs/adr/<nnn>-<kebab-slug>.md` (see `.cursor/skills/create-adr/SKILL.md`)
- Graph outputs do not go under `apps/**/src` or `packages/**/src`

## Where to Add New Code

**New task field or status (contract change):**

- Types and constants: `packages/shared/src/index.ts`
- Rebuild `@repo/shared` before typecheck of the apps (`turbo` already depends on `^build`)
- Column mapping and SQL: `apps/backend/src/db.ts` (`TaskRow`, `mapRow`, `CREATE TABLE` — there is no migration tool, so an existing local `tasks.db` will not alter itself)
- Client payload types flow through `apps/frontend/src/api.ts` automatically if they stay on the shared types

**New HTTP route:**

- Handler: `apps/backend/src/index.ts`. Register a literal path such as `/tasks/<action>` before `GET /tasks/:id`
- Query or write: a new exported function in `apps/backend/src/db.ts`
- Client: a named function next to the others in `apps/frontend/src/api.ts`, using the private `request` helper
- Tests: frontend Vitest suite is `apps/frontend/src/*.test.ts`. Add a test in that pattern when a phase asks for one. Backend still has no runner

**New board interaction:**

- State and API calls: `apps/frontend/src/App.tsx`
- Visual piece: `apps/frontend/src/components/<PascalName>.tsx`, exported as a named function, imported by `App` or by `Column`
- Styles: `apps/frontend/src/styles.css` (one global sheet, no CSS modules)

**New React screen or route:**

- There is no router. A second view still mounts from `apps/frontend/src/main.tsx` / `App.tsx`. Add a router only when a phase requires more than one URL

**New workspace package:**

- App: `apps/<name>/` with `package.json` name `@repo/<name>` so the root `workspaces` glob `apps/*` picks it up
- Library: `packages/<name>/` the same way
- TypeScript: extend `packages/typescript-config/node.json` or `react.json`. Add a `build` script if another package imports emitted JS

**Utilities:**

- Backend-only helpers: private functions in `apps/backend/src/db.ts`, or a new file under `apps/backend/src/` imported from `index.ts` or `db.ts`
- Frontend-only helpers used by the board: colocate in `apps/frontend/src/` (the board helpers `groupByStatus`, `flattenBoard`, and `findContainer` live in `App.tsx`)
- Cross-app helpers: only types and constants, in `packages/shared/src/index.ts`. Do not put React or Fastify code in `packages/shared`

**Documentation:**

- Agent-facing snapshot: update the matching file in `docs/_ai/` when behavior changes
- Human guide: `docs/00-start/` through `docs/04-ops/` as mapped in `docs/README.md`
- Decision with alternatives: `docs/adr/<nnn>-<kebab-slug>.md` and a row in `docs/adr/README.md`

## Special Directories

**apps/backend/data/**

- Purpose: SQLite file `tasks.db` and WAL sidecars
- Source: Created by `mkdirSync` in `apps/backend/src/db.ts` on process start. Path is next to the package, not configured by env
- Committed: No. `.gitignore` lists `apps/backend/data/` and `*.db`

**dist/ and .turbo/**

- Purpose: `tsc` / Vite output and Turborepo logs
- Source: `turbo run build` and package `build` scripts. Frontend `dist/` is Vite. Backend and shared `dist/` are `tsc`
- Committed: No (`.gitignore`: `dist`, `.turbo`)

**node_modules/**

- Purpose: Installed dependencies. Hoisted by npm workspaces
- Source: `npm install` from the repo root
- Committed: No

**graphify-out/**

- Purpose: Knowledge-graph output directory described in `docs/02-tooling/graphify.md` and `.cursor/rules/graphify.mdc`
- Source: External `graphify` tooling. The tree currently has `.graphify_python`, `.graphify_root`, and `cache/` only. `graphify-out/graph.json` is not present, so graph query is not available
- Committed: Not listed in `.gitignore`. Do not write graph files under `src/`

**.env / .env.***

- Purpose: Ignored local environment files
- Source: Not present in the repo. `.gitignore` ignores `.env` and `.env.*` and un-ignores `.env.example`
- Committed: No, except a future `.env.example`

**docs/adr/**

- Purpose: Architecture decision records
- Source: Hand-written. `docs/adr/README.md` states there are no records yet
- Committed: Yes (the index)

**docs/04-ops/runbooks/**

- Purpose: Operational runbooks
- Source: `docs/04-ops/runbooks/README.md` only
- Committed: Yes

---

*Structure analysis: 2026-10-05*
*Update when directory structure changes*
