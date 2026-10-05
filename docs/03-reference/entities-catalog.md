# Каталог сущностей

Хранилище одно: таблица `tasks` в SQLite. Файл создаётся в `apps/backend/src/db.ts` через `node:sqlite` (`DatabaseSync`).

Путь к файлу: `join(dirname(модуля db), "..", "data", "tasks.db")`. И для запуска из `src/` (`tsx`), и для запуска из `dist/` это `apps/backend/data/tasks.db`. Каталог создаётся при старте (`mkdirSync`, `recursive`).

При открытии выполняются `PRAGMA journal_mode = WAL` и `PRAGMA foreign_keys = ON`. Таблица создаётся выражением `CREATE TABLE IF NOT EXISTS`.

## tasks

| Колонка | Тип в SQL | Ограничения |
| --- | --- | --- |
| `id` | `TEXT` | `PRIMARY KEY` |
| `title` | `TEXT` | `NOT NULL` |
| `description` | `TEXT` | `NOT NULL DEFAULT ''` |
| `status` | `TEXT` | `NOT NULL`, `CHECK (status IN ('todo', 'in_progress', 'done'))` |
| `position` | `INTEGER` | `NOT NULL` |
| `created_at` | `TEXT` | `NOT NULL` |
| `updated_at` | `TEXT` | `NOT NULL` |

В JSON поле `created_at` называется `createdAt`, `updated_at` — `updatedAt` (функция `mapRow` в `db.ts`, тип `Task` в `@repo/shared`).

`id` — `randomUUID()`. Время — `new Date().toISOString()`.

Других таблиц код не создаёт.
