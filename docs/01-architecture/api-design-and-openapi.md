# Контракт API

Файла OpenAPI в репозитории нет. Нет и другого артефакта спецификации (Swagger, JSON Schema файл, отдельный контрактный пакет).

Контракт — типы в `packages/shared/src/index.ts` и маршруты в `apps/backend/src/index.ts`. Пакет публикуется как `@repo/shared`.

Префикса версии у backend нет. Браузер добавляет `/api` (`API_BASE` в `apps/frontend/src/api.ts`). Vite в dev этот префикс снимает. Процесс Fastify принимает пути без `/api`.

Аутентификации нет. Если в запросе есть тело, клиент ставит `Content-Type: application/json`.

## Типы

`TaskStatus`: `todo` | `in_progress` | `done`. Константа `TASK_STATUSES` — тот же список.

`Task`:

| Поле | Тип |
| --- | --- |
| `id` | `string` |
| `title` | `string` |
| `description` | `string` |
| `status` | `TaskStatus` |
| `position` | `number` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

`CreateTaskInput`: обязательный `title`; необязательные `description` и `status`.

`UpdateTaskInput`: необязательные `title`, `description`, `status`, `position`.

`ReorderTasksInput`: массив `items` с полями `id`, `status`, `position`.

Подписи колонок `COLUMN_LABELS` (`To Do`, `In Progress`, `Done`) живут в том же модуле. На HTTP они не уходят.

## Маршруты

`POST /tasks/reset` и `PUT /tasks/reorder` зарегистрированы раньше `/tasks/:id`, поэтому сегменты `reset` и `reorder` не читаются как `id`.

| Метод и путь | Вход | Успех |
| --- | --- | --- |
| `GET /health` | — | 200 `{ ok: true }` |
| `GET /tasks` | — | 200 `Task[]` |
| `POST /tasks` | `CreateTaskInput` | 201 `Task` |
| `GET /tasks/:id` | — | 200 `Task` |
| `PATCH /tasks/:id` | `UpdateTaskInput` | 200 `Task` |
| `DELETE /tasks/:id` | — | 204, тела нет |
| `PUT /tasks/reorder` | `ReorderTasksInput` | 200 `Task[]` |
| `POST /tasks/reset` | — | 200 `Task[]`, демо-набор |

Ошибки: [error-handling.md](./error-handling.md). Сортировка списка: [persistence-and-database.md](./persistence-and-database.md).
