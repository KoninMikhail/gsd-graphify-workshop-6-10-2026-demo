# Сквозные правила

Отдельных классов политик нет. Общее для маршрутов — CORS и ручные проверки полей. Схемы Fastify на маршрутах не заданы.

Код: `apps/backend/src/index.ts`, `apps/backend/src/db.ts`.

## CORS

Подключён `@fastify/cors` с единственной опцией `{ origin: true }`. Любой заголовок `Origin` отражается в `Access-Control-Allow-Origin`.

Методы, credentials и список заголовков в коде приложения не заданы. У плагина тогда действуют его значения по умолчанию: методы `GET,HEAD,POST`, `credentials: false`. Заголовки preflight, которые просит браузер, плагин отражает.

В dev интерфейс ходит на origin Vite (`/api` на порту 5173). До backend запрос доходит уже с прокси, браузерный CORS на этом пути не участвует. Подробнее: [auth-and-security.md](./auth-and-security.md), [integrations.md](./integrations.md).

## Проверки в `index.ts`

| Маршрут | Что проверяется |
| --- | --- |
| `POST /tasks` | Пустое тело заменяется на `{ title: "" }`. Дальше решает `createTask`. Исключение становится 400 |
| `PATCH /tasks/:id` | Пустое тело заменяется на `{}`. Нет строки — 404. Исключение — 400 |
| `PUT /tasks/reorder` | `items` должен быть непустым массивом, иначе 400 `items array is required`. Исключение из `reorderTasks` — 400 |
| `GET /tasks/:id`, `DELETE /tasks/:id` | Нет строки — 404 `{ "error": "Task not found" }` |

## Проверки в `db.ts`

- `title` обрезается через `trim`. Пустая строка — ошибка `Title is required` (создание и обновление).
- `description` обрезается. Если при создании поля нет — сохраняется пустая строка.
- `status` при создании по умолчанию `todo`. Допустимы только значения `TASK_STATUSES` из `@repo/shared`: `todo`, `in_progress`, `done`. Иначе ошибка `Invalid status: <значение>`.
- `id` новой задачи генерирует сервер (`randomUUID`). В `CreateTaskInput` поля `id` нет.
- `reorderTasks` для каждого элемента проверяет статус и наличие строки. Чужой `id` даёт ошибку `Task not found: <id>`. Маршрут отвечает на неё 400. Запись идёт одной транзакцией: при любой ошибке `ROLLBACK`.

Логгер Fastify включён (`logger: true`). Других общих фильтров нет.
