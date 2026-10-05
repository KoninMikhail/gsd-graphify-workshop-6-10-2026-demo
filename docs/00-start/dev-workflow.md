# Рабочий процесс

Ежедневные команды для доски gsd-graphify-workshop. Запускать из корня репозитория.

**См. также:** [local-setup.md](./local-setup.md), [common-issues.md](./common-issues.md), [workflow.md](../_ai/workflow.md), [ci-and-scripts.md](../02-tooling/ci-and-scripts.md).

## Команды

Корневой `package.json`:

| Команда | Что делает |
| --- | --- |
| `npm install` | Ставит зависимости workspaces `apps/*` и `packages/*` |
| `npm run dev` | `turbo run dev` — Vite :5173, Fastify :3001, watch типов `@repo/shared` |
| `npm run build` | `turbo run build` — сборка с `dependsOn: ["^build"]`, артефакты `dist/**` |
| `npm run lint` | `turbo run lint` — в пакетах это `tsc --noEmit` |
| `npm run typecheck` | `turbo run typecheck` — тот же `tsc --noEmit` отдельной задачей Turbo |

`lint` и `typecheck` зависят от сборки зависимостей (`^build`), чтобы типы `@repo/shared` брались из `packages/shared/dist`.

Поле `packageManager` — `npm@11.13.0`.

Проверки перед существенной правкой:

```bash
npm run typecheck
npm run lint
npm run build
```

Что считается проверкой в этом репозитории — [testing.md](../_ai/testing.md).

## Куда класть код

| Что | Куда |
| --- | --- |
| UI доски, колонки, drag-and-drop | `apps/frontend` (`@repo/frontend`) |
| Маршруты Fastify | `apps/backend/src/index.ts` |
| SQLite и операции с задачами | `apps/backend/src/db.ts` |
| Типы `Task`, статусы, DTO | `packages/shared/src/index.ts` (`@repo/shared`) |

Frontend и backend зависят от `@repo/shared`. Направление данных: браузер → Vite `/api` → Fastify → файл SQLite. Схема — [data-flow.md](../_ai/data-flow.md), карта каталогов — [codebase-map.md](../_ai/codebase-map.md).

Статусы колонок: `todo`, `in_progress`, `done` (`TASK_STATUSES` в `@repo/shared`).

## Что обновлять вместе с кодом

| Изменение | Документ |
| --- | --- |
| Новый или изменённый маршрут | [routes-catalog.md](../03-reference/routes-catalog.md), [domains/tasks.md](../03-reference/domains/tasks.md) |
| Поле задачи или таблица | [entities-catalog.md](../03-reference/entities-catalog.md) |
| `PORT` / `HOST` или прокси | [env-and-config.md](../03-reference/env-and-config.md) |
| Правило, которое меняет устройство демо | [docs/adr/README.md](../adr/README.md) |
| Термин для агентов | [search-index.md](../_ai/search-index.md) |

Обзор справочника — [reading-guide.md](../03-reference/reading-guide.md).

## Навигация по коду

Ориентир по графу воркшопа — [graphify.md](../02-tooling/graphify.md). Архитектура слоёв — [architecture.md](../_ai/architecture.md).
