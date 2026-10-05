# Архитектура

Указатель документов в этой папке. Монорепозиторий канбана: npm workspaces (`apps/*`, `packages/*`) и turbo.

## Пакеты

| Пакет | Путь | Назначение |
| --- | --- | --- |
| `@repo/frontend` | `apps/frontend` | React 19, Vite, dnd-kit |
| `@repo/backend` | `apps/backend` | Fastify 5, SQLite (`node:sqlite`) |
| `@repo/shared` | `packages/shared` | Типы задачи и тела запросов |
| `@repo/typescript-config` | `packages/typescript-config` | Общие `tsconfig` |

Корневые скрипты `dev`, `build`, `lint`, `typecheck` запускают `turbo run`.

## HTTP

Браузер вызывает `/api/*`. Dev-сервер Vite (порт 5173) снимает префикс `/api` и пересылает запрос на `http://localhost:3001`. Backend слушает `PORT` (по умолчанию 3001) и `HOST` (по умолчанию `0.0.0.0`).

Маршруты backend, без префикса `/api`: `GET /health`; `GET` и `POST /tasks`; `GET`, `PATCH` и `DELETE /tasks/:id`; `PUT /tasks/reorder`; `POST /tasks/reset`.

## Документы

| Файл | О чём |
| --- | --- |
| [api-design-and-openapi.md](./api-design-and-openapi.md) | Маршруты и типы. Файла OpenAPI нет |
| [persistence-and-database.md](./persistence-and-database.md) | Файл SQLite, таблица `tasks`, порядок, демо-данные |
| [error-handling.md](./error-handling.md) | 400, 404, 201, 204 и тело `{ error }` |
| [auth-and-security.md](./auth-and-security.md) | Аутентификации нет. CORS `origin: true` |
| [integrations.md](./integrations.md) | Единственная граница — прокси Vite |
| [events-and-realtime.md](./events-and-realtime.md) | Канала realtime нет. Drag и `PUT /tasks/reorder` |
| [cross-cutting-policies.md](./cross-cutting-policies.md) | CORS и проверки полей в `index.ts` и `db.ts` |
| [schedulers-and-jobs.md](./schedulers-and-jobs.md) | Фоновых задач нет |
