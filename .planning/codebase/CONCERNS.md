# Codebase Concerns

**Analysis Date:** 2026-10-05

## Tech Debt

**HTTP handlers are unvalidated and own persistence:**
- Issue: Routes in `apps/backend/src/index.ts` have no Fastify `schema`. TypeScript types from `packages/shared/src/index.ts` disappear at runtime. `createTask` / `updateTask` / `reorderTasks` in `apps/backend/src/db.ts` assume `title` is a string and `items` are well-typed objects. Any thrown `Error`, including SQLite constraint text, is copied into `{ "error": error.message }`.
- Files: `apps/backend/src/index.ts`, `apps/backend/src/db.ts`, `packages/shared/src/index.ts`
- Why: Workshop demo keeps routes and SQL in two files with manual `try/catch` instead of a schema or service layer.
- Impact: A non-string `title` becomes a 400 whose body is a `TypeError` message. A null `position` on reorder can surface a SQLite `NOT NULL` message. Callers cannot tell a domain error from a storage error. `Invalid status: ${status}` echoes the raw value.
- Fix approach: Add Fastify JSON schemas (or a small parser) for `CreateTaskInput`, `UpdateTaskInput`, and `ReorderTasksInput` in `apps/backend/src/index.ts`. Map known domain errors to stable codes in one place. Do not forward `error.message` from `node:sqlite`.

**Schema is created once and never migrated:**
- Issue: `apps/backend/src/db.ts` runs `CREATE TABLE IF NOT EXISTS` at import. There is no migration tool, no `schema_version`, and no `ALTER`.
- Files: `apps/backend/src/db.ts`, `docs/01-architecture/persistence-and-database.md`
- Why: One sqlite file is enough for the demo seed.
- Impact: A future column or `CHECK` change leaves existing `apps/backend/data/tasks.db` on the old shape. The process still starts. Queries then fail, or new columns stay missing. `IF NOT EXISTS` does not repair that.
- Fix approach: Add a version table and ordered SQL migrations next to `db.ts`, or document that a schema change requires deleting `apps/backend/data/tasks.db` (gitignored).

**Board order is not an invariant:**
- Issue: `position` is a free integer. There is no `UNIQUE(status, position)`. `updateTask` writes `input.position` and `input.status` without shifting siblings. `deleteTask` does not compact neighbors. `reorderTasks` updates only the ids in the payload; other rows keep their old status and position.
- Files: `apps/backend/src/db.ts` (`updateTask`, `deleteTask`, `reorderTasks`), `packages/shared/src/index.ts` (`UpdateTaskInput`)
- Why: The UI rewrites every card's position on drop, so the happy path hides gaps and duplicates.
- Impact: `PATCH /tasks/:id` with a new `status` and no new `position` can place two cards on the same slot. A partial `PUT /tasks/reorder` does the same. `listTasks` then tie-breaks on `created_at`, so order depends on insert time, not on the caller's intent.
- Fix approach: Make reorder replace the full order inside a transaction (reject unknown ids, and either require every current id or treat omissions as deletes). When `status` changes, assign `nextPosition` unless the caller sends a full column order.

**Demo seed and reset are not one transaction:**
- Issue: `seedDemoTasks` inserts three rows with separate `createTask` calls. `resetToDemo` runs `DELETE FROM tasks` and then those inserts, with no `BEGIN`/`COMMIT` around the pair.
- Files: `apps/backend/src/db.ts` (`seedDemoTasks`, `seedIfEmpty`, `resetToDemo`)
- Why: The seed is three constant titles and the process is single-threaded.
- Impact: A crash after `DELETE` and before the third insert leaves one or two rows. `seedIfEmpty` only runs when `COUNT(*)` is 0, so a partial seed is kept and the board no longer matches `DEMO_TASKS`.
- Fix approach: Wrap `resetToDemo` and `seedDemoTasks` in the same `BEGIN`/`COMMIT` pattern already used by `reorderTasks`.

