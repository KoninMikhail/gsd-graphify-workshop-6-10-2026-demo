# Architecture

**Analysis Date:** 2026-10-05

## Pattern Overview

**Overall:** npm-workspace monolith with two processes and a shared type package

**Key Characteristics:**

- One repository, four workspaces: `@repo/frontend`, `@repo/backend`, `@repo/shared`, `@repo/typescript-config`
- Dependency direction is one-way: `apps/frontend` and `apps/backend` both depend on `@repo/shared`. The apps do not import each other. `@repo/typescript-config` is compiler JSON only
- No controller / service / repository split. HTTP handlers live in one Fastify module. Persistence is exported functions over a module-level `DatabaseSync`
- Dev traffic is browser → Vite (`5173`) → proxy `/api` (prefix stripped) → Fastify (`3001`) → SQLite file
- Board state is React `useState` in one component. The server is the source of truth after each mutation
- No authentication, OpenAPI document, job queue, scheduler, WebSocket, or migration tool

## Layers

**UI layer:**

- Purpose: Render the three-column board, own drag-and-drop, and call the HTTP client
- Contains: Root mount, board state, column and card components, CSS
- Location: `apps/frontend/src/main.tsx`, `apps/frontend/src/App.tsx`, `apps/frontend/src/components/`, `apps/frontend/src/styles.css`, `apps/frontend/index.html`
- Depends on: `@repo/shared` types and labels, `apps/frontend/src/api.ts`, `@dnd-kit/core` and `@dnd-kit/sortable`
- Used by: Vite dev server and the production bundle entry (`apps/frontend/index.html` loads `/src/main.tsx`)

**HTTP client layer:**

- Purpose: `fetch` the task API under the `/api` prefix and turn non-OK responses into `Error`
- Contains: One generic `request` helper and named task functions
- Location: `apps/frontend/src/api.ts`
- Depends on: `@repo/shared` input and entity types. The base path is the constant `API_BASE = "/api"`, not an environment variable
- Used by: `apps/frontend/src/App.tsx`

**HTTP route layer:**

- Purpose: Register CORS, map paths to persistence functions, set status codes
- Contains: Fastify app, route handlers, listen bootstrap
- Location: `apps/backend/src/index.ts`
- Depends on: `apps/backend/src/db.ts` and `@repo/shared` body types
- Used by: Process entry (`tsx watch src/index.ts` in dev, `node dist/index.js` via `start`)

**Persistence layer:**

- Purpose: Open SQLite, create the `tasks` table, map rows to `Task`, and run CRUD, reorder, seed, and reset
- Contains: Module-level `DatabaseSync`, row mapper, status guard, exported functions
- Location: `apps/backend/src/db.ts`
- Depends on: `node:sqlite`, `node:fs`, `node:crypto`, `@repo/shared` (`Task`, `TaskStatus`, `TASK_STATUSES`, input types)
- Used by: `apps/backend/src/index.ts` only

**Shared contract:**

- Purpose: Types and constants both processes compile against
- Contains: Status union, `Task`, create/update/reorder inputs, column labels, workshop name
- Location: `packages/shared/src/index.ts` (published surface is `packages/shared/dist/` via `package.json` `exports`)
- Depends on: Nothing in the repo
- Used by: `apps/frontend` and `apps/backend`

**Compiler config (not a runtime layer):**

- Purpose: Shared `tsc` options
- Location: `packages/typescript-config/base.json`, `node.json`, `react.json`
- Depends on: Nothing
- Used by: `apps/frontend/tsconfig.json`, `apps/backend/tsconfig.json`, `packages/shared/tsconfig.json`

## Data Flow

**Load the board (dev):**

1. `apps/frontend/index.html` mounts `#root`. `apps/frontend/src/main.tsx` renders `App` in `StrictMode`.
2. `App` `useEffect` calls `fetchTasks()` in `apps/frontend/src/api.ts`.
3. `fetch("/api/tasks")` hits the Vite proxy in `apps/frontend/vite.config.ts`. The proxy rewrites `/api/tasks` to `/tasks` on `http://localhost:3001`.
4. `GET /tasks` in `apps/backend/src/index.ts` returns `listTasks()`.
5. `listTasks` reads `apps/backend/data/tasks.db` and orders rows by status (`todo`, `in_progress`, `done`), then `position`, then `created_at`.
6. `mapRow` renames `created_at` / `updated_at` to `createdAt` / `updatedAt`.
7. `App` stores the array in `tasks`. `groupByStatus` derives the three columns.

**Create a task:**

1. The composer form in `App` calls `createTask({ title })`.
2. `POST /tasks` passes the body to `createTask` in `db.ts`. Empty body becomes `{ title: "" }`.
3. `createTask` trims the title, defaults status to `todo`, assigns `randomUUID()` and the next `position` in that column, and inserts the row.
4. The route responds `201` with the `Task`. `App` appends it to local state. The UI does not insert a card before the response.

