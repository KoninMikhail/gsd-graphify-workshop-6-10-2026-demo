# Memory Bank — gsd-graphify-workshop

Сжатый снимок **этого** репозитория для агентов. Подробная human-дока — в [`docs/`](../README.md); здесь только факты, которые нужны до чтения кода.

[`AGENTS.md`](../../AGENTS.md) содержит только служебное уведомление Turborepo о версии CLI. Проектных правил приложения там нет.

## Порядок чтения

| # | Файл | Назначение |
| --- | --- | --- |
| 1 | [README.md](./README.md) | Карта и порядок чтения |
| 2 | [project-brief.md](./project-brief.md) | Что это за демо |
| 3 | [product-context.md](./product-context.md) | Канбан-доска воркшопа |
| 4 | [tech-stack.md](./tech-stack.md) | Стек и команды |
| 5 | [architecture.md](./architecture.md) | Монорепо и путь запроса |
| 6 | [codebase-map.md](./codebase-map.md) | Где лежит код |
| 7 | [data-flow.md](./data-flow.md) | Браузер → Vite → Fastify → SQLite |

Дальше: [domains.md](./domains.md), [domain-context.md](./domain-context.md), [search-index.md](./search-index.md).

## Справочники в этом каталоге

| Файл | Назначение |
| --- | --- |
| [search-index.md](./search-index.md) | Ключевое слово → файл |
| [workflow.md](./workflow.md) | `npm` / Turbo-скрипты |
| [testing.md](./testing.md) | Проверки; автотестов нет |
| [ecosystem-context.md](./ecosystem-context.md) | Один репозиторий |
| [infra-context.md](./infra-context.md) | Локальный процесс и файл SQLite |

## Human-дока

| Раздел | Файлы |
| --- | --- |
| Старт | [00-start](../00-start/README.md), [local-setup](../00-start/local-setup.md), [dev-workflow](../00-start/dev-workflow.md), [onboarding-checklist](../00-start/onboarding-checklist.md), [local-infra-options](../00-start/local-infra-options.md), [common-issues](../00-start/common-issues.md) |
| Архитектура | [01-architecture](../01-architecture/README.md), [persistence](../01-architecture/persistence-and-database.md), [errors](../01-architecture/error-handling.md), [API](../01-architecture/api-design-and-openapi.md), [events](../01-architecture/events-and-realtime.md), [policies](../01-architecture/cross-cutting-policies.md), [auth](../01-architecture/auth-and-security.md), [integrations](../01-architecture/integrations.md), [schedulers](../01-architecture/schedulers-and-jobs.md) |
| Тулинг | [02-tooling](../02-tooling/README.md), [graphify](../02-tooling/graphify.md), [ci-and-scripts](../02-tooling/ci-and-scripts.md) |
| Справочник | [03-reference](../03-reference/README.md), [reading-guide](../03-reference/reading-guide.md), [api-domains](../03-reference/api-domains.md), [routes](../03-reference/routes-catalog.md), [entities](../03-reference/entities-catalog.md), [services](../03-reference/services-catalog.md), [HTTP](../03-reference/exceptions-and-http-codes.md), [env](../03-reference/env-and-config.md), [domains](../03-reference/domains/README.md), [tasks](../03-reference/domains/tasks.md) |
| Ops | [04-ops](../04-ops/README.md), [observability](../04-ops/observability.md), [runbooks](../04-ops/runbooks/README.md) |
| ADR | [docs/adr](../adr/README.md) |

Граф знаний лежит в `graphify-out/`. Каталога `.planning/` нет.

## Актуальность

Обновлять `docs/_ai/` при смене стека, маршрутов или схемы `tasks`. Решения, если появятся, фиксировать в [architecture.md](./architecture.md) и [`docs/adr/`](../adr/README.md).