**`updateTask` on the client is dead:**
- Issue: `updateTask` is exported from `apps/frontend/src/api.ts` and `PATCH /tasks/:id` works, but `apps/frontend/src/App.tsx` never calls it. The composer sends `{ title }` only. `TaskCard` renders `description` and never edits `title`.
- Files: `apps/frontend/src/api.ts`, `apps/frontend/src/App.tsx`, `apps/frontend/src/components/TaskCard.tsx`
- Why: The board slice ships create, drag, delete, and reset. Description exists on the shared `Task` type for the API.
- Impact: Description stays empty for every card created from the UI. Renames require a hand-written `PATCH`. The unused client function drifts from the screen.
- Fix approach: Either add an edit form that calls `api.updateTask`, or drop `updateTask` from the client until a screen needs it.

**The only automated gate is `tsc`:**
- Issue: `lint` and `typecheck` in `apps/backend/package.json`, `apps/frontend/package.json`, and `packages/shared/package.json` are both `tsc --noEmit`. There is no ESLint, no test script, and no CI config (no `.github/`, `.gitlab/`, or `Jenkinsfile`).
- Files: `package.json`, `turbo.json`, `apps/backend/package.json`, `apps/frontend/package.json`, `packages/shared/package.json`, `docs/02-tooling/ci-and-scripts.md`, `docs/_ai/testing.md`
- Why: The repo is a short workshop; typecheck was wired through Turbo and a test runner was not.
- Impact: Runtime bugs in drag persistence, SQL, and HTTP status codes are invisible to `npm run lint` and `npm run typecheck`.
- Fix approach: Add a test script (see Test Coverage Gaps) and a CI job that runs `npm run typecheck` plus that script. Keep ESLint out until a rule set is chosen; `tsc` already covers types.

**Built UI has no API path:**
- Issue: `/api` proxy exists only under `server.proxy` in `apps/frontend/vite.config.ts`. `preview` is not configured. Fastify does not serve `apps/frontend/dist`. `API_BASE` is the constant `"/api"` in `apps/frontend/src/api.ts`.
- Files: `apps/frontend/vite.config.ts`, `apps/frontend/src/api.ts`, `apps/frontend/package.json` (`preview`), `apps/backend/src/index.ts`
- Why: Dev workflow is `npm run dev` (Vite on 5173, Fastify on 3001).
- Impact: `npm run build` then `vite preview` loads the board and calls `/api/tasks` on the preview origin. Nothing forwards that prefix, so the board stays on the load error. Changing `PORT` without editing `vite.config.ts` breaks dev the same way (`docs/00-start/common-issues.md`).
- Fix approach: Set `preview.proxy` to the same `/api` target, or serve the built assets from Fastify. Keep the proxy target and `PORT` in one place.

## Known Bugs

**Drop outside the board keeps a move that was never saved:**
- Symptoms: After a cross-column drag, releasing the pointer outside any droppable leaves the card in the new column. Reload shows the old column.
- Trigger: Drag a card onto another column (`onDragOver` already called `setTasks`) and release where `over` is null.
- Files: `apps/frontend/src/App.tsx` (`handleDragOver`, `handleDragEnd`)
- Workaround: Reload the page. `GET /tasks` restores the last successful write.
- Root cause: `handleDragOver` mutates React state when the column changes. `handleDragEnd` returns immediately when `!over` and does not revert that state or call `persistBoard`.
- Blocked by: Nothing. Needs a snapshot taken at drag start and a restore on cancel.

**Cross-column drop persists only if drag-over state has already committed:**
- Symptoms: A drop onto another column can snap back, or `PUT /tasks/reorder` can save the pre-drag columns.
- Trigger: `onDragEnd` runs in the same turn as the last `onDragOver`, before React applies `setTasks`.
- Files: `apps/frontend/src/App.tsx` (`handleDragOver` around the column splice, `handleDragEnd` reading `tasks` / `board`)
- Workaround: Drop again after the card has visibly settled in the target column. Same-column reorder is computed in `handleDragEnd` via `arrayMove` and does not depend on this.
- Root cause: `handleDragEnd` builds `next` from the render closure `tasks`. The cross-column branch does not move the card; it assumes `handleDragOver` already did. `setTasks` in `handleDragOver` is asynchronous.
- Blocked by: Nothing. Compute the next board inside `handleDragEnd` from the event, or mirror the board in a ref updated during `onDragOver`.

