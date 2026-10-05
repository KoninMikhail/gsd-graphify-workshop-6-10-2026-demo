# Testing Patterns

**Analysis Date:** 2026-10-05

## Test Framework

**Runner:**
- Vitest 5.0.3 in `@repo/frontend`. Config: `apps/frontend/vitest.config.ts` (`environment: node`, include `src/**/*.test.ts`)
- Root script `test` is `turbo run test`. Only the frontend workspace defines `test` (`vitest run`)
- Backend and `@repo/shared` still have no test script. No Playwright or Cypress

**Assertion Library:**
- Vitest `expect` / `describe` / `it` in `apps/frontend/src/report.test.ts`

**Run Commands:**
```bash
npm run typecheck          # tsc --noEmit in each workspace that defines the script
npm run lint               # same tsc --noEmit; not a linter
npm run build              # turbo build: shared + backend emit dist, frontend vite build
npm run dev                # manual board check at http://localhost:5173
npm test                   # turbo run test; frontend vitest run
```

Do not add a watch or coverage script unless a phase asks for one.

`typecheck` and `lint` are wired in `turbo.json` with `dependsOn: ["^build"]`. From the repo root, Turbo builds `@repo/shared` before typechecking `@repo/backend` and `@repo/frontend`, because those packages import `@repo/shared` from `packages/shared/dist` (`packages/shared/package.json` `exports`).

Per-package equivalents, if a single workspace must be checked after shared is already built:

```bash
npm run typecheck -w @repo/shared
npm run typecheck -w @repo/backend
npm run typecheck -w @repo/frontend
npm run build -w @repo/frontend
```

## Test File Organization

**Location:**
- `apps/frontend/src/report.test.ts` covers `buildTaskReport`. No other `*.test.*` / `*.spec.*` yet
- No `tests/`, `__tests__/`, `e2e/`, or `apps/*/test` directory
- Source under test, when tests are added later, is:
  - `apps/backend/src/db.ts` — SQLite CRUD, seed, reorder
  - `apps/backend/src/index.ts` — Fastify routes
  - `apps/frontend/src/api.ts` — `fetch` client
  - `apps/frontend/src/App.tsx` — board state and drag handlers
  - `packages/shared/src/index.ts` — types and constants only (nothing to execute)

**Naming:**
- Not established. No unit, integration, or e2e filename suffix exists

**Structure:**
```
apps/backend/src/
  index.ts          # Fastify routes, no accompanying test
  db.ts             # sqlite access, no accompanying test
apps/frontend/src/
  App.tsx
  api.ts
  main.tsx
  components/
    Column.tsx
    SortableTask.tsx
    TaskCard.tsx
packages/shared/src/
  index.ts
```

## Test Structure

**Suite Organization:**
- Not detected. There is no `describe` / `it` / `test` block to copy

**Patterns:**
- Setup and teardown hooks are not used
- The only automated check is the TypeScript compiler (`strict: true` in `packages/typescript-config/base.json`)
- Manual check after a behavior change: `npm run dev`, open `http://localhost:5173`, and confirm `GET http://localhost:3001/health` returns `{ ok: true }`
- Backend routes have no `/api` prefix. The Vite dev server strips `/api` in `apps/frontend/vite.config.ts` (`rewrite` removes the prefix, proxy target `http://localhost:3001`). Hit the API directly on port 3001 when checking with curl

## Mocking

**Framework:**
- Not detected. No `vi.mock`, `jest.mock`, `sinon`, or `msw`

**Patterns:**
- No mock example exists in the repo. Do not add a mocking helper until a runner is introduced

**What to Mock:**
- Not established

**What NOT to Mock:**
- Not established
- Current code talks to real boundaries with no seam for injection:
  - `apps/backend/src/db.ts` opens `DatabaseSync` at module load (`const db = new DatabaseSync(dbPath)`) and creates `apps/backend/data/tasks.db` (directory is gitignored)
  - `apps/backend/src/index.ts` calls `seedIfEmpty()` at import time and `app.listen` at top level
  - `apps/frontend/src/api.ts` calls global `fetch` against `const API_BASE = "/api"`

## Fixtures and Factories

