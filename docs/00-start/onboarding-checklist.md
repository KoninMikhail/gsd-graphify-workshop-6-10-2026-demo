# Чеклист онбординга

Первый запуск kanban-доски gsd-graphify-workshop. Команды — из корня репозитория.

## Контекст

- [ ] [`docs/_ai/README.md`](../_ai/README.md) — порядок Memory Bank
- [ ] [project-brief.md](../_ai/project-brief.md) → [product-context.md](../_ai/product-context.md) → [tech-stack.md](../_ai/tech-stack.md) → [architecture.md](../_ai/architecture.md)
- [ ] [search-index.md](../_ai/search-index.md) — куда смотреть по слову
- [ ] [codebase-map.md](../_ai/codebase-map.md) и [data-flow.md](../_ai/data-flow.md)

## Запуск

- [ ] Node.js и npm доступны (`packageManager`: `npm@11.13.0`)
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] `http://localhost:5173` — три колонки и демо-карточки
- [ ] `http://localhost:3001/health` — `{ "ok": true }`
- [ ] Файл `apps/backend/data/tasks.db` появился сам — [local-infra-options.md](./local-infra-options.md)

## Код доски

- [ ] Статусы `todo` / `in_progress` / `done` в `packages/shared/src/index.ts`
- [ ] Маршруты в `apps/backend/src/index.ts` — [routes-catalog.md](../03-reference/routes-catalog.md)
- [ ] SQL в `apps/backend/src/db.ts` — [entities-catalog.md](../03-reference/entities-catalog.md), [persistence-and-database.md](../01-architecture/persistence-and-database.md)
- [ ] Клиент `/api` — `apps/frontend/src/api.ts` и прокси в `apps/frontend/vite.config.ts`
- [ ] Домен: [domains/README.md](../03-reference/domains/README.md) → [domains/tasks.md](../03-reference/domains/tasks.md)

## Перед первой правкой

- [ ] [dev-workflow.md](./dev-workflow.md) и [common-issues.md](./common-issues.md)
- [ ] `npm run typecheck`, `npm run lint`, `npm run build`
- [ ] Контракт или env изменились — обновить справочник и [search-index.md](../_ai/search-index.md)

## Куда смотреть

| Тема | Документ |
| --- | --- |
| Поиск по слову | [search-index.md](../_ai/search-index.md) |
| Как читать справочник | [reading-guide.md](../03-reference/reading-guide.md) |
| Архитектура | [01-architecture/README.md](../01-architecture/README.md) |
| Домен задач | [domains/tasks.md](../03-reference/domains/tasks.md) |
| Маршруты | [routes-catalog.md](../03-reference/routes-catalog.md) |
| Таблица `tasks` | [entities-catalog.md](../03-reference/entities-catalog.md) |
| Коды HTTP | [exceptions-and-http-codes.md](../03-reference/exceptions-and-http-codes.md) |
| `PORT` и `HOST` | [env-and-config.md](../03-reference/env-and-config.md) |
| Логи и health | [observability.md](../04-ops/observability.md) |
| Runbooks | [runbooks/README.md](../04-ops/runbooks/README.md) |