**A failed save plus a failed reload leaves the optimistic board:**
- Symptoms: The banner shows the reorder error, cards stay in the unsaved order, and the browser reports an unhandled rejection.
- Trigger: `PUT /tasks/reorder` fails, then `GET /tasks` inside the `catch` also fails (backend down).
- Files: `apps/frontend/src/App.tsx` (`persistBoard`)
- Workaround: Reload when the backend is back.
- Root cause: `catch` sets the error, then `await api.fetchTasks()` with no nested `try`. `handleDragEnd` is invoked with `void`, so the second failure is unhandled. `finally` still clears `saving`, but `tasks` stays on `flattenBoard(nextBoard)`.
- Blocked by: Nothing. Keep the previous `tasks` and catch the refetch separately.

**Overlapping writes apply whichever response returns last:**
- Symptoms: A card that was just added or deleted reappears or disappears. A newer drop is replaced by an older column layout.
- Trigger: Drag, delete, or add while `saving` is true. Columns stay draggable; only the composer and Reset are disabled.
- Files: `apps/frontend/src/App.tsx` (`persistBoard`, `handleCreate`, `handleDelete`, `handleDragEnd`)
- Workaround: Wait until the "Saving…" banner clears before the next change. Refresh if the board looks wrong.
- Root cause: Each call does `setTasks` when its own request finishes. There is no request id. `PUT /tasks/reorder` replaces the whole list with that response, which was snapshotted at request start.
- Blocked by: Nothing. Ignore stale responses (monotonic id) or disable drag for the whole `saving` window.

## Security Considerations

**Every route is anonymous, including wipe and delete:**
- Risk: Anyone who can reach the listen port can `GET /tasks`, `POST /tasks`, `PATCH` or `DELETE /tasks/:id`, `PUT /tasks/reorder`, and `POST /tasks/reset`. Reset deletes every row and inserts the three demo titles.
- Files: `apps/backend/src/index.ts`, `apps/backend/src/db.ts` (`resetToDemo`), `docs/01-architecture/auth-and-security.md`
- Current mitigation: None. The product has no sessions, tokens, or API keys. This is a local workshop board, not a multi-tenant app.
- Recommendations: Bind demo servers to `127.0.0.1`. If the port is reachable beyond localhost, put a shared secret or network ACL in front of `POST /tasks/reset` and the mutating routes before treating the process as shared.

**Listen address and CORS reflect the caller:**
- Risk: `HOST` defaults to `0.0.0.0`, so the API is on every interface. `@fastify/cors` is registered with `{ origin: true }`, which reflects any `Origin`. A browser page on another origin can call the methods the plugin allows on preflight.
- Files: `apps/backend/src/index.ts`, `docs/01-architecture/auth-and-security.md`, `docs/03-reference/env-and-config.md`
- Current mitigation: The plugin is not given `credentials: true`. Its default preflight methods are `GET, HEAD, POST` (the app does not pass `methods`). Dev UI calls same-origin `/api` on port 5173, and Vite proxies to Fastify, so browser CORS is not what protects the dev board. Non-browser clients ignore CORS entirely.
- Recommendations: Default `HOST` to `127.0.0.1`. Set an explicit origin allowlist. Do not rely on CORS as access control.

**Error bodies and logs are unsanitized:**
- Risk: 400 responses include caller-controlled `status` and task `id` (`Invalid status: …`, `Task not found: …`). Storage exceptions from the uncaught path use the same `error.message` channel. Fastify is created with `logger: true` and no redaction.
- Files: `apps/backend/src/index.ts`, `apps/backend/src/db.ts` (`assertStatus`, `reorderTasks`), `docs/01-architecture/error-handling.md`, `docs/04-ops/observability.md`
- Current mitigation: Task titles are rendered as React text in `apps/frontend/src/components/TaskCard.tsx` (no `dangerouslySetInnerHTML`). SQL uses `?` placeholders. The code does not set `bodyLimit`; Fastify's default (1 MiB) still applies.
- Recommendations: Return fixed error codes to clients. Log the raw cause on the server only. Cap `title` and `description` length in the parser, not only via the body limit.

