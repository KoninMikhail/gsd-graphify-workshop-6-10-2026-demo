# Stack Research

**Domain:** учебный снимок базовой инициализации GSD на уже существующем канбане
**Researched:** 2026-10-05
**Confidence:** HIGH

Этот снимок не выбирает стек. Канбан уже собран и проверен: React 19, Vite 6, Fastify 5, `node:sqlite`, npm workspaces, Turborepo. Инициализация GSD садится рядом с этим кодом и добавляет только документы планирования. Новая библиотека, другой менеджер пакетов или смена версии в этом снимке выглядят как урок про платформу, и слушатель перестаёт видеть урок про инициализацию.

Версии ниже — разрешённые из `package-lock.json` на 2026-10-05. В скобках — диапазон из `package.json`. Для снимка ориентир — lockfile, а не «последняя версия на npm».

## Recommended Stack

Стек остаётся текущим. Колонка «зачем» объясняет, почему его не меняют в этом снимке.

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.3.0 (`^19.1.0`) | Интерфейс доски в `apps/frontend` | Доска уже на React 19: `createRoot`, JSX `react-jsx`. Замена или откат спрячут инициализацию за сменой UI-платформы |
| react-dom | 19.3.0 (`^19.1.0`) | Монтирование `#root` | Пара к React 19.3.0. Отдельная версия `react-dom` разъедет типы и рантайм |
| Vite | 6.4.3 (`^6.3.5`) | Dev-сервер на порту 5173, production-сборка, proxy `/api` | Конфиг уже в `apps/frontend/vite.config.ts`. Переход на другую мажорную версию Vite — это другой снимок, не инициализация |
| Fastify | 5.12.5 (`^5.3.3`) | HTTP API, по умолчанию `0.0.0.0:3001` | Маршруты живут в `apps/backend/src/index.ts`. Инициализация не переписывает сервер и не добавляет слой сервисов |
| `node:sqlite` (`DatabaseSync`) | встроенный модуль Node; типы `@types/node` 22.20.5 | Файл `apps/backend/data/tasks.db` | Единственный клиент базы. Это не npm-пакет. Флаг `--experimental-sqlite` код не передаёт |
| TypeScript | 5.9.3 (`^5.8.3` во всех workspace) | Код `apps/frontend`, `apps/backend`, `packages/shared` | Общий компилятор, target `ES2022`, `strict` через `@repo/typescript-config`. Снимок не меняет язык |
| npm workspaces | npm 11.13.0 (`packageManager` в корневом `package.json`) | Монорепозиторий `apps/*` и `packages/*`, lockfileVersion 3 | Менеджер пакетов уже зафиксирован. Другой клиент даст другой lockfile, и diff снимка перестанет быть diff документов |
| Turborepo | 2.11.7 (`^2.5.4`) | `npm run dev` / `build` / `lint` / `typecheck` | Граф задач уже в `turbo.json`: `build` зависит от `^build`, `dev` не кэшируется. Планирование не добавляет новые turbo-задачи |

