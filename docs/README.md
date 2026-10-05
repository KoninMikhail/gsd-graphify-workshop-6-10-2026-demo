# Документация gsd-graphify-workshop

Карта каталога `docs/` для разработчиков и AI-агентов. Сжатый снимок для агентов — Memory Bank [`docs/_ai/`](./_ai/README.md).

Репозиторий — учебная kanban-доска для воркшопа graphify. Колонки: `todo`, `in_progress`, `done`. Монорепозиторий: npm workspaces (`apps/*`, `packages/*`) и Turborepo. Пакеты: `@repo/frontend` (React 19 + Vite), `@repo/backend` (Fastify + SQLite), `@repo/shared` (общие типы).

## Быстрый старт

| Куда | Зачем |
| --- | --- |
| [`docs/_ai/README.md`](./_ai/README.md) | Порядок чтения Memory Bank |
| [`docs/00-start/README.md`](./00-start/README.md) | Онбординг |
| [`docs/00-start/local-setup.md`](./00-start/local-setup.md) | `npm install` и `npm run dev` |

## Структура

| Каталог | Назначение |
| --- | --- |
| [`docs/_ai/`](./_ai/README.md) | **Memory Bank** — сжатый снимок этого демо для агентов |
| [`docs/00-start/`](./00-start/README.md) | Локальный запуск доски и ежедневные команды |
| [`docs/01-architecture/`](./01-architecture/README.md) | Клиент, API, SQLite и сквозные правила |
| [`docs/02-tooling/`](./02-tooling/README.md) | Скрипты npm/Turborepo и graphify |
| [`docs/03-reference/`](./03-reference/README.md) | Маршруты задач, сущность, конфигурация |
| [`docs/04-ops/`](./04-ops/README.md) | Наблюдаемость и runbooks |
| [`docs/adr/`](./adr/README.md) | Архитектурные решения этого демо |

Новые документы — в `docs/00–04/` или `docs/adr/`.

## Два уровня документации

| Аудитория | Где | Формат |
| --- | --- | --- |
| AI-агенты | `docs/_ai/` | Сжатые снимки, фиксированный порядок чтения |
| Разработчики | `docs/00–04/`, `docs/adr/` | Гайды, справочники, ADR |

## Memory Bank

Вход — [`docs/_ai/README.md`](./_ai/README.md).

| Файл | Тема |
| --- | --- |
| [`project-brief.md`](./_ai/project-brief.md) | Что это за репозиторий |
| [`product-context.md`](./_ai/product-context.md) | Доска и сценарии |
| [`tech-stack.md`](./_ai/tech-stack.md) | Node, npm, Turborepo, React, Fastify, SQLite |
| [`architecture.md`](./_ai/architecture.md) | Workspaces и слои |
| [`codebase-map.md`](./_ai/codebase-map.md) | Где лежит код |
| [`data-flow.md`](./_ai/data-flow.md) | Браузер → `/api` → Fastify → SQLite |
| [`search-index.md`](./_ai/search-index.md) | Ключевое слово → документ |
| [`workflow.md`](./_ai/workflow.md) | Команды и порядок работы |
| [`testing.md`](./_ai/testing.md) | Проверки `lint` / `typecheck` / `build` |
| [`domains.md`](./_ai/domains.md) | Домен задач |
| [`domain-context.md`](./_ai/domain-context.md) | Статусы и поля задачи |
| [`ecosystem-context.md`](./_ai/ecosystem-context.md) | Границы демо |
| [`infra-context.md`](./_ai/infra-context.md) | Локальный процесс и файл SQLite |

## 00-start

| Документ | Назначение |
| --- | --- |
| [`README.md`](./00-start/README.md) | Вход в онбординг |
| [`local-setup.md`](./00-start/local-setup.md) | Установка и адреса |
| [`local-infra-options.md`](./00-start/local-infra-options.md) | Файл `apps/backend/data/tasks.db` |
| [`dev-workflow.md`](./00-start/dev-workflow.md) | Команды из корня |
| [`common-issues.md`](./00-start/common-issues.md) | Порты, `npm install`, прокси `/api` |
| [`onboarding-checklist.md`](./00-start/onboarding-checklist.md) | Чеклист первого запуска |

## 01-architecture

Как устроена эта доска: React-клиент, Fastify, файл SQLite, типы в `@repo/shared`.

| Документ | Тема |
| --- | --- |
| [`README.md`](./01-architecture/README.md) | Обзор |
| [`persistence-and-database.md`](./01-architecture/persistence-and-database.md) | `node:sqlite`, таблица `tasks` |
| [`error-handling.md`](./01-architecture/error-handling.md) | Ответы 400 и 404 |
| [`api-design-and-openapi.md`](./01-architecture/api-design-and-openapi.md) | Контракт HTTP |
| [`events-and-realtime.md`](./01-architecture/events-and-realtime.md) | Обновление доски с клиента |
| [`cross-cutting-policies.md`](./01-architecture/cross-cutting-policies.md) | Сквозные правила |
| [`auth-and-security.md`](./01-architecture/auth-and-security.md) | CORS (`origin: true`) |
| [`integrations.md`](./01-architecture/integrations.md) | Границы процесса |
| [`schedulers-and-jobs.md`](./01-architecture/schedulers-and-jobs.md) | Фоновая работа |

## 02-tooling

| Документ | Тема |
| --- | --- |
| [`README.md`](./02-tooling/README.md) | Обзор тулинга |
| [`graphify.md`](./02-tooling/graphify.md) | Граф кода воркшопа |
| [`ci-and-scripts.md`](./02-tooling/ci-and-scripts.md) | `npm run dev`, `build`, `lint`, `typecheck` |

## 03-reference

| Документ | Тема |
| --- | --- |
| [`README.md`](./03-reference/README.md) | Обзор справочника |
| [`reading-guide.md`](./03-reference/reading-guide.md) | Как читать reference |
| [`api-domains.md`](./03-reference/api-domains.md) | Домен задач |
| [`routes-catalog.md`](./03-reference/routes-catalog.md) | Маршруты Fastify |
| [`entities-catalog.md`](./03-reference/entities-catalog.md) | Таблица `tasks` |
| [`services-catalog.md`](./03-reference/services-catalog.md) | Функции в `db.ts` |
| [`exceptions-and-http-codes.md`](./03-reference/exceptions-and-http-codes.md) | Коды ответов |
| [`env-and-config.md`](./03-reference/env-and-config.md) | `PORT`, `HOST` |
| [`domains/README.md`](./03-reference/domains/README.md) | Карта доменов |
| [`domains/tasks.md`](./03-reference/domains/tasks.md) | Задачи доски |

## 04-ops

| Документ | Тема |
| --- | --- |
| [`README.md`](./04-ops/README.md) | Обзор |
| [`observability.md`](./04-ops/observability.md) | Лог Fastify и `GET /health` |
| [`runbooks/README.md`](./04-ops/runbooks/README.md) | Короткие runbooks демо |

## Поиск по документации

| Инструмент | Назначение |
| --- | --- |
| [`docs/_ai/search-index.md`](./_ai/search-index.md) | Ключевое слово → документ |
| [`docs/03-reference/domains/README.md`](./03-reference/domains/README.md) | Домен задач |
| [`docs/03-reference/reading-guide.md`](./03-reference/reading-guide.md) | Уровни справочника |