## Performance Bottlenecks

**Every drop rewrites the whole table:**
- Problem: One drag sends every task to `PUT /tasks/reorder`. The handler updates each row, then `listTasks()` reads the whole table again.
- Files: `apps/frontend/src/App.tsx` (`persistBoard`, `flattenBoard`), `apps/backend/src/db.ts` (`reorderTasks`, `listTasks`)
- Measurement: Not measured. The seed is 3 rows (`DEMO_TASKS` in `db.ts`). No load test or timing script is in the repo. At that size the cost is one synchronous round trip, not a visible stall.
- Cause: The client has no patch of "moved id only". `listTasks` has no `WHERE`, and the table has no index besides `PRIMARY KEY(id)`. `DatabaseSync` runs on the Node event loop.
- Improvement path: Leave as-is for the workshop size. If the board grows, send the changed column only, add an index on `(status, position)`, and avoid a second full read when the handler can return the rows it just wrote.

**List and reorder block the process:**
- Problem: `node:sqlite` `DatabaseSync` is synchronous. A long write stalls every other request on that process, including `GET /health`.
- Files: `apps/backend/src/db.ts`, `apps/backend/src/index.ts`
- Measurement: Not measured. No benchmark harness. Single connection, no pool, no worker thread.
- Cause: One module-level `DatabaseSync` and no `await` inside the SQL helpers, so each request runs to completion on the event loop.
- Improvement path: Keep the sync driver while the file stays a demo. A larger board needs a worker or an async driver so `listen` stays responsive during a rewrite.

## Fragile Areas

**Drag state machine in `App`:**
- Why fragile: Column moves happen in `onDragOver`. Persistence and same-column `arrayMove` happen in `onDragEnd`, reading `tasks` from the render that created the handler. `board` is `useMemo` of that same state.
- Files: `apps/frontend/src/App.tsx`, `apps/frontend/src/components/Column.tsx`, `apps/frontend/src/components/SortableTask.tsx`
- Common failures: Cancelled drag, cross-column drop, and a second gesture while "Saving…" is visible (see Known Bugs). `PointerSensor` distance is 6px; a short click on the handle does not start a drag, but a delete click during an in-flight reorder still races `setTasks`.
- Safe modification: Change column math in one function used by both events. Add a regression test that feeds a drag-over then a drag-end with a stale snapshot, and one that drops with `over === null`.
- Test coverage: None. No `*.test.*` / `*.spec.*` in the repo.

**SQLite singleton opened at import:**
- Why fragile: `apps/backend/src/db.ts` computes `dbPath` from `import.meta.url`, creates `apps/backend/data/`, and opens `tasks.db` before `listen`. `seedIfEmpty()` runs at the top of `apps/backend/src/index.ts`. Nothing calls `close()`. There is no signal handler.
- Files: `apps/backend/src/db.ts`, `apps/backend/src/index.ts`
- Common failures: Importing `db.ts` from a test hits the real file. Two processes (a second `tsx watch` or a `node dist/index.js` beside dev) share one WAL file. `PORT=abc` becomes `NaN` via `Number(...)` and `listen` exits 1. A schema edit does not migrate the existing file.
- Safe modification: Pass an explicit database path into an `openDatabase()` used by the server and by tests. Close it on shutdown. Do not open the file at module scope.
- Test coverage: None. `npm run typecheck` does not execute SQL.

**Route order for `reset` and `reorder`:**
- Why fragile: `POST /tasks/reset` and `PUT /tasks/reorder` are registered before `GET/PATCH/DELETE /tasks/:id`. Fastify would treat `reset` and `reorder` as `:id` if that order flipped.
- Files: `apps/backend/src/index.ts`
- Common failures: A new `POST /tasks/:id/...` registered above the static paths captures `reset`.
- Safe modification: Keep static paths first, or mount them on a prefix that cannot match `:id`. Cover both URLs with a route test.
- Test coverage: None. Documented in `docs/01-architecture/api-design-and-openapi.md`.

