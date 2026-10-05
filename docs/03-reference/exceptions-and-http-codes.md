# Ошибки и HTTP-коды

Глобального обработчика исключений нет. Коды выставляет обработчик маршрута в `apps/backend/src/index.ts` через `reply.code(...)`. Успешный `return` без `reply.code` даёт 200.

Тело ошибки: `{ "error": "<строка>" }`.

## Коды, которые есть в коде

| Код | Где |
| --- | --- |
| 200 | `GET /health`, `GET /tasks`, `POST /tasks/reset`, `PUT /tasks/reorder`, `GET /tasks/:id`, `PATCH /tasks/:id` — код в обработчике не задаётся |
| 201 | `POST /tasks` |
| 204 | `DELETE /tasks/:id` при удалении. Тело пустое (`send()` без JSON) |
| 400 | `PUT /tasks/reorder`, `POST /tasks`, `PATCH /tasks/:id` |
| 404 | `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id` — текст `"Task not found"` |

## Тексты 400

Заданы прямо в маршруте:

| Маршрут | Текст |
| --- | --- |
| `PUT /tasks/reorder` | `"items array is required"` — `items` не массив или длина 0 |
| `PUT /tasks/reorder` | `"Invalid reorder payload"` — пойманное значение не является `Error` |
| `POST /tasks`, `PATCH /tasks/:id` | `"Invalid task"` — пойманное значение не является `Error` |

Приходят из `throw new Error` в `db.ts` и попадают в ответ как `error.message`:

| Функция | Текст | Какой маршрут отдаёт его как 400 |
| --- | --- | --- |
| `assertStatus` | ``Invalid status: ${status}`` | `POST /tasks`, `PATCH /tasks/:id`, `PUT /tasks/reorder` |
| `createTask`, `updateTask` | `"Title is required"` | `POST /tasks`, `PATCH /tasks/:id` |
| `reorderTasks` | ``Task not found: ${item.id}`` | `PUT /tasks/reorder` |

Отсутствующая задача при перестановке — это 400 с текстом `Task not found: <id>`, не 404. 404 с текстом `"Task not found"` возвращают только `GET`, `PATCH` и `DELETE` по `:id`.

Клиент (`apps/frontend/src/api.ts`) при `!response.ok` читает JSON и берёт поле `error`, иначе `message`, иначе строку `Request failed (<status>)`. Ответ 204 возвращается как `undefined` без разбора тела.
