# Как читать справочник

Один домен: задачи на доске со статусами `todo`, `in_progress`, `done`.

| Уровень | Документ | Когда открывать |
| --- | --- | --- |
| Сводка | [api-domains.md](./api-domains.md) | Обзор путей и клиента |
| Маршруты | [routes-catalog.md](./routes-catalog.md) | Метод, путь, код успеха, коды ошибок |
| Домен | [domains/tasks.md](./domains/tasks.md) | Модель, валидация, демо-данные, порядок маршрутов |
| Хранилище | [entities-catalog.md](./entities-catalog.md) | Колонки таблицы `tasks` |
| Функции | [services-catalog.md](./services-catalog.md) | Что экспортирует `db.ts` |
| Ошибки | [exceptions-and-http-codes.md](./exceptions-and-http-codes.md) | Тексты `{ error }` и коды |
| Конфиг | [env-and-config.md](./env-and-config.md) | Порт, хост, прокси `/api` |

Исходники, на которые опирается справочник:

- `apps/backend/src/index.ts` — маршруты
- `apps/backend/src/db.ts` — SQLite и операции
- `packages/shared/src/index.ts` — типы и статусы
- `apps/frontend/src/api.ts` — клиент, база `"/api"`
- `apps/frontend/vite.config.ts` — прокси dev-сервера