**Dev proxy is the only way the UI finds the API:**
- Why fragile: The browser always requests `/api`. Stripping that prefix is a Vite dev setting aimed at `http://localhost:3001`.
- Files: `apps/frontend/vite.config.ts`, `apps/frontend/src/api.ts`, `docs/00-start/common-issues.md`
- Common failures: Backend on another port, preview without `preview.proxy`, or opening `http://localhost:3001/api/tasks` (that path is not registered; the API path is `/tasks`).
- Safe modification: Change `API_BASE`, the proxy rewrite, and the Fastify paths together. After a proxy edit, load the board and create one card.
- Test coverage: Manual only (`GET http://localhost:3001/health`).

## Scaling Limits

**One sqlite file, one Node process:**
- Current capacity: Demo seed is 3 tasks. The file is `apps/backend/data/tasks.db` (gitignored, `*.db` in `.gitignore`). One `DatabaseSync` connection. No pagination on `GET /tasks`.
- Limit: A second OS process writing the same file hits SQLite's single-writer lock. Concurrent HTTP clients on one process are serialized by the sync driver. The board payload grows with every card because reorder sends the full list.
- Symptoms at limit: Requests queue behind a write. A second `npm run dev` backend fails to lock the file or blocks. The browser replaces the whole board on each drop, so two open tabs last-write-wins.
- Scaling path: One backend process per file. For more than a workshop board, add a write queue or move off a single local file, and stop using a full-table reorder as the sync protocol.

**Shared board with no identity:**
- Current capacity: Every caller of the listen port shares one table. Default bind is all interfaces, port 3001.
- Limit: There is no per-user board, no lock, no row version.
- Symptoms at limit: One person's Reset or drag replaces the board the other person is looking at. The UI does not refresh until that person acts or reloads (`docs/01-architecture/events-and-realtime.md`: no SSE or WebSocket).
- Scaling path: Not required for a single local demo. A shared workshop needs a board id, a version on `PUT /tasks/reorder`, and a refusal when the version is stale.

## Dependencies at Risk

**`node:sqlite` with no Node pin:**
- Risk: `apps/backend/src/db.ts` imports `DatabaseSync` from `node:sqlite`. Root `package.json` has `packageManager` `npm@11.13.0` and no `engines` field. `@types/node` is `^22.15.21` (`apps/backend/package.json`). Availability of `node:sqlite` (and whether the process needs `--experimental-sqlite`) depends on the Node binary, which the repo does not record.
- Impact: On a Node build without that module, the backend fails at import, before `listen`. `npm run typecheck` can still pass.
- Migration plan: Set `engines.node` to a version that ships `node:sqlite` without a flag, and document it in `docs/00-start/local-setup.md`. Revisit only if that module is removed; the SQL is plain and local to `db.ts`.

**Fonts load from Google at page start:**
- Risk: `apps/frontend/index.html` pulls stylesheets from `fonts.googleapis.com` and `fonts.gstatic.com`. The workshop has no other network dependency (`docs/01-architecture/integrations.md`).
- Impact: Offline or blocked fonts: UI still renders. `apps/frontend/src/styles.css` falls back to `sans-serif` for body text and `Georgia, serif` for `h1`. Layout does not wait on those files.
- Migration plan: Optional. Self-host the two families only if the demo must match typography without network.

**Caret ranges on Fastify, React, and Vite:**
- Risk: `fastify` `^5.3.3`, `@fastify/cors` `^11.0.1`, `react` / `react-dom` `^19.1.0`, `vite` `^6.3.5`, `turbo` `^2.5.4`. Lockfile is `package-lock.json`. `@dnd-kit/core` `6.3.1` allows `react` `>=16.8.0`, so React 19 is inside the declared peer range.
- Impact: A future lockfile refresh can pick up a breaking minor inside those ranges. The app code is small and the break would show up at `npm run dev` or `build`.
- Migration plan: Keep the lockfile committed. Upgrade those packages on purpose and re-run the board (add, drag across columns, delete, reset). No abandoned library is on the critical path.

## Missing Critical Features

