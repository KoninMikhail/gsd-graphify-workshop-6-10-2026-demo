# Каталог маршрутов

Источник: `apps/backend/src/index.ts`. Других файлов маршрутов в `apps/backend/src/` нет.

Успех без `reply.code(...)` — ответ Fastify со статусом 200 и JSON-телом, которое вернул обработчик. Ошибка — JSON `{ "error": "<текст>" }`.

`POST /tasks/reset` и `PUT /tasks/reorder` объявлены раньше `GET /tasks/:id`, поэтому `reset` и `reorder` не попадают в параметр `:id`.

CORS: `origin: true`. Отдельной аутентификации в файле маршрутов нет.

| Метод | Путь | Успех | Ошибки в коде |
| --- | --- | --- | --- |
| `GET` | `/health` | 200 `{ ok: true }` | нет |
| `GET` | `/tasks` | 200, `Task[]` из `listTasks()` | нет |
| `POST` | `/tasks/reset` | 200, `Task[]` из `resetToDemo()` | нет |
| `PUT` | `/tasks/reorder` | 200, `Task[]` из `reorderTasks()` | 400 |
| `GET` | `/tasks/:id` | 200, `Task` | 404 |
| `POST` | `/tasks` | 201, `Task` | 400 |
| `PATCH` | `/tasks/:id` | 200, `Task` | 400, 404 |
| `DELETE` | `/tasks/:id` | 204, пустое тело | 404 |

## Условия ошибок

`PUT /tasks/reorder`, код 400:

- `items` отсутствует, не массив или пустой массив — `"items array is required"`. Тело читается как `request.body?.items ?? []`.
- исключение из `reorderTasks` — текст `Error.message`, иначе `"Invalid reorder payload"`.

`GET /tasks/:id`, код 404: записи нет — `"Task not found"`.

`POST /tasks`, код 400: исключение из `createTask` — текст `Error.message`, иначе `"Invalid task"`. Успех явно выставляется как 201. Пустое тело заменяется на `{ title: "" }`.

`PATCH /tasks/:id`:

- 404 — `updateTask` вернул пустой результат — `"Task not found"`.
- 400 — исключение из `updateTask` — текст `Error.message`, иначе `"Invalid task"`. Пустое тело заменяется на `{}`.

`DELETE /tasks/:id`, код 404: `deleteTask` вернул `false` — `"Task not found"`.

Тексты, которые `db.ts` кладёт в `Error.message` и которые эти обработчики отдают как 400, перечислены в [exceptions-and-http-codes.md](./exceptions-and-http-codes.md).

Сбой `app.listen` не является HTTP-ответом: ошибка пишется в лог, процесс завершается с кодом 1.
