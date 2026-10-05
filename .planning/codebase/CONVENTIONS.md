# Coding Conventions

**Analysis Date:** 2026-10-05

## Naming Patterns

**Files:**
- PascalCase for React components: `apps/frontend/src/components/TaskCard.tsx`, `Column.tsx`, `SortableTask.tsx`, `apps/frontend/src/App.tsx`
- lowercase for non-component modules: `apps/frontend/src/api.ts`, `apps/frontend/src/main.tsx`, `apps/backend/src/db.ts`, `apps/backend/src/index.ts`
- Shared contract is a single module: `packages/shared/src/index.ts`
- CSS lives in one file: `apps/frontend/src/styles.css`. Class names are kebab-case (`task-overlay`, `column-header`, `drag-handle`). Custom properties are kebab-case (`--bg-accent`)
- No `*.test.ts` / `*.spec.ts` files exist

**Functions:**
- camelCase for all functions (`listTasks`, `groupByStatus`, `persistBoard`, `fetchTasks`)
- No `async` prefix. Async functions are named for the action (`handleCreate`, `reorderTasks`)
- React event handlers inside a component use `handle` + event: `handleCreate`, `handleDelete`, `handleDragStart`, `handleDragOver`, `handleDragEnd`, `handleResetDemo`
- Callback props use `on` + action: `onDelete` in `Column.tsx`, `SortableTask.tsx`, `TaskCard.tsx`
- Unexported helpers stay in the same file: `mapRow`, `assertStatus`, `nextPosition`, `seedDemoTasks` in `apps/backend/src/db.ts`; `groupByStatus`, `flattenBoard`, `findContainer` in `apps/frontend/src/App.tsx`

**Variables:**
- camelCase for locals and parameters (`nextTitle`, `activeContainer`, `dbPath`)
- UPPER_SNAKE_CASE for module constants: `API_BASE` in `apps/frontend/src/api.ts`, `PORT` and `HOST` in `apps/backend/src/index.ts`, `WORKSHOP_NAME`, `TASK_STATUSES`, `COLUMN_LABELS` in `packages/shared/src/index.ts`, `DEMO_TASKS` in `apps/backend/src/db.ts`
- No underscore prefix for private members
- SQLite columns are snake_case (`created_at`, `updated_at`). Map them to camelCase on the domain type in `mapRow` (`createdAt`, `updatedAt`). Do not leak row names into `Task`

**Types:**
- PascalCase `type` aliases. Do not use `interface`. Do not use an `I` prefix. See `Task`, `TaskStatus`, `CreateTaskInput`, `UpdateTaskInput`, `ReorderTasksInput` in `packages/shared/src/index.ts`
- Component props: `type` + component name + `Props`, declared in the component file (`TaskCardProps`, `ColumnProps`, `SortableTaskProps`)
- Status is a const tuple plus a derived union, not an enum:

```typescript
export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
```

- Status string values stay snake_case (`in_progress`) because they are stored in SQLite and sent over HTTP
- Input types end in `Input`. Row shapes stay local (`TaskRow` in `apps/backend/src/db.ts`) and are not exported
- Route generics on Fastify handlers: `app.get<{ Params: { id: string } }>`, `app.post<{ Body: CreateTaskInput }>`

## Code Style

**Formatting:**
- No Prettier, Biome, or `.editorconfig`. Match the existing files by hand
- 2-space indentation
- Double quotes for strings and JSX text attributes
- Semicolons required
- Trailing commas in multiline calls, objects, imports, and type literals
- `const` by default. `let` only when reassigned (`cancelled` in `App.tsx`)
- Early `return` for guards (`if (!title)`, `if (!task)`, `if (!over)`)
- Conditional JSX is a ternary that renders `null` (`{error ? <p>...</p> : null}`), not `&&`
- Float promises with `void` (`void load()`, `void handleResetDemo()`, `void handleDragEnd(event)`)
- Backend targets ES2022 + NodeNext (`packages/typescript-config/node.json`). Frontend targets ES2022 + `jsx: react-jsx` (`packages/typescript-config/react.json`). `strict` is on in `packages/typescript-config/base.json`

**Linting:**
- No ESLint config and no `eslint` dependency
- `lint` in every workspace is `tsc -p tsconfig.json --noEmit` (`apps/backend/package.json`, `apps/frontend/package.json`, `packages/shared/package.json`)
- Run from the repo root: `npm run lint` and `npm run typecheck`. Both go through Turbo and depend on `^build` (`turbo.json`), so `@repo/shared` must be built before dependents typecheck
- `npm run lint` does not check formatting, unused CSS, or React hook rules

## Import Organization

**Order:**
1. Node built-ins with the `node:` prefix (`node:fs`, `node:path`, `node:url`, `node:crypto`, `node:sqlite`) — backend only
2. External packages (`fastify`, `@fastify/cors`, `@dnd-kit/core`, `react`)
3. Workspace package `@repo/shared`
4. Relative imports (`./db.js`, `./api`, `./components/Column`)
5. Side-effect CSS last (`import "./styles.css"` in `apps/frontend/src/main.tsx`)

**Grouping:**
- No blank line between groups in current files. Keep a new file consistent with its neighbors rather than inserting a new grouping style
- No alphabetical sort
- Prefer `import type` when the binding is types only (`apps/frontend/src/api.ts`, `TaskCard.tsx`)
- When a module import mixes values and types, use the inline `type` modifier (`type DragEndEvent` in `App.tsx`, `type CreateTaskInput` in `apps/backend/src/index.ts`)

