# 03-reference

Справочник HTTP API задач: маршруты Fastify, функции доступа к SQLite и общая модель из `@repo/shared`.

Отдельного файла OpenAPI в репозитории нет. Контракт — код `apps/backend/src/index.ts` и типы `packages/shared/src/index.ts`.

## Навигация

| Документ | Назначение |
| --- | --- |
| [reading-guide.md](./reading-guide.md) | В каком порядке читать справочник |
| [api-domains.md](./api-domains.md) | Сводка домена tasks и клиента |
| [routes-catalog.md](./routes-catalog.md) | Все маршруты: метод, путь, коды |
| [services-catalog.md](./services-catalog.md) | Экспорты `apps/backend/src/db.ts` |
| [entities-catalog.md](./entities-catalog.md) | Таблица `tasks` |
| [exceptions-and-http-codes.md](./exceptions-and-http-codes.md) | Тела ошибок и коды из кода |
| [env-and-config.md](./env-and-config.md) | `PORT`, `HOST`, база `/api` |

## Домен

| Документ | Назначение |
| --- | --- |
| [domains/README.md](./domains/README.md) | Список доменов |
| [domains/tasks.md](./domains/tasks.md) | Домен задач целиком |
