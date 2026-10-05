# Domains

В приложении один домен: **задачи канбана**. Отдельных пользователей, проектов и вложений нет.

Контракт: `packages/shared/src/index.ts`. Реализация: `apps/backend/src/db.ts` и маршруты в `apps/backend/src/index.ts`.

## Маршруты

Префикс `/api` существует только на dev-сервере Vite. Backend эти пути не знает.

| Метод | Путь backend | Успех | Ошибка |
| --- | --- | --- | --- |
| `GET` | `/health` | 200 `{ ok: true }` | — |
| `GET` | `/tasks` | 200 `Task[]` | — |
| `POST` | `/tasks/reset` | 200 `Task[]` | — |
| `PUT` | `/tasks/reorder` | 200 `Task[]` | 400 `{ error }` |
| `GET` | `/tasks/:id` | 200 `Task` | 404 `{ error: "Task not found" }` |
| `POST` | `/tasks` | 201 `Task` | 400 `{ error }` |
| `PATCH` | `/tasks/:id` | 200 `Task` | 404 или 400 `{ error }` |
| `DELETE` | `/tasks/:id` | 204 пусто | 404 `{ error: "Task not found" }` |

`POST /tasks/reset` объявлен раньше `POST /tasks`, `PUT /tasks/reorder` — раньше `GET /tasks/:id`.

Тело reorder: `{ items: [{ id, status, position }] }`. Пустой или не-массив `items` → 400 `"items array is required"`. Неизвестный id внутри транзакции → 400 с текстом `Task not found: <id>`.

## Поля `Task`

`id` (UUID), `title`, `description`, `status`, `position` (number), `createdAt`, `updatedAt` (ISO-строки). В SQLite время лежит в колонках `created_at` и `updated_at`; `mapRow` переименовывает их в camelCase.

Подробности статусов и проверок: [domain-context.md](./domain-context.md). Human-справочник: [tasks](../03-reference/domains/tasks.md), [api-domains](../03-reference/api-domains.md), [routes](../03-reference/routes-catalog.md).