**Path Aliases:**
- No `paths` aliases in tsconfig
- Shared types: `import { ... } from "@repo/shared"`
- Backend relative imports include the `.js` extension (`from "./db.js"`) because `moduleResolution` is `NodeNext`. Frontend relative imports omit the extension (`from "./api"`, `from "./TaskCard"`)
- `apps/frontend/vite.config.ts` is the only default export (`export default defineConfig`). Application modules use named exports

## Error Handling

**Patterns:**
- Throw plain `Error`. No custom error classes, no `Result` type
- Validate in the function that owns the invariant, then catch at the HTTP boundary in `apps/backend/src/index.ts`
- Async UI code uses `try/catch/finally`. No `.catch()` chains
- Narrow with `err instanceof Error ? err.message : "fallback string"`
- Expected absence is a return value, not an exception: `getTask` returns `Task | undefined`, `deleteTask` returns `boolean`, `updateTask` returns `Task | undefined`

**Error Types:**
- Throw on invalid input: `"Title is required"` and `` `Invalid status: ${status}` `` in `apps/backend/src/db.ts`. `assertStatus` is an assertion function (`asserts status is TaskStatus`)
- Missing task: route sends `404` and `{ error: "Task not found" }`. Do not throw `Error` for a missing id on read/update/delete
- Bad payload / thrown validation: route sends `400` and `{ error: error.message }`
- Successful create: `201` with the task. Successful delete: `204` with an empty body
- Client (`apps/frontend/src/api.ts`): non-OK responses throw `Error` whose message is `body.error`, else `body.message`, else `` `Request failed (${status})` ``. JSON parse failure is ignored. `204` returns `undefined as T`
- UI stores a single `string | null` in `error` state. Delete is optimistic and restores `previous` on failure. Reorder refetches via `fetchTasks` after a failed save
- SQLite reorder uses `BEGIN` / `COMMIT` and `ROLLBACK` then rethrows (`reorderTasks` in `apps/backend/src/db.ts`)
- Process boot failure: `app.log.error(error)` then `process.exit(1)` in `apps/backend/src/index.ts`

## Logging

**Framework:**
- Fastify's built-in logger: `Fastify({ logger: true })` in `apps/backend/src/index.ts`
- Levels used in code: `error` only (`app.log.error`). Request logs come from Fastify itself
- No pino import, no winston, no `console.log` / `console.error` in `apps/` or `packages/`

**Patterns:**
- Do not add `console.*` for flow tracing
- Log at process boundaries (listen failure). Do not log inside `db.ts` or `api.ts`
- User-visible failures go to React state (`setError`), not the console

## Comments

**When to Comment:**
- Current source has one comment: `// ignore JSON parse errors` on the empty `catch` in `apps/frontend/src/api.ts`
- Write a comment only when a branch is intentionally empty or a constraint is not obvious from the code
- Do not narrate what the next line does

**JSDoc/TSDoc:**
- Not used. Do not add `@param` / `@returns` blocks to new functions unless a public signature is genuinely ambiguous
- Exported contracts are documented by their TypeScript types in `packages/shared/src/index.ts`

**TODO Comments:**
- None in the repo. Do not add `TODO` / `FIXME` as a substitute for a code change

## Function Design

**Size:**
- One operation per exported function in `apps/backend/src/db.ts` and `apps/frontend/src/api.ts`
- Keep HTTP handlers in `apps/backend/src/index.ts` thin: read params/body, call `db.ts`, map status codes
- Pure board helpers stay at module scope in `apps/frontend/src/App.tsx` (`groupByStatus`, `flattenBoard`, `findContainer`). `App` itself holds board state and drag handlers; put new pure transforms next to those helpers, not inline in JSX
- Presentational components (`Column`, `SortableTask`, `TaskCard`) receive data and callbacks. They do not call `fetch`

**Parameters:**
- Prefer a typed input object for create/update payloads (`CreateTaskInput`, `UpdateTaskInput`)
- Two positional parameters is the current maximum for domain functions: `updateTask(id, input)`
- Destructure props in the signature: `function Column({ status, title, tasks, onDelete }: ColumnProps)`
- Default optional props in the signature (`overlay = false`)

**Return Values:**
- Explicit `return`. Guard clauses return early
- Reads that may miss return `undefined` (`getTask`)
- Commands that need to tell the route "not found" return `boolean` (`deleteTask`) or `undefined` (`updateTask`)
- Mutations that succeed return the domain `Task` or `Task[]`, not the SQLite row
- `request<T>` is the only generic helper. Callers pass the response type (`request<Task[]>("/tasks")`)

## Module Design

**Exports:**
- Named exports for application code: `export function App`, `export function listTasks`, `export function fetchTasks`
- Do not default-export React components
- `packages/shared/src/index.ts` is the public contract. Export a new shared type or const from that file. Consumers import `@repo/shared`, which resolves to `dist` (`packages/shared/package.json` `exports`)
- Keep helpers unexported unless another module needs them
- Backend DB is a module-level singleton (`const db = new DatabaseSync(dbPath)` in `apps/backend/src/db.ts`). Schema `exec` and `seedIfEmpty()` run at import time. Do not open a second connection

**Barrel Files:**
- No `index.ts` barrels under `apps/frontend/src/components/`. Import the component file directly (`./components/Column`, `./TaskCard`)
- The only re-export surface is `packages/shared/src/index.ts`, and it contains the types rather than re-exporting other files
- ESM everywhere: `"type": "module"` in `apps/backend/package.json`, `apps/frontend/package.json`, `packages/shared/package.json`

---

*Convention analysis: 2026-10-05*
*Update when patterns change*
