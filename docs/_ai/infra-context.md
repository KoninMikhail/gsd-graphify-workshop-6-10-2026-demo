# Infra context

Описанный способ запуска — локальные процессы Node.

| Процесс | Как стартует | Куда слушает |
| --- | --- | --- |
| Vite | `vite` в `@repo/frontend` | порт 5173 |
| Fastify | `tsx watch src/index.ts` или `node dist/index.js` | `HOST`:`PORT`, по умолчанию `0.0.0.0:3001` |

Состояние — один файл SQLite: `apps/backend/data/tasks.db`. Путь собирается как `join(dirname(fileURLToPath(import.meta.url)), "..", "data", "tasks.db")`, то есть рядом с исходниками backend, не из переменной окружения. Каталог `apps/backend/data/` в `.gitignore`. Режим журнала WAL, поэтому рядом могут появиться файлы WAL/SHM.

Платформа деплоя в репозитории не задана. Нет Dockerfile, compose-файла, манифестов кластера и каталога CI (`.github/` и аналогов нет). Секретов и `.env` нет: снаружи задаются только `PORT` и `HOST`, оба необязательны.

Наблюдаемость — штатный логгер Fastify (`logger: true`) в stdout. Метрик, трейсов и health-проб оркестратора в репозитории нет. `GET /health` возвращает `{ ok: true }` и базу не проверяет.

См. [workflow.md](./workflow.md), [env](../03-reference/env-and-config.md), [observability](../04-ops/observability.md), [runbooks](../04-ops/runbooks/README.md), [local-infra](../00-start/local-infra-options.md).
