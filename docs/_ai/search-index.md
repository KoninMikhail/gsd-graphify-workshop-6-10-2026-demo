# Search index

Ссылки только на файлы карты документации этого репозитория. Если поведения в коде нет, это сказано в целевом файле, а не выдумано здесь.

## Продукт и код

| Ключ | Куда |
| --- | --- |
| доска, канбан, колонки, drag-and-drop | [product-context.md](./product-context.md), [codebase-map.md](./codebase-map.md), [tasks](../03-reference/domains/tasks.md) |
| `WORKSHOP_NAME`, `TASK_STATUSES`, `Task` | [domain-context.md](./domain-context.md), [codebase-map.md](./codebase-map.md) |
| маршруты `/tasks`, `/health` | [domains.md](./domains.md), [routes](../03-reference/routes-catalog.md), [api-domains](../03-reference/api-domains.md) |
| SQLite, `tasks.db`, WAL | [data-flow.md](./data-flow.md), [infra-context.md](./infra-context.md), [persistence](../01-architecture/persistence-and-database.md), [entities](../03-reference/entities-catalog.md) |
| proxy `/api`, порт 5173, порт 3001 | [architecture.md](./architecture.md), [data-flow.md](./data-flow.md), [env](../03-reference/env-and-config.md) |
| Fastify, CORS, ошибки 400/404/204 | [architecture.md](./architecture.md), [exceptions](../03-reference/exceptions-and-http-codes.md), [error-handling](../01-architecture/error-handling.md) |
| где какой файл | [codebase-map.md](./codebase-map.md), [services](../03-reference/services-catalog.md) |
| npm, turbo, lint, typecheck | [tech-stack.md](./tech-stack.md), [workflow.md](./workflow.md), [ci-and-scripts](../02-tooling/ci-and-scripts.md) |
| тесты | [testing.md](./testing.md) |
| один репозиторий | [ecosystem-context.md](./ecosystem-context.md) |
| запуск локально | [00-start](../00-start/README.md), [local-setup](../00-start/local-setup.md), [common-issues](../00-start/common-issues.md) |

## Возможности, которых нет в коде

| Ключ | Факт | Куда |
| --- | --- | --- |
| auth, сессии, роли | Входа нет | [auth](../01-architecture/auth-and-security.md), [ecosystem-context.md](./ecosystem-context.md) |
| OpenAPI | Файла спецификации нет | [api-design](../01-architecture/api-design-and-openapi.md) |
| SSE, WebSocket | Доска ходит обычным HTTP | [events](../01-architecture/events-and-realtime.md) |
| планировщики | Фоновых заданий нет | [schedulers](../01-architecture/schedulers-and-jobs.md) |
| внешние API | Кроме шрифтов Google в `index.html` интеграций нет | [integrations](../01-architecture/integrations.md) |
| CI, Docker, деплой | В репозитории не описаны | [infra-context.md](./infra-context.md), [ci-and-scripts](../02-tooling/ci-and-scripts.md), [observability](../04-ops/observability.md) |
| graphify-out, `.planning/` | Каталогов нет | [graphify](../02-tooling/graphify.md), [project-brief.md](./project-brief.md) |
| политики | Отдельного слоя политик нет; проверки — в `db.ts` | [policies](../01-architecture/cross-cutting-policies.md) |

## Оглавления

[docs/README](../README.md), [чтение справочника](../03-reference/reading-guide.md), [домены](../03-reference/domains/README.md), [ops](../04-ops/README.md), [runbooks](../04-ops/runbooks/README.md), [ADR](../adr/README.md), [workflow разработки](../00-start/dev-workflow.md), [онбординг](../00-start/onboarding-checklist.md), [локальная инфра](../00-start/local-infra-options.md), [тулинг](../02-tooling/README.md), [архитектура](../01-architecture/README.md).
