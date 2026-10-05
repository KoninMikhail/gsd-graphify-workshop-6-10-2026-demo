# Codebase map

Исходники приложения — TypeScript. Unit-тесты frontend: `apps/frontend/src/*.test.ts` (сейчас `report.test.ts`). Backend и shared без тестов.

## Frontend — `apps/frontend/src`

| Файл | Роль |
| --- | --- |
| `main.tsx` | `createRoot` на `#root`, `StrictMode`, импорт `styles.css` |
| `App.tsx` | Состояние доски, drag-and-drop, создание, удаление, reset, кнопка Export markdown |
| `report.ts` | Сборка и скачивание `task-board.md` из задач на экране |
| `report.test.ts` | Vitest: секции, описание, пустая колонка, порядок `position` |
| `api.ts` | `fetch` на префикс `/api` |
| `components/Column.tsx` | Колонка-droppable, `SortableContext` |
| `components/SortableTask.tsx` | Обёртка `useSortable` |
| `components/TaskCard.tsx` | Карточка: заголовок, описание, ручка, Delete |
| `styles.css` | Стили доски |
| `vite.config.ts` | Порт 5173 и proxy `/api` |

Точка HTML: `apps/frontend/index.html`.

## Backend — `apps/backend/src`

| Файл | Роль |
| --- | --- |
| `index.ts` | Fastify, CORS, маршруты, `listen` |
| `db.ts` | `DatabaseSync`, схема, CRUD, seed, reset, reorder |

Файл БД: `apps/backend/data/tasks.db`. Каталог `apps/backend/data/` в `.gitignore`. Каталог создаётся при старте (`mkdirSync`).

## Shared — `packages/shared/src/index.ts`

Экспорт: `WORKSHOP_NAME`, `TASK_STATUSES`, `TaskStatus`, `Task`, `CreateTaskInput`, `UpdateTaskInput`, `ReorderTasksInput`, `COLUMN_LABELS`.

Потребители импортируют `@repo/shared`. Поле `exports` пакета смотрит на `dist/index.js` и `dist/index.d.ts`, поэтому перед проверкой типов зависимых пакетов нужен build shared (Turbo делает это через `^build`).

## Конфиги

| Путь | Роль |
| --- | --- |
| `package.json`, `turbo.json` | Workspaces и задачи Turbo |
| `packages/typescript-config/*.json` | Общие опции `tsc` |
| `apps/*/tsconfig.json`, `packages/shared/tsconfig.json` | Проектные tsconfig |

См. [architecture.md](./architecture.md), [routes](../03-reference/routes-catalog.md), [entities](../03-reference/entities-catalog.md), [services](../03-reference/services-catalog.md).
