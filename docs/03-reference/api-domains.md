# API: домен tasks

Сервер: Fastify в `apps/backend/src/index.ts`. Префикса пути на сервере нет: маршруты висят на корне (`/tasks`, `/health`).

Браузер ходит на базу `"/api"` (`apps/frontend/src/api.ts`). В dev Vite снимает префикс `/api` и проксирует на `http://localhost:3001` (`apps/frontend/vite.config.ts`). Запрос браузера `GET /api/tasks` доходит до сервера как `GET /tasks`.

Полная таблица кодов — [routes-catalog.md](./routes-catalog.md). Разбор поведения — [domains/tasks.md](./domains/tasks.md).

## Маршруты

| Метод | Путь сервера | Успех | Клиент |
| --- | --- | --- | --- |
| `GET` | `/health` | 200 `{ ok: true }` | вызова в `api.ts` нет |
| `GET` | `/tasks` | 200, массив `Task` | `fetchTasks` |
| `POST` | `/tasks` | 201, `Task` | `createTask` |
| `GET` | `/tasks/:id` | 200, `Task` | вызова в `api.ts` нет |
| `PATCH` | `/tasks/:id` | 200, `Task` | `updateTask` |
| `DELETE` | `/tasks/:id` | 204, пустое тело | `deleteTask` |
| `PUT` | `/tasks/reorder` | 200, массив `Task` | `reorderTasks` |
| `POST` | `/tasks/reset` | 200, массив `Task` | `resetToDemo` |

## Типы (`@repo/shared`)

`Task`: `id`, `title`, `description`, `status`, `position`, `createdAt`, `updatedAt`.

`TaskStatus`: `todo` | `in_progress` | `done` (`TASK_STATUSES`).

`CreateTaskInput`: `title` обязателен, `description` и `status` необязательны.

`UpdateTaskInput`: необязательные `title`, `description`, `status`, `position`.

`ReorderTasksInput`: `items[]` с полями `id`, `status`, `position`.

Подписи колонок (`COLUMN_LABELS`): To Do, In Progress, Done. Константа `WORKSHOP_NAME` равна `"gsd-graphify-workshop"`.