Node.js в репозитории не запинен: нет `engines`, нет `.nvmrc`, нет `.node-version`. Нужен выпуск Node, в котором `node:sqlite` есть как встроенный модуль. Типы зафиксированы пакетом `@types/node` 22.20.5.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@fastify/cors` | 11.3.0 (`^11.0.1`) | CORS с `origin: true` | Уже зарегистрирован в `apps/backend/src/index.ts`. В этом снимке не трогать |
| `@dnd-kit/core` | 6.3.1 | Перетаскивание карточек | Уже стоит. Поведение доски (перенос внутри колонки и между колонками) валидировано и в этот снимок не входит |
| `@dnd-kit/sortable` | 10.0.0 | Порядок карточек | Вместе с `@dnd-kit/core`. Не заменять другим DnD-набором |
| `@dnd-kit/utilities` | 3.2.2 | Утилиты dnd-kit | Транзитивная часть того же набора. Не выкидывать и не дублировать |
| `@vitejs/plugin-react` | 4.7.0 (`^4.4.1`) | Плагин React для Vite 6 | Оставить. Babel внутри плагина — не фреймворк приложения |
| `@repo/shared` | workspace `*` | Контракт `Task`, `TaskStatus`, входы create/update/reorder, `TASK_STATUSES` | Единственный общий контракт фронта и бэка. `exports` смотрят в `dist/`. Инициализация не заводит второй пакет типов |
| `@repo/typescript-config` | workspace `*` | `base.json`, `node.json`, `react.json` | Пресеты уже подключены. Backend и shared: `NodeNext`, `outDir: dist`. Frontend: `noEmit`, DOM, `types: ["vite/client"]` |
| `@types/react` | 19.3.0 (`^19.1.4`) | Типы React | Держать в паре с React 19.3.0 |
| `@types/react-dom` | 19.3.0 (`^19.1.5`) | Типы react-dom | Держать в паре с react-dom 19.3.0 |
| `tsx` | 4.23.15 (`^4.19.4`) | Только dev бэкенда: `tsx watch src/index.ts` | Production-старт остаётся `node dist/index.js`. `tsx` не переносить в runtime-зависимости |

Пакеты фронта, бэка и `@repo/shared` объявлены как `"type": "module"`. Стили доски — ручной `apps/frontend/src/styles.css`, без CSS-фреймворка. Секретов и `.env` в репозитории нет. Читаются только необязательные `PORT` и `HOST`. Путь к SQLite зашит в `apps/backend/src/db.ts`. База API на клиенте — константа `"/api"`.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `npm run typecheck` из корня | Единственная существующая проверка кода | И `lint`, и `typecheck` запускают `tsc --noEmit` через Turbo. Автотестов нет. Для документов `.planning/` typecheck ничего не доказывает |
| `npm run dev` из корня | Поднять доску как есть | Vite на 5173, Fastify на 3001, `tsc --watch` для `@repo/shared`. Proxy `/api` срезает префикс и ходит на `http://localhost:3001` |
| `turbo.json` | Граф текущих задач | Не добавлять задачи `test`, `docker` или `openapi` ради этого снимка |
| Документы `.planning/` | То, что инициализация реально добавляет | Это markdown и JSON. Они не входят в `node_modules` и не меняют `package.json` |

Правильная инициализация в этом репозитории добавляет и оставляет такие файлы. Ни один из них не является зависимостью приложения:

