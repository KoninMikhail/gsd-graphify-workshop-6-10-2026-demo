# Хранение данных

Единственное хранилище — файл SQLite. Инструмента миграций нет: схема создаётся при старте оператором `CREATE TABLE IF NOT EXISTS`.

Код: `apps/backend/src/db.ts`. Драйвер: `node:sqlite`, класс `DatabaseSync`.

## Файл

Путь считается так: `join(каталог модуля db.ts, "..", "data", "tasks.db")`. При запуске из `apps/backend/src` это `apps/backend/data/tasks.db`. Каталог `data` создаётся через `mkdirSync` с `recursive: true`.

При открытии соединения:

- `PRAGMA journal_mode = WAL`
- `PRAGMA foreign_keys = ON`

Внешних ключей в таблице нет. Отдельных индексов нет, только первичный ключ `id`.

## Таблица `tasks`

| Колонка | Тип | Ограничение |
| --- | --- | --- |
| `id` | TEXT | PRIMARY KEY. Для новой строки — `randomUUID()` |
| `title` | TEXT | NOT NULL |
| `description` | TEXT | NOT NULL, по умолчанию пустая строка |
| `status` | TEXT | NOT NULL. CHECK: `todo`, `in_progress`, `done` |
| `position` | INTEGER | NOT NULL. Порядок внутри одного статуса |
| `created_at` | TEXT | NOT NULL. Время в ISO-строке |
| `updated_at` | TEXT | NOT NULL. Время в ISO-строке |

В JSON те же метки времени называются `createdAt` и `updatedAt`.

## Порядок выборки

`listTasks` сортирует строки так:

1. статус: `todo`, затем `in_progress`, затем `done`;
2. `position` по возрастанию;
3. `created_at` по возрастанию.

Новая задача получает `position = COALESCE(MAX(position), -1) + 1` среди строк того же статуса.

## Запись порядка

`reorderTasks` в одной транзакции (`BEGIN` / `COMMIT`, при ошибке `ROLLBACK`) обновляет у каждого элемента `status`, `position` и `updated_at`. После коммита возвращает полный список через `listTasks()`.

`updateTask` записывает `position` из тела `PATCH`, если поле передано.

## Демо-данные

`seedIfEmpty` вызывается из `apps/backend/src/index.ts` до `listen`. Если `COUNT(*)` равен 0, вставляются три задачи:

| title | status |
| --- | --- |
| Sketch the board layout | `todo` |
| Wire Fastify routes | `in_progress` |
| Demo drag and drop | `done` |

`resetToDemo` выполняет `DELETE FROM tasks` и вставляет тот же набор. Вызов идёт по HTTP `POST /tasks/reset`, это не фоновая задача.
