# Workflow

Сборка и проверка — npm-скрипты корня. Они вызывают Turbo, Turbo вызывает скрипт в каждом workspace, где он объявлен.

```
npm run dev
npm run build
npm run lint
npm run typecheck
```

`lint` и `typecheck` — это `tsc --noEmit`, не отдельный линтер. Оба в `turbo.json` зависят от `^build`: сначала собираются зависимости (shared → `dist/`).

## Что делает `dev`

Одновременно, как persistent-задачи Turbo:

- `@repo/shared`: `tsc --watch`
- `@repo/backend`: `tsx watch src/index.ts` (порт 3001, если `PORT` не задан)
- `@repo/frontend`: `vite` (порт 5173)

Открывать доску на `http://localhost:5173`. Запросы `/api/*` проксируются на backend. Прямой вызов backend — `http://localhost:3001/health` и `http://localhost:3001/tasks` (без префикса `/api`).

## Сборка

`npm run build` выполняет `^build`: shared и backend пишут `dist/`, frontend делает `tsc --noEmit` и `vite build`. Запуск собранного API: в пакете backend есть `npm run start` → `node dist/index.js`. Корневого скрипта `start` нет.

`vite preview` объявлен только у frontend. Proxy для preview в `vite.config.ts` не задан.

Переменные процесса: `PORT`, `HOST`. Файла `.env` в репозитории нет.

Каталога CI и скриптов деплоя нет. См. [tech-stack.md](./tech-stack.md), [ci-and-scripts](../02-tooling/ci-and-scripts.md), [local-setup](../00-start/local-setup.md), [dev-workflow](../00-start/dev-workflow.md).