**Delete a task:**

1. `TaskCard` calls `onDelete`. `App` removes the card immediately, then calls `deleteTask`.
2. `DELETE /tasks/:id` returns `204` with an empty body when `changes > 0`, otherwise `404`.
3. `api.ts` treats `204` as `undefined` and does not parse JSON.
4. On failure, `App` restores the previous array.

**Drag and drop:**

1. `DndContext` in `App` uses `PointerSensor` (6px activation) and `closestCorners`.
2. `Column` is a droppable whose id is the status. `SortableTask` wraps `TaskCard` with `useSortable`.
3. `onDragOver` moves a card across columns in local state only (same-column reorder waits for `dragEnd`).
4. `onDragEnd` rewrites `position` from `0` inside each column via `flattenBoard`, then `PUT /tasks/reorder`.
5. `reorderTasks` runs `BEGIN`, updates each row's `status`, `position`, and `updated_at`, then `COMMIT`. Any thrown error runs `ROLLBACK` and the route returns `400`.
6. A successful body replaces local `tasks`. A failed request refetches `GET /tasks`.

**Reset demo data:**

1. The Reset demo button calls `POST /tasks/reset`.
2. `resetToDemo` deletes every row and inserts the three `DEMO_TASKS` in `db.ts`.
3. The returned list replaces board state.

**Backend startup:**

1. Loading `apps/backend/src/index.ts` imports `db.ts`.
2. Import side effects create `apps/backend/data/` if needed, open `tasks.db`, set `PRAGMA journal_mode = WAL` and `PRAGMA foreign_keys = ON`, and run `CREATE TABLE IF NOT EXISTS tasks`.
3. `seedIfEmpty()` runs before `listen`. A non-empty table is left unchanged. An empty table gets the three demo tasks.
4. `listen` uses `PORT` (default `3001`) and `HOST` (default `0.0.0.0`).

**State Management:**

- Server state is one SQLite file, `apps/backend/data/tasks.db`. The connection is a module singleton in `db.ts`. `DatabaseSync` calls are synchronous on the Node event loop.
- Client state is `useState` in `App`: `tasks`, composer `title`, `loading`, `error`, `activeId`, `saving`. Columns are derived with `useMemo`, not stored.
- There is no client cache library, router, or global store. `updateTask` exists in `api.ts` and `PATCH /tasks/:id` exists on the server. The board UI does not call them.

## Key Abstractions

**Task:**

- Purpose: The only domain entity. Identity, title, description, column, order, timestamps
- Examples: `Task`, `CreateTaskInput`, `UpdateTaskInput`, `ReorderTasksInput` in `packages/shared/src/index.ts`; SQLite row type `TaskRow` is private to `apps/backend/src/db.ts`
- Pattern: Shared TypeScript type plus a snake_case row mapped at the persistence boundary (`mapRow`). Status values are the const array `TASK_STATUSES`: `todo`, `in_progress`, `done`. Column titles are `COLUMN_LABELS`

**Route handler:**

- Purpose: HTTP adapter. Validate the small cases the persistence layer does not, and set status codes
- Examples: Handlers in `apps/backend/src/index.ts`
- Pattern: Inline async functions on one Fastify instance. Static paths `/tasks/reset` and `/tasks/reorder` are registered before `/tasks/:id`. No Fastify `schema`, no plugins beyond CORS, no `setErrorHandler`

**Persistence function:**

- Purpose: One operation against the `tasks` table
- Examples: `listTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`, `reorderTasks`, `seedIfEmpty`, `resetToDemo` in `apps/backend/src/db.ts`
- Pattern: Named exports over a module-level database. Missing rows return `undefined` or `false`. Invalid title or status throws `Error`. Reorder is the only explicit transaction

**Board view-model:**

- Purpose: Turn a flat `Task[]` into three columns and back
- Examples: `groupByStatus`, `flattenBoard`, `findContainer` in `apps/frontend/src/App.tsx`
- Pattern: Pure functions local to the board component. `flattenBoard` assigns `position` from the array index so the client and `reorderTasks` share one ordering rule

**Presentational card stack:**

- Purpose: Draw one column and one card without fetching
- Examples: `apps/frontend/src/components/Column.tsx`, `SortableTask.tsx`, `TaskCard.tsx`
- Pattern: Props in, callbacks out. `Column` owns droppable and sortable context. `SortableTask` owns drag transforms. `TaskCard` owns title, description, drag handle, and Delete. `App` owns data and mutations

## Entry Points

**Frontend HTML:**

