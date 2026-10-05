# Частые проблемы

Сбои локального запуска доски. Команды — из корня репозитория.

**См. также:** [local-setup.md](./local-setup.md), [dev-workflow.md](./dev-workflow.md), [local-infra-options.md](./local-infra-options.md).

## Забыли `npm install`

**Симптом:** `turbo`, `vite` или `tsx` не находятся; импорт `@repo/frontend` / `@repo/backend` / `@repo/shared` не резолвится.

**Что сделать:**

```bash
npm install
npm run dev
```

Ставить зависимости нужно в корне: workspaces — `apps/*` и `packages/*`. `npm install` внутри одного пакета не собирает монорепозиторий целиком.

## Порт 3001 занят

**Симптом:** backend пишет ошибку `listen` и завершается с кодом 1. UI открывается, запросы `/api/...` не доходят до Fastify.

**Что сделать:** освободить **3001** или задать backend другой `PORT`. Прокси Vite в `apps/frontend/vite.config.ts` целится в `http://localhost:3001`. Если порт другой, смените `server.proxy["/api"].target` на тот же хост и порт. Иначе браузер бьёт в старый адрес.

Проверка живого API: `GET http://localhost:3001/health` → `{ "ok": true }`.

## Порт 5173 занят

**Симптом:** Vite не занимает **5173** (сообщение, что порт занят, или переход на следующий порт). Закладка `http://localhost:5173` показывает не эту доску.

**Что сделать:** освободить **5173** и снова выполнить `npm run dev`. Ожидаемый UI — `http://localhost:5173`. Порт задан в `apps/frontend/vite.config.ts` (`server.port`).

Прокси `/api` работает только у того процесса Vite, который вы запустили из этого репозитория. Чужой сайт на 5173 к backend этой доски не относится.

## Прокси `/api`

Цепочка в dev:

1. Браузер вызывает `http://localhost:5173/api/tasks` (`API_BASE = "/api"` в `apps/frontend/src/api.ts`).
2. Vite срезает префикс `/api`.
3. Fastify получает `http://localhost:3001/tasks`.

| Запрос | Куда попадает | Результат |
| --- | --- | --- |
| `http://localhost:5173/api/tasks` | backend `GET /tasks` | Список задач |
| `http://localhost:3001/tasks` | backend напрямую | Список задач |
| `http://localhost:3001/api/tasks` | backend, маршрут `/api/tasks` не объявлен | 404 |
| `http://localhost:5173/tasks` | сам Vite, прокси не срабатывает | Нет ответа API |

Backend должен слушать **3001**, пока frontend в dev. Если слушает только Vite, прокси отвечает ошибкой соединения.

`npm run dev` из корня поднимает оба процесса. Один только `@repo/frontend` оставляет `/api` без backend.

Маршруты — [routes-catalog.md](../03-reference/routes-catalog.md). Поток запроса — [data-flow.md](../_ai/data-flow.md).
