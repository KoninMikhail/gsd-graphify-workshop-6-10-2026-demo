# Project brief

**gsd-graphify-workshop** — демо-репозиторий воркшопа: канбан из трёх колонок. Имя пакета в корневом `package.json` и константа `WORKSHOP_NAME` в `packages/shared` совпадают: `gsd-graphify-workshop`.

Монорепозиторий на **npm workspaces** (`apps/*`, `packages/*`) и **Turborepo**.

| Пакет | Путь | Роль |
| --- | --- | --- |
| `@repo/frontend` | `apps/frontend` | Доска: React 19, Vite 6, `@dnd-kit` |
| `@repo/backend` | `apps/backend` | HTTP API: Fastify 5, SQLite |
| `@repo/shared` | `packages/shared` | Общие типы и статусы задач |
| `@repo/typescript-config` | `packages/typescript-config` | Базовые `tsconfig` (`base`, `node`, `react`) |

Пользователь добавляет карточку, перетаскивает её между колонками, удаляет и может вернуть три демо-задачи. Данные живут в файле `apps/backend/data/tasks.db`.

В коде нет аутентификации, файла OpenAPI, тест-раннера, Dockerfile и конфигурации CI. Платформа деплоя в репозитории не задана.

См. [product-context.md](./product-context.md), [tech-stack.md](./tech-stack.md), [architecture.md](./architecture.md).