- Location: `apps/frontend/index.html`
- Triggers: Vite (`apps/frontend` script `dev` / `build` / `preview`)
- Responsibilities: Document shell, `#root`, module script `/src/main.tsx`

**Frontend runtime:**

- Location: `apps/frontend/src/main.tsx`
- Triggers: Browser loads the module
- Responsibilities: Fail if `#root` is missing, `createRoot`, render `App` in `StrictMode`, import `styles.css`

**Backend process:**

- Location: `apps/backend/src/index.ts`
- Triggers: `npm run dev` from the repo root (`turbo run dev` → `tsx watch src/index.ts`), or `npm start` in `apps/backend` after `tsc` emits `apps/backend/dist/index.js`
- Responsibilities: Seed, construct Fastify, register CORS and routes, listen, exit `1` if listen fails

**Shared package build:**

- Location: `packages/shared/src/index.ts` compiled to `packages/shared/dist/`
- Triggers: `turbo` task `build` with `dependsOn: ["^build"]` in `turbo.json`. `typecheck` and `lint` also depend on `^build`
- Responsibilities: Emit `dist/index.js` and `dist/index.d.ts`. Consumers resolve `@repo/shared` through `exports`, not through `src/`

**Repo scripts:**

- Location: root `package.json`
- Triggers: `npm run dev | build | lint | typecheck`
- Responsibilities: Delegate to Turborepo across `apps/*` and `packages/*`

## Error Handling

**Strategy:** Each mutating route catches exceptions and returns JSON `{ error: string }`. Missing rows are return values, not exceptions. There is no global Fastify error handler. The client throws `Error` and `App` shows the message in a banner.

**Patterns:**

- `POST /tasks`, `PATCH /tasks/:id`, and `PUT /tasks/reorder` use `try/catch`. `Error.message` becomes the `error` field with status `400`. A non-`Error` throw becomes `"Invalid task"` or `"Invalid reorder payload"`
- Empty reorder `items` is rejected in the route before persistence: `400` and `"items array is required"`
- `GET /tasks/:id` and `DELETE /tasks/:id` answer `404` `{ error: "Task not found" }` when `getTask` is missing or `deleteTask` returns `false`
- A missing id inside `reorderTasks` throws `Task not found: <id>`. That path is `400`, not `404`, and the transaction rolls back
- `createTask` and `updateTask` throw `Title is required` or `Invalid status: <value>`
- `GET /health`, `GET /tasks`, and `POST /tasks/reset` have no local `try/catch`
- `api.ts` reads `error`, then `message`, from a failed JSON body. Non-JSON failures become `Request failed (<status>)`. Status `204` skips JSON parsing
- `App` maps thrown errors to `setError`. Delete restores the previous list. Reorder failure refetches `GET /tasks`
- Listen failure: `app.log.error` then `process.exit(1)` in `apps/backend/src/index.ts`

## Cross-Cutting Concerns

**Logging:**

- Fastify is constructed with `logger: true` in `apps/backend/src/index.ts`. That is the only server logger
- The UI has no log framework. Loading, saving, and errors are paragraphs in `App` (`.banner`)

**Validation:**

- TypeScript types in `packages/shared` are compile-time only. Routes do not register Fastify schemas
- Runtime checks live in `apps/backend/src/db.ts`: trimmed non-empty title, status must be in `TASK_STATUSES`, reorder items must already exist
- The reorder route adds one check the database function does not: `items` must be a non-empty array
- SQLite `CHECK (status IN ('todo', 'in_progress', 'done'))` is a second guard on the column
- The composer in `App` refuses a blank title before `POST`. The server still enforces the same rule

**Authentication:**

- None. No session, token, or user model
- `@fastify/cors` is registered with `{ origin: true }` in `apps/backend/src/index.ts`, which reflects the request `Origin`
- In dev the browser talks to Vite on port `5173`. The proxy in `apps/frontend/vite.config.ts` is what reaches Fastify, so that path does not depend on browser CORS. `preview` has no proxy. The backend does not serve the frontend build

**Other boundaries:**

- Environment reads are only `PORT` and `HOST` in `apps/backend/src/index.ts`. The database path is derived from `import.meta.url` (`../data/tasks.db` relative to the compiled or source module), not from the environment
- `PRAGMA foreign_keys = ON` is set, and the `tasks` table has no foreign keys
- Keep new task fields on `Task` in `packages/shared/src/index.ts`, map them in `mapRow`, and thread them through `api.ts`. Do not duplicate the entity type inside either app
- Register literal task paths before `/tasks/:id`
- Do not add a service class for a single new query. Add an exported function in `apps/backend/src/db.ts` and call it from `apps/backend/src/index.ts`

---

*Architecture analysis: 2026-10-05*
*Update when major patterns change*
