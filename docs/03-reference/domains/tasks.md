# Домен tasks

Канбан из трёх колонок. Статусы зафиксированы в `packages/shared/src/index.ts`: `todo`, `in_progress`, `done`.

Сервер хранит карточки в SQLite и отдаёт их JSON. Клиент читает ту же модель из `@repo/shared`.

## Состав

| Слой | Файл |
| --- | --- |
| Маршруты | `apps/backend/src/index.ts` |
| Хранилище | `apps/backend/src/db.ts` |
| Типы | `packages/shared/src/index.ts` |
| HTTP-клиент | `apps/frontend/src/api.ts` |
| Прокси dev | `apps/frontend/vite.config.ts` |

## Модель

`Task`:

| Поле JSON | Смысл |
| --- | --- |
| `id` | UUID, выдаёт сервер |
| `title` | Непустой текст после `trim` |
| `description` | Строка, по умолчанию `""` |
| `status` | `todo`, `in_progress` или `done` |
| `position` | Порядок внутри колонки, с нуля |
| `createdAt` | ISO-время создания |
| `updatedAt` | ISO-время последнего изменения |

Вход создания (`CreateTaskInput`): обязательный `title`, необязательные `description` и `status`.

Вход правки (`UpdateTaskInput`): любое из `title`, `description`, `status`, `position`.

Вход перестановки (`ReorderTasksInput`): непустой `items`. Элемент — `id`, `status`, `position`.

## Жизненный цикл

При загрузке `db.ts` открывает `apps/backend/data/tasks.db`, создаёт таблицу `tasks`, если её нет. Схема колонок — [../entities-catalog.md](../entities-catalog.md).

Сразу после импортов `index.ts` вызывает `seedIfEmpty()`. Пустая таблица получает три демо-карточки:

1. Sketch the board layout — `todo`
2. Wire Fastify routes — `in_progress`
3. Demo drag and drop — `done`

`POST /tasks/reset` стирает таблицу и записывает тот же набор заново.

Новая карточка получает `position` в конце своей колонки: `COALESCE(MAX(position), -1) + 1` по `status`. Список (`GET /tasks` и ответ `reorder` / `reset`) сортируется колонками `todo` → `in_progress` → `done`, внутри колонки по `position`, затем по `created_at`.

## Маршруты

Префикса на сервере нет. Браузер добавляет `/api`; Vite в dev этот префикс снимает.

| Действие | Метод и путь | Успех |
| --- | --- | --- |
| Проверка процесса | `GET /health` | 200 `{ ok: true }` |
| Список | `GET /tasks` | 200, массив |
| Создать | `POST /tasks` | 201, объект |
| Прочитать одну | `GET /tasks/:id` | 200, объект |
| Изменить | `PATCH /tasks/:id` | 200, объект |
| Удалить | `DELETE /tasks/:id` | 204 |
| Переставить | `PUT /tasks/reorder` | 200, массив |
| Вернуть демо | `POST /tasks/reset` | 200, массив |

`/tasks/reset` и `/tasks/reorder` зарегистрированы раньше `/tasks/:id`.

Клиент в `api.ts` вызывает все пути, кроме `/health` и `GET /tasks/:id`.

## Ошибки домена

| Ситуация | Код | Текст `error` |
| --- | --- | --- |
| Нет карточки на `GET`, `PATCH`, `DELETE` `/:id` | 404 | `Task not found` |
| Пустой заголовок при создании или правке | 400 | `Title is required` |
| Статус вне трёх значений | 400 | `Invalid status: …` |
| Пустой или не-массив `items` | 400 | `items array is required` |
| В `items` нет такого `id` | 400 | `Task not found: <id>` |

Перестановка идёт одной транзакцией. Любая ошибка элемента откатывает всю пачку (`ROLLBACK`), затем маршрут отвечает 400.

Полный перечень кодов — [../exceptions-and-http-codes.md](../exceptions-and-http-codes.md). Функции по одной — [../services-catalog.md](../services-catalog.md).
