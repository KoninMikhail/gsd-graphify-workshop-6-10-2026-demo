# Интеграции

Исходящих вызовов сторонних API нет. Backend никуда не ходит по HTTP.

Единственная сетевая граница в репозитории — dev-прокси Vite (`apps/frontend/vite.config.ts`).

| Параметр | Значение |
| --- | --- |
| Порт dev-сервера | 5173 |
| Префикс | `/api` |
| Цель | `http://localhost:3001` |
| `changeOrigin` | `true` |
| Переписывание пути | снимается ведущий `/api`: `path.replace(/^\/api/, "")` |

Пример: браузер запрашивает `GET /api/tasks`, Fastify получает `GET /tasks`.

Базовый путь клиента задан константой `API_BASE = "/api"` в `apps/frontend/src/api.ts`. Другого шлюза, прокси или клиента HTTP в репозитории нет.

Backend слушает `PORT` и `HOST` и отдаёт маршруты из [api-design-and-openapi.md](./api-design-and-openapi.md).