**Test Data:**
- No `tests/fixtures` and no factory helpers
- The only canned data is production seed data in `apps/backend/src/db.ts`:

```typescript
const DEMO_TASKS: CreateTaskInput[] = [
  { title: "Sketch the board layout", status: "todo" },
  { title: "Wire Fastify routes", status: "in_progress" },
  { title: "Demo drag and drop", status: "done" },
];
```

`seedIfEmpty()` inserts those rows when `COUNT(*)` is 0. `resetToDemo()` deletes every row, then inserts them again. `POST /tasks/reset` exposes that path. The UI button calls `api.resetToDemo()` from `apps/frontend/src/App.tsx`.

**Location:**
- Demo rows live next to the writer (`DEMO_TASKS` in `apps/backend/src/db.ts`). There is no shared fixture module

## Coverage

**Requirements:**
- No coverage target
- No CI job enforces tests. No `.github/`, `.gitlab/`, or other pipeline config (see `docs/02-tooling/ci-and-scripts.md`)
- A green `npm run typecheck` does not execute routes, SQL, or React render paths

**Configuration:**
- No coverage tool (no c8, istanbul, or `@vitest/coverage-*`)
- No exclusions, thresholds, or `coverage/` output

**View Coverage:**
```bash
# Not available. There is no coverage command.
npm run typecheck
```

## Test Types

**Unit Tests:**
- Not used
- Untested pure logic that does not need a server or browser:
  - `groupByStatus`, `flattenBoard`, `findContainer` in `apps/frontend/src/App.tsx` (not exported)
  - `assertStatus`, `mapRow`, `nextPosition` in `apps/backend/src/db.ts` (not exported)
  - `TASK_STATUSES` / `TaskStatus` in `packages/shared/src/index.ts` (types only; erased at compile time)

**Integration Tests:**
- Not used
- Behavior that only runs against the real process:
  - HTTP status mapping in `apps/backend/src/index.ts`: `201` create, `204` delete, `404` `{ error: "Task not found" }`, `400` `{ error: "<message>" }` for empty reorder items and thrown validation
  - SQL in `apps/backend/src/db.ts`: insert, update, delete, reorder transaction (`BEGIN` / `COMMIT` / `ROLLBACK`)
  - Client error parsing in `apps/frontend/src/api.ts` (`body.error`, then `body.message`, then `` `Request failed (${status})` ``, `204` → `undefined`)

**E2E Tests:**
- Not used
- Drag-and-drop (`@dnd-kit` handlers in `apps/frontend/src/App.tsx`, `Column.tsx`, `SortableTask.tsx`) is only verifiable by using the board
- `apps/frontend/package.json` `preview` script exists (`vite preview`). `apps/frontend/vite.config.ts` sets the `/api` proxy on `server` only, so `vite preview` does not proxy API calls

## Common Patterns

**Async Testing:**
- No test pattern. Application async style, for when a runner is added later, is `async`/`await` inside `try/catch/finally`:

```typescript
try {
  const data = await api.fetchTasks();
  setTasks(data);
  setError(null);
} catch (err) {
  setError(err instanceof Error ? err.message : "Failed to load tasks");
} finally {
  setLoading(false);
}
```

See `load`, `persistBoard`, `handleCreate`, `handleDelete`, and `handleResetDemo` in `apps/frontend/src/App.tsx`.

**Error Testing:**
- No `toThrow` usage exists. Production checks to mirror:
  - `createTask` throws `Error("Title is required")` when the trimmed title is empty (`apps/backend/src/db.ts`)
  - `assertStatus` throws `` Error(`Invalid status: ${status}`) ``
  - `reorderTasks` throws `` Error(`Task not found: ${item.id}`) `` and rolls back
  - Missing ids on GET/PATCH/DELETE do not throw; the route replies `404`
  - `apps/frontend/src/main.tsx` throws `Error("Root element #root not found")` if `#root` is missing

**Snapshot Testing:**
- Not used. No `__snapshots__/` directory. Prefer explicit assertions if tests are introduced; there is no snapshot baseline to update

---

*Testing analysis: 2026-10-05*
*Update when test patterns change*
