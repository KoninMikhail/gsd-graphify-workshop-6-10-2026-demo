# Data flow

Цепочка dev-режима: браузер → Vite (5173) → Fastify (3001) → файл SQLite.

## Запрос с доски

1. `apps/frontend/src/api.ts` вызывает `fetch("/api" + path)`. Тело JSON, если оно есть; `Content-Type: application/json` выставляется автоматически.
2. Vite (`server.proxy`) переписывает путь: `/api/tasks` → `/tasks` на `http://localhost:3001`.
3. Fastify в `apps/backend/src/index.ts` вызывает функцию из `db.ts`.
4. `node:sqlite` `DatabaseSync` читает или пишет `apps/backend/data/tasks.db`.
5. Ответ — JSON задачи или массива. `DELETE` при успехе отвечает **204** без тела. Клиент на 204 возвращает `undefined`.
6. При `!response.ok` клиент берёт `error` или `message` из JSON и бросает `Error`. Иначе текст `Request failed (<status>)`.

## Оптимистичные действия UI

- **Создание.** `POST /tasks` после успеха добавляет карточку в локальный список.
- **Удаление.** Карточка скрывается сразу; при ошибке список откатывается.
- **Перетаскивание.** На `dragOver` карточка переезжает между колонками локально. На `dragEnd` доска выравнивает `position` с 0 внутри каждой колонки и шлёт `PUT /tasks/reorder`. Ответ сервера заменяет список. При ошибке UI снова вызывает `GET /tasks`.

`GET /tasks` на сервере сортирует по статусу (`todo`, `in_progress`, `done`), затем `position`, затем `created_at`. На клиенте колонка дополнительно сортируется по `position`.

## Старт backend

`seedIfEmpty()` считает строки. Если их ноль, вставляются три демо-задачи. Иначе файл не трогается.

`POST /tasks/reset` делает `DELETE FROM tasks` и заново вставляет тот же набор.

## Reorder

`reorderTasks` открывает `BEGIN`. Для каждого элемента проверяет статус и наличие id, затем `UPDATE` статуса, позиции и `updated_at`. Ошибка → `ROLLBACK`. Успех → `COMMIT` и `listTasks()`.

См. [domains.md](./domains.md), [persistence](../01-architecture/persistence-and-database.md), [errors](../01-architecture/error-handling.md), [HTTP-коды](../03-reference/exceptions-and-http-codes.md).
