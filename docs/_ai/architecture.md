# Architecture

Один репозиторий, четыре workspace-пакета. Направления зависимости: `frontend → shared`, `backend → shared`. `@repo/typescript-config` — только конфиги компилятора, без кода.

```
gsd-graphify-workshop/
├── apps/frontend/     @repo/frontend
├── apps/backend/      @repo/backend
├── packages/shared/   @repo/shared
└── packages/typescript-config/
```

Слоёв «controller / service / repository» нет. HTTP-маршруты собраны в `apps/backend/src/index.ts`. Доступ к SQLite — функции в `apps/backend/src/db.ts`. Контракт задачи — типы в `packages/shared/src/index.ts`.

## Процессы

- Frontend dev-сервер Vite, порт **5173** (`apps/frontend/vite.config.ts`).
- Backend слушает `PORT` (по умолчанию **3001**) и `HOST` (по умолчанию **0.0.0.0**).
- CORS: `@fastify/cors` с `origin: true` (отражает Origin запроса).
- Логгер Fastify включён (`logger: true`).
- Перед `listen` вызывается `seedIfEmpty()`.

Прокси `/api` задан только в `server.proxy` Vite (dev). Правило: target `http://localhost:3001`, `changeOrigin: true`, префикс `/api` срезается. В `preview` отдельного proxy нет. Статической раздачи собранного frontend из backend нет.

## Чего в репозитории нет

Аутентификации, OpenAPI-файла, очередей, планировщиков, WebSocket/SSE и миграционного инструмента. Граф знаний собран в `graphify-out/`. Ошибки API — JSON `{ error: string }` и коды 400 / 404 / 204, без общего обработчика.

См. [data-flow.md](./data-flow.md), [persistence](../01-architecture/persistence-and-database.md), [API](../01-architecture/api-design-and-openapi.md), [auth](../01-architecture/auth-and-security.md), [integrations](../01-architecture/integrations.md), [events](../01-architecture/events-and-realtime.md), [schedulers](../01-architecture/schedulers-and-jobs.md).