**No way to edit a card from the board:**
- Problem: Title and description cannot be changed in the UI. `PATCH /tasks/:id` and `api.updateTask` exist. `TaskCard` only displays text and deletes.
- Files: `apps/frontend/src/App.tsx`, `apps/frontend/src/components/TaskCard.tsx`, `apps/frontend/src/api.ts`, `docs/_ai/product-context.md`
- Current workaround: Delete and add a new card, or call `PATCH /tasks/:id` directly. New cards from the form have `description: ""`.
- Blocks: Correcting a title without losing `id` / `createdAt`. Showing a description, because nothing in the UI writes one.
- Implementation complexity: Low. A title field on `TaskCard` that calls `api.updateTask` matches the existing client helper.

**No production wiring for the static board:**
- Problem: There is no server path that serves the Vite build and the API together. Preview does not proxy `/api`.
- Files: `apps/frontend/vite.config.ts`, `apps/backend/src/index.ts`
- Current workaround: Use `npm run dev` only.
- Blocks: Handing someone a built board without also running the Vite dev server.
- Implementation complexity: Low for `preview.proxy`. Medium if Fastify must serve `dist/`.

**No concurrency token on the shared list:**
- Problem: Reorder, create, delete, and reset do not send or check a revision. The second writer replaces the first.
- Files: `apps/backend/src/db.ts`, `packages/shared/src/index.ts` (`ReorderTasksInput` has no version)
- Current workaround: One person, one tab.
- Blocks: Two browsers on one backend keeping a coherent board.
- Implementation complexity: Medium. A `revision` column checked inside `reorderTasks`'s existing transaction, plus a 409 the UI already knows how to refetch.

## Test Coverage Gaps

**`db.ts` behavior:**
- What's not tested: Empty title, status outside `TASK_STATUSES`, `nextPosition`, reorder rollback when an id is missing, partial reorder leaving other rows, `seedIfEmpty` vs `resetToDemo`, and the `CHECK` on `status`.
- Files: `apps/backend/src/db.ts`
- Risk: A change to the transaction or the position rule ships as long as `tsc` passes. Rollback is the only thing that keeps a bad reorder from committing.
- Priority: High
- Difficulty to test: The database opens at import against `apps/backend/data/tasks.db`. Tests need an injected path or a temp file before the module opens the demo file.

**HTTP status and error shape:**
- What's not tested: 201 create, 204 delete, 404 missing id, 400 empty reorder, 400 unknown reorder id (not 404), and 200 reset. Also that `POST /tasks/reset` is not captured by `/tasks/:id`.
- Files: `apps/backend/src/index.ts`
- Risk: Reordering route registration or wrapping errors in a non-`Error` value changes the contract the UI parses in `apps/frontend/src/api.ts`.
- Priority: High
- Difficulty to test: Fastify `inject` can hit routes without binding `0.0.0.0`, once the database is not a process-wide singleton.

**Drag persistence in `App.tsx`:**
- What's not tested: Cross-column drop, same-column `arrayMove`, drop with `over === null`, and a reorder error that must refetch.
- Files: `apps/frontend/src/App.tsx`
- Risk: The bugs in Known Bugs stay invisible. This is the only user path that writes order.
- Priority: High
- Difficulty to test: Needs a React renderer and a fake `api.reorderTasks` / `api.fetchTasks`. No test runner is installed.

**Client error parsing:**
- What's not tested: Non-JSON error bodies, `{ "message" }` vs `{ "error" }`, and 204 delete returning `undefined`.
- Files: `apps/frontend/src/api.ts`
- Risk: A Fastify default 500 HTML or JSON body surfaces as `Request failed (500)` or as the wrong field, and the banner shows a generic string.
- Priority: Medium
- Difficulty to test: Low once a runner exists. Mock `fetch`.

**CI:**
- What's not tested: Nothing runs on push. `docs/02-tooling/ci-and-scripts.md` records that no CI config is present.
- Files: `package.json`, `turbo.json`
- Risk: A broken `npm run dev` path is noticed only when someone starts the workshop.
- Priority: Medium
- Difficulty to test: Low to add a job for `npm run typecheck` now, and for tests after a runner exists.

---

*Concerns audit: 2026-10-05*
*Update as issues are fixed or new ones discovered*
