# Локальная инфраструктура

Для запуска доски нужен Node.js (и npm). Единственная локальная зависимость помимо Node — файл SQLite. Его создаёт backend, отдельно поднимать базу не нужно.

**См. также:** [local-setup.md](./local-setup.md), [persistence-and-database.md](../01-architecture/persistence-and-database.md), [infra-context.md](../_ai/infra-context.md).

## Файл базы

При старте `apps/backend/src/db.ts`:

1. Считает путь `apps/backend/data/tasks.db` (каталог `data` рядом с исходниками и с `dist`).
2. Создаёт каталог, если его нет.
3. Открывает файл через `node:sqlite` (`DatabaseSync`).
4. Включает `PRAGMA journal_mode = WAL` и `PRAGMA foreign_keys = ON`.
5. Создаёт таблицу `tasks`, если её ещё нет.
6. Если таблица пустая, записывает три демо-задачи (`seedIfEmpty`).

Файл остаётся между перезапусками. Карточки, которые вы создали в UI, лежат в нём.

Один и тот же путь используется и в `tsx watch` (`src/index.ts`), и в `node dist/index.js`: оба раза каталог данных — `apps/backend/data/`.

## Сброс демо-данных

`resetToDemo` очищает таблицу и снова вставляет три задачи:

- `POST http://localhost:3001/tasks/reset`
- через Vite: `POST http://localhost:5173/api/tasks/reset`

Ответ — текущий список задач. Контракт — [domains/tasks.md](../03-reference/domains/tasks.md).

## Что слушает процессы

| Процесс | Адрес по умолчанию |
| --- | --- |
| Vite (`@repo/frontend`) | `http://localhost:5173` |
| Fastify (`@repo/backend`) | `http://0.0.0.0:3001` |

Меняются только `PORT` и `HOST` у backend. Прокси Vite по-прежнему целится в `http://localhost:3001`, пока вы не поправите `apps/frontend/vite.config.ts`. Переменные — [env-and-config.md](../03-reference/env-and-config.md).