| Артефакт | Путь | Роль в снимке |
|----------|------|----------------|
| Карта кода | `.planning/codebase/` (`STACK.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `INTEGRATIONS.md`, `CONCERNS.md`) | Уже снята до `PROJECT.md`. Brownfield-инициализация с неё начинается. Повторно «выбирать стек» по ней не нужно |
| Контекст проекта | `.planning/PROJECT.md` | Уже есть. Фиксирует: код доски в этом снимке не меняется |
| Настройки workflow | `.planning/config.json` | Уже есть. `workflow.research: true`, режим `interactive`. Это предпочтения GSD, не конфиг Vite или Fastify |
| Исследование | `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`, `SUMMARY.md` | Доменное исследование для роадмапа. Описывает текущий канбан и границы снимка, а не новый стек |
| Требования v1 | `.planning/REQUIREMENTS.md` | Скоуп требований. Валидированное поведение доски сюда переносится как уже существующее |
| Роадмап | `.planning/ROADMAP.md` | Фазы. В этом снимке роадмап только лежит в репозитории. Фазы не исполняются |
| Состояние | `.planning/STATE.md` | Память проекта после инициализации |

Источник списка — workflow `/gsd-new-project`: на выходе `PROJECT.md`, `config.json`, `research/` (если исследование включено), `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`. В этом репозитории исследование включено (`config.json` → `workflow.research: true`).

Тот же workflow в конце может обновить файл инструкций агента (`AGENTS.md` или правила в `.cursor/rules/`). В этом снимке существующие правила воркшопа (memory bank, Turborepo, graphify, автокоммиты) не переписывать и не выдавать их перезапись за часть инициализации. Активные требования `PROJECT.md` называют только документы в `.planning/`.

## Installation

Новых пакетов этот снимок не устанавливает. Команды ниже не добавляют зависимости. Их запускают только чтобы поднять уже собранный канбан.

```bash
# Из корня репозитория. Ставит то, что уже зафиксировано в package-lock.json.
npm install

# Поднять текущую доску. Не часть инициализации GSD.
npm run dev

# Единственная проверка кода. Документы .planning/ она не покрывает.
npm run typecheck
```

Не выполнять `npm install` с новыми именами пакетов, не менять `packageManager`, не удалять `package-lock.json`.

## Alternatives Considered

Альтернативы ниже нормальны для другого продукта. В этом снимке их не выбирают: слушатель должен увидеть документы GSD на прежнем коде.

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| React 19.3.0 + Vite 6.4.3 | Next.js, Remix, Vite 7, другой UI-фреймворк | Когда урок явно про смену фронтенда. Здесь урок про то, как GSD ложится на уже написанную доску |
| Fastify 5.12.5, маршруты в `index.ts` | Express, Hono, Nest, слой сервисов | Когда урок про устройство сервера. Инициализация не переносит SQL и маршруты |
| `node:sqlite` `DatabaseSync` | Prisma, Drizzle, `better-sqlite3`, Postgres | Когда урок про слой данных или смену СУБД. Сейчас база — один файл без ORM и без миграций |
| npm 11.13.0 workspaces + Turborepo 2.11.7 | pnpm, Yarn, Bun, Nx | Когда урок про менеджер пакетов или другой task runner. Смена клиента перепишет lockfile |
| Общие типы `@repo/shared` | OpenAPI, отдельный пакет схем, runtime-валидатор как новый контракт | Когда урок про контракт API. Сейчас контракт — TypeScript-типы, и фронт с бэком уже на них |
| `npm run typecheck` | Vitest, Jest, Playwright | Когда урок про тесты. В приложении нет `test`-скрипта и нет `*.test.*` / `*.spec.*`. Инициализация раннер не добавляет |
| `npm run dev` на хосте | Docker, Compose, CI | Когда урок про поставку. В репозитории нет Dockerfile и пайплайна, и инициализация их не создаёт |
| Ручной `styles.css` и локальный state доски | Tailwind, CSS-in-JS, Redux, Zustand, TanStack Query | Когда урок про стили или клиентский кэш. Доска уже работает без них |

## What NOT to Use

Если любой пункт из этой таблицы появится в diff снимка, слушатель примет изменение продукта за инициализацию проекта.

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Смена React, Vite, Fastify или Turborepo, включая «просто обновить мажор» | Diff в `package.json` и lockfile читается как новый стек. Требование `PROJECT.md`: код доски совпадает с кодом до инициализации, кроме документов планирования | Зафиксированные версии из lockfile |
| Prisma, Drizzle, `better-sqlite3`, Postgres, инструмент миграций | `node:sqlite` перестанет быть единственным клиентом. Это перепись хранения, а не `PROJECT.md` | `DatabaseSync` и файл `apps/backend/data/tasks.db` |
| pnpm, Yarn или Bun | Сломается заявленный `packageManager: npm@11.13.0` и lockfile npm | npm workspaces из корня |
| Vitest, Jest, Playwright, Testing Library | В коде нет тестов. Новый раннер выглядит как поставка качества, которой инициализация не занимается | Существующий `npm run typecheck` |
| Docker, Compose, GitHub Actions, хостинг статики | Платформы поставки в репозитории нет. `PROJECT.md` прямо выносит Docker и CI за скоуп | `npm run dev` и `node dist/index.js` для бэкенда |
| OpenAPI, Swagger, Zod как новый контракт | Рядом с `@repo/shared` появится второй источник правды. Слушатель решит, что init меняет API | Типы из `packages/shared` |
| Библиотеки входа и сессий | Аутентификация в Out of Scope. Её появление — новая фича | Ничего. Доска остаётся без входа |
| Tailwind и прочие CSS-фреймворки | Смена внешнего вида не входит в инициализацию | `apps/frontend/src/styles.css` |
| Redux, Zustand, TanStack Query | Новый клиентский слой данных маскирует то, что сервер уже источник правды после каждой мутации | Текущий клиент в `apps/frontend/src/api.ts` |
| Слой сервисов, рефакторинг `index.ts` / `db.ts` | Код сдвинется, хотя поведение доски не должно меняться | Маршруты в `index.ts`, SQL в `db.ts` |
| Исполнение фаз роадмапа, правки карточек, новые поля | Это следующие снимки. Здесь роадмап только появляется как документ | Файлы `.planning/*.md` без правок `apps/` и `packages/` |
| Граф graphify и каталог `graphify-out/` на этом снимке | Граф живёт на ветке `01-graphify`, не на снимке инициализации | Документы `.planning/` |
| Перезапись `AGENTS.md` и `.cursor/rules/*` «потому что так заканчивается new-project» | В репозитории правила воркшопа уже лежат. Их замена смешает инструкцию агента с уроком инициализации | Оставить текущие правила. Объём снимка — `.planning/` |

## Stack Patterns by Variant

**Если это снимок базовой инициализации (текущий milestone):**
- Меняются только документы планирования: исследование, требования, роадмап, состояние. Карта `.planning/codebase/`, `PROJECT.md` и `config.json` уже на месте и остаются согласованными с кодом
- Потому что слушатель должен открыть репозиторий и увидеть GSD поверх канбана, а не новый канбан

**Если следующий снимок исполняет фазу роадмапа:**
- Код `apps/` и `packages/` может измениться, но библиотеки и версии из этого файла остаются теми же, пока отдельное решение явно не сменит платформу
- Потому что фазы этого воркшопа учат процессу GSD на одном приложении. Смена React, Fastify, SQLite или Turborepo внутри фазы ломает линейность снимков `00-initial` → `01-graphify` → инициализация → дальше

**Если `PORT` бэкенда не 3001:**
- Менять литерал `server.proxy["/api"].target` в `apps/frontend/vite.config.ts` вместе с `PORT`
- В этом снимке не делать даже этого: proxy и так указывает на `http://localhost:3001`, а поведение доски заморожено

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `react@19.3.0` | `react-dom@19.3.0`, `@types/react@19.3.0`, `@types/react-dom@19.3.0` | Версии в lockfile совпадают. Не поднимать типы отдельно от рантайма |
| `vite@6.4.3` | `@vitejs/plugin-react@4.7.0` | Плагин 4.7 подобран под Vite 6 в этом lockfile. Не подкладывать плагин от другого мажора Vite |
| `fastify@5.12.5` | `@fastify/cors@11.3.0` | CORS уже под Fastify 5. Не заменять на пакет CORS для Fastify 4 |
| `typescript@5.9.3` | `@types/node@22.20.5`, пресеты `@repo/typescript-config` | Один TypeScript на корне и во workspace. Target `ES2022`. Backend компилируется в `dist/`, frontend — `noEmit` плюс Vite |
| `turbo@2.11.7` | npm workspaces, `turbo.json` | Скрипты корня только делегируют в `turbo run`. Отдельный способ запускать пакеты в обход Turbo для снимка не вводить |
| `tsx@4.23.15` | `typescript@5.9.3`, ESM (`"type": "module"`) | Только `dev` бэкенда. Сборка и `start` идут через `tsc` и `node` |
| `@dnd-kit/core@6.3.1` | `@dnd-kit/sortable@10.0.0`, `@dnd-kit/utilities@3.2.2` | Менять только все три вместе и только в снимке, который учит перетаскиванию. Этот снимок их не трогает |
| `@repo/shared` (workspace `*`) | `@repo/frontend`, `@repo/backend` | Turbo `build` / `typecheck` / `lint` зависят от `^build`, поэтому shared собирается раньше потребителей. Инициализация этот порядок не меняет |
| `node:sqlite` | `@types/node@22.20.5` | Модуль встроенный, в lockfile его нет. Типы берутся из `@types/node`. Не ставить npm-обёртку «для типов sqlite» |

## Sources

- `package-lock.json` — разрешённые версии React 19.3.0, react-dom 19.3.0, Vite 6.4.3, `@vitejs/plugin-react` 4.7.0, Fastify 5.12.5, `@fastify/cors` 11.3.0, Turborepo 2.11.7, TypeScript 5.9.3, `tsx` 4.23.15, `@dnd-kit/*` 6.3.1 / 10.0.0 / 3.2.2, `@types/node` 22.20.5, `@types/react` 19.3.0, `@types/react-dom` 19.3.0. Уверенность HIGH
- Корневой `package.json` и манифесты `apps/frontend`, `apps/backend`, `packages/shared`, `packages/typescript-config` — диапазоны, `packageManager: npm@11.13.0`, workspaces, скрипты. Уверенность HIGH
- `turbo.json` — задачи `build`, `dev`, `lint`, `typecheck`. Уверенность HIGH
- `.planning/codebase/STACK.md` (анализ 2026-10-05) — где лежит код, что тестов и Docker нет, что `node:sqlite` без experimental-флага, что Node не запинен. Сверено с lockfile. Уверенность HIGH
- `.planning/PROJECT.md` (обновлён 2026-10-05) — ограничение стека, объём снимка, Out of Scope (вход, OpenAPI, автотесты, Docker, CI, исполнение фаз). Уверенность HIGH
- `.planning/config.json` — `workflow.research: true`, `mode: interactive`. Уверенность HIGH
- `C:\Users\DEV.KONIN\.cursor\skills\gsd-new-project\SKILL.md` и `workflows/new-project.md` (секция Done и блок `<output>`) — точный набор файлов инициализации, включая опциональный `research/` и файл инструкций агента. Уверенность HIGH

Внешние обзоры стека не использовались. Для этого снимка авторитетный источник — сам репозиторий и контракт `/gsd-new-project`, а не актуальный «рекомендуемый стек 2026».

---
*Stack research for: учебный снимок инициализации GSD на канбане gsd-graphify-workshop*
*Researched: 2026-10-05*
