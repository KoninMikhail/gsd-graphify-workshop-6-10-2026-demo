# Ошибки HTTP

Глобального обработчика исключений в приложении нет. Код и тело ответа выставляет обработчик конкретного маршрута в `apps/backend/src/index.ts`.

Тело ошибки, которое ставит этот код: `{ "error": "<текст>" }`.

## Коды

| Ситуация | Код | Тело |
| --- | --- | --- |
| `POST /tasks`, задача создана | 201 | объект задачи |
| `DELETE /tasks/:id`, строка удалена | 204 | пустое |
| `GET`, `PATCH` или `DELETE`, задачи нет | 404 | `{ "error": "Task not found" }` |
| Некорректный вход на `POST /tasks`, `PATCH /tasks/:id`, `PUT /tasks/reorder` | 400 | `{ "error": "<сообщение>" }` |

Остальные успешные ответы — 200: `GET /health` (`{ "ok": true }`), `GET /tasks`, `GET /tasks/:id`, успешные `PATCH`, `PUT /tasks/reorder`, `POST /tasks/reset`.

`setErrorHandler` не регистрируется. У `GET /health`, `GET /tasks` и `POST /tasks/reset` своего `try/catch` нет.

Если `listen` падает, процесс пишет ошибку в лог Fastify и завершается с кодом 1.

## Текст ответа 400

Маршрут перехватывает исключение и кладёт в `error` поле `message`. Если выброшено не `Error`, подставляется запасная строка: `Invalid task` для `POST` и `PATCH`, `Invalid reorder payload` для `PUT /tasks/reorder`.

| Условие | Сообщение | Ответ |
| --- | --- | --- |
| `items` у reorder не массив или массив пуст | `items array is required` | 400 сразу в маршруте |
| `title` после `trim` пустой | `Title is required` | 400 на create и update |
| `status` не из `todo`, `in_progress`, `done` | `Invalid status: <значение>` | 400 на create, update и reorder |
| В reorder нет задачи с таким `id` | `Task not found: <id>` | 400. Это не ответ 404 |

`PATCH` отсутствующей задачи не бросает исключение: `updateTask` возвращает `undefined`, маршрут отвечает 404. `DELETE` смотрит на `changes`: если строка не удалена, тоже 404.

Схемы Fastify (`schema`) на маршрутах нет.

## Клиент

`apps/frontend/src/api.ts` при `response.ok === false` читает JSON и берёт поле `error`, иначе `message`. Если тело не JSON, текст — `Request failed (<status>)`. Ответ 204 как JSON не разбирается.
