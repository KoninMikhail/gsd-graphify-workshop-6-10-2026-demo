# Локальный запуск

Команды выполняются из **корня** репозитория `gsd-graphify-workshop`.

См. также: [local-infra-options.md](./local-infra-options.md), [env-and-config.md](../03-reference/env-and-config.md), [tech-stack.md](../_ai/tech-stack.md).

## Требования

- Node.js
- npm (`packageManager`: `npm@11.13.0`)

## Установка

```bash
npm install
```

npm workspaces ставят `apps/*` и `packages/*`: `@repo/frontend`, `@repo/backend`, `@repo/shared`.

## Запуск

```bash
npm run dev
```

Turborepo запускает `dev` во всех workspace:

| Пакет | Скрипт | Результат |
| --- | --- | --- |
| `@repo/frontend` | `vite` | UI на порту **5173** |
| `@repo/backend` | `tsx watch src/index.ts` | API на порту **3001**, хост **0.0.0.0** |
| `@repo/shared` | `tsc --watch` | Сборка общих типов |

При пустой таблице backend записывает три демо-задачи.

## Адреса

| Что | URL |
| --- | --- |
| Доска | `http://localhost:5173` |
| API | `http://localhost:3001` |
| Проверка процесса | `http://localhost:3001/health` |

Браузер ходит в API только через Vite: запросы вида `/api/tasks`. Backend принимает путь **без** префикса `/api` (`/tasks`, `/health`).

## Прокси `/api`

В `apps/frontend/vite.config.ts` префикс `/api` проксируется на `http://localhost:3001`, префикс срезается:

`http://localhost:5173/api/tasks` → `http://localhost:3001/tasks`.

Клиент задаёт базу в `apps/frontend/src/api.ts`: `API_BASE = "/api"`.

Прямой вызов backend (минуя Vite) идёт на `http://localhost:3001/tasks`.

## Переменные

Обязательных переменных нет. Необязательные, их читает `apps/backend/src/index.ts`:

| Переменная | По умолчанию | Смысл |
| --- | --- | --- |
| `PORT` | `3001` | Порт Fastify |
| `HOST` | `0.0.0.0` | Адрес прослушивания |

Если меняете `PORT`, поправьте `target` прокси в `apps/frontend/vite.config.ts`: он зафиксирован на `http://localhost:3001`.

CORS backend: `origin: true` (отражает origin запроса). В режиме `npm run dev` браузер говорит с Vite на том же origin, прокси доходит до API уже с сервера.

Полный перечень — [env-and-config.md](../03-reference/env-and-config.md).

## Файл данных

При старте backend создаёт каталог и файл `apps/backend/data/tasks.db` (`node:sqlite`). Описание — [local-infra-options.md](./local-infra-options.md) и [persistence-and-database.md](../01-architecture/persistence-and-database.md).

Сброс доски к трём демо-задачам: `POST http://localhost:3001/tasks/reset` (или `POST /api/tasks/reset` через Vite).

## Сборка и проверка

```bash
npm run build
npm run lint
npm run typecheck
```

Смысл команд — [dev-workflow.md](./dev-workflow.md) и [ci-and-scripts.md](../02-tooling/ci-and-scripts.md).
