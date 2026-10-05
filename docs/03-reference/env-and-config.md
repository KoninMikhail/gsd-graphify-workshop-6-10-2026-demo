# Конфигурация

В коде читаются две переменные окружения. Обе — в `apps/backend/src/index.ts`.

| Переменная | Где | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `PORT` | `process.env.PORT` | `3001` | Порт `app.listen`. Значение проходит через `Number(...)` |
| `HOST` | `process.env.HOST` | `0.0.0.0` | Хост `app.listen` |

Других чтений `process.env` в `apps/backend/src` и `apps/frontend/src` нет.

## База API на фронтенде

В `apps/frontend/src/api.ts` база задана константой, не переменной окружения:

```ts
const API_BASE = "/api";
```

Все вызовы клиента идут на `` `${API_BASE}${path}` ``.

## Dev-прокси Vite

Файл `apps/frontend/vite.config.ts`. Это конфиг сборщика, не переменные окружения.

| Поле | Значение |
| --- | --- |
| `server.port` | `5173` |
| `server.proxy["/api"].target` | `http://localhost:3001` |
| `changeOrigin` | `true` |
| `rewrite` | снимает префикс `/api` (`path.replace(/^\/api/, "")`) |

Файл SQLite путём из окружения не задаётся. Путь собирается в коде: `apps/backend/data/tasks.db`. См. [entities-catalog.md](./entities-catalog.md).
