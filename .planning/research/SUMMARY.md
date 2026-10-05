# Project Research Summary

**Project:** gsd-graphify-workshop
**Domain:** учебный снимок базовой инициализации GSD на уже существующем канбане
**Researched:** 2026-10-05
**Confidence:** HIGH

## Executive Summary

Это brownfield-урок, а не новый продукт. Канбан из трёх колонок уже работает: React 19, Vite 6, Fastify 5, один файл `node:sqlite`, npm workspaces и Turborepo. Эксперты в таком репозитории сначала фиксируют код как он есть (`.planning/codebase/`), затем кладут рядом канонические документы GSD и останавливаются. Слушатель открывает снимок и видит инициализацию поверх прежней доски. Он сравнивает ветку с `00-initial` и `01-graphify`.

Рекомендуемый ход совпадает с порядком сборки документов, а не с порядком разработки доски. Карта из семи файлов, `PROJECT.md` и `config.json` уже лежат на диске. Остаток снимка — `research/` (четыре разбора и эта сводка), `REQUIREMENTS.md`, `ROADMAP.md` и `STATE.md`. Требования v1 описывают видимость этой инициализации. Способности доски из `PROJECT.md` → Validated в v1 как новая работа не копируются. Роадмап существует на бумаге: чекбоксы пустые, каталога `.planning/phases/` нет, прогресс в `STATE.md` равен 0. `commit_docs: true` оставляет `.planning/` в git, чтобы слушатель нашёл файлы в снимке ветки.

Главный риск — дифф, в котором инициализация склеена с чем-то ещё: игнор `.planning/`, правка `apps/` или `packages/`, смена стека, каталог `phases/`, граф `graphify-out/`, правка `docs/` или `docs/_ai/`, пара веток as-is/to-be. Защита одна: коммит этого снимка состоит из документов `.planning/`, стек и поведение доски совпадают с кодом до инициализации, исполнение фаз откладывается на следующие снимки. Зелёный `npm run typecheck` документы планирования не доказывает.

## Key Findings

### Recommended Stack

Стек не выбирается. Его фиксирует `.planning/research/STACK.md` по lockfile на 2026-10-05 и по `.planning/codebase/STACK.md`. Это два разных файла с одним именем: карта — as-is описание репозитория, исследование — решение оставить текущую платформу. Отдельный файл-указатель не заводить.

**Core technologies:**
- React 19.3.0 и react-dom 19.3.0: интерфейс доски в `apps/frontend` — доска уже на `createRoot` и JSX `react-jsx`
- Vite 6.4.3: dev-сервер на порту 5173, сборка и proxy `/api` — конфиг уже в `apps/frontend/vite.config.ts`
- Fastify 5.12.5: HTTP API на `0.0.0.0:3001` — маршруты в `apps/backend/src/index.ts`, слой сервисов не добавляется
- `node:sqlite` (`DatabaseSync`): файл `apps/backend/data/tasks.db` — единственный клиент базы, это не npm-пакет
- TypeScript 5.9.3: код `apps/` и `packages/` — общий компилятор, target `ES2022`, `strict` через `@repo/typescript-config`
- npm 11.13.0 workspaces: монорепозиторий `apps/*` и `packages/*` — менеджер уже записан в `packageManager`
- Turborepo 2.11.7: `npm run dev` / `build` / `lint` / `typecheck` — граф задач уже в `turbo.json`, новые turbo-задачи этот снимок не добавляет

Рядом остаются `@repo/shared` как единственный контракт задачи, `@fastify/cors` 11.3.0, набор `@dnd-kit` и `tsx` только в dev бэкенда. Node.js в репозитории не запинен (`@types/node` 22.20.5). Пин, ORM, Docker, CI, OpenAPI, тест-раннер и второй пакет типов в этот снимок не входят.

### Expected Features

«Фича» здесь — то, что слушатель узнаёт как базовую инициализацию. Подробности — в `.planning/research/FEATURES.md`. Поведение доски уже стоит в `PROJECT.md` как Validated.

**Must have (table stakes):**
- Карта `.planning/codebase/` из семи файлов — brownfield начинается с неё; повторно карту не снимать
- `PROJECT.md` — Validated доски отдельно от Active инициализации
- `config.json` — `commit_docs: true`, `workflow.research: true`, `mode: interactive`, `auto_advance: false`, `git.branching_strategy: none`
- Пять файлов `.planning/research/` — STACK, FEATURES, ARCHITECTURE, PITFALLS и эта SUMMARY; роадмап читает сводку
- `REQUIREMENTS.md` — v1 про видимость снимка, идентификаторы, v2, Out of Scope, трассировка Pending; пример Authentication из шаблона сюда не переносится
- `ROADMAP.md` — фазы, зависимости, критерии успеха, пустые чекбоксы; каталога `.planning/phases/` нет
- `STATE.md` — прогресс 0, каталога фаз нет, дата снимка 2026-10-05
- Код доски без правок — `apps/`, `packages/`, `docs/`, `docs/_ai/`, `.cursor/rules/`, манифесты и `turbo.json` совпадают с кодом до инициализации
- Документы `.planning/` в git — `commit_docs: true`, маски `.planning/` в `.gitignore` нет

**Should have (competitive):**
- Один абзац, который различает `.planning/codebase/STACK.md` и `.planning/research/STACK.md` — он в этом разделе, отдельным файлом не заводится
- Строка в `STATE.md`: следующий шаг после снимка — `/gsd-discuss-phase 1`; команду в этом снимке не запускать
- Отсылка к `.planning/codebase/TESTING.md` и `.planning/codebase/CONCERNS.md` — автотестов нет; долг доски (мёртвый `updateTask`, drag, валидация, сид, анонимный reset, синхронный sqlite) остаётся текстом, не работой этого коммита
- Фраза про флаги: `nyquist_validation`, `plan_check`, `verifier`, `ui_phase` и `code_review` в `config.json` — предпочтения будущих фаз; включённый флаг не означает, что проверка уже сделана

**Defer (v2+):**
- `/gsd-discuss-phase`, `CONTEXT.md` и UI-спека — следующий шаг после готовой инициализации
- `/gsd-plan-phase` и каталог `.planning/phases/` — урок про план, не про этот снимок
- Исполнение роадмапа и любые правки доски — следующие снимки
- Граф graphify — ветка `01-graphify`
- Аутентификация, OpenAPI, автотесты, Docker, CI — в приложении этого нет, инициализация это не добавляет

### Architecture Approach

Рантайм заморожен и уже описан в `.planning/codebase/ARCHITECTURE.md`: браузер → Vite `:5173` (proxy `/api` срезает префикс) → Fastify `:3001` → функции `db.ts` → `tasks.db`. `@repo/shared` — типы на этапе компиляции. Слоя сервисов нет. Сервер остаётся источником правды после каждой мутации. Этот снимок проектирует не второй рантайм, а три двери к одному: слушатель снимка начинает с `.planning/PROJECT.md`, человек за доской — с `docs/00-start/`, агент в коде доски — с `docs/_ai/README.md`. Одинаковое имя `ARCHITECTURE.md` в `docs/_ai/`, `docs/01-architecture/` и `.planning/codebase/` — три роли, не три проекта. Подробности — в `.planning/research/ARCHITECTURE.md`.

**Major components:**
1. Рантайм доски — `apps/frontend`, `apps/backend`, `packages/shared`; в этом снимке без правок
2. Продуктовые гайды и Memory Bank — `docs/` и `docs/_ai/`; фразу в `docs/_ai/README.md` про отсутствие `.planning/` в этом снимке не исправлять
3. Слой урока — `.planning/`: карта, конфиг, PROJECT, research, REQUIREMENTS, ROADMAP, STATE
4. Правила агента — `.cursor/rules/` и служебный `AGENTS.md`; instruction-файл из шага roadmap не перегенерировать

Порядок сборки, который роадмап обязан сохранить: карта, конфиг и PROJECT уже записаны → четыре файла research параллельно → SUMMARY после всех четырёх → REQUIREMENTS → одним шагом ROADMAP, STATE и таблица трассировки. `research/` не пишет в `apps/`, `packages/` и `docs/`. `ROADMAP.md` не создаёт `phases/`.

### Critical Pitfalls

Полный разбор — в `.planning/research/PITFALLS.md`. Для роадмапа обязательны пять границ.

1. **`.planning/` в `.gitignore`** — оставить `commit_docs: true`; `git check-ignore -v .planning/PROJECT.md` молчит; писать файлы в репозиторий `-demo`, не в соседний корень без суффикса
2. **Фича доски в коммите инициализации** — дифф против `01-graphify` содержит только `.planning/`; дыры из `CONCERNS.md` не чинить в этом коммите
3. **Исследование предлагает заменить стек** — роадмап ссылается на текущий монорепозиторий как на данное; фазы миграции React, Vite, Fastify, SQLite, npm или Turborepo в этом снимке нет
4. **Роадмап исполняется внутри снимка** — нет `.planning/phases/`, `PLAN.md`, `VERIFICATION.md`, `UI-SPEC.md`; `STATE.md` не содержит «Phase 1 in progress»
5. **Снимок выглядит как один `PROJECT.md`** — до пуша на месте весь комплект: карта, конфиг, PROJECT, research, REQUIREMENTS, ROADMAP, STATE

Рядом держать `branching_strategy: none` (одна ветка-снимок после полного коммита на `main`, без пары as-is/to-be и без `gsd/phase-*`) и не смешивать стадию с graphify или правкой `docs/_ai/`.

## Implications for Roadmap

Роадмап этого снимка — бумажный контур урока. Фазы ниже записываются в `ROADMAP.md` с пустыми чекбоксами и статусом «не начато». Каталог `.planning/phases/` не создавать. Планы остаются TBD. Ни одну фазу не исполнять в этом коммите. Успех фазы — наблюдаемое состояние репозитория (файл лежит, код доски тот же), а не новая кнопка на доске.

Каждый пункт v1 попадает ровно в одну фазу. Способности доски из Validated в список v1 не копировать. Продуктовые дыры из `CONCERNS.md` в фазы этого снимка не ставить: если роадмап когда-нибудь их назовёт, это уже следующий снимок, и в этом коммите у них нет планов и кода.

### Phase 1: Brownfield-вход
**Rationale:** Инициализация на готовом канбане начинается с карты, которая уже снята до `PROJECT.md`. Без этой фазы слушатель видит либо пустой шаблон, либо greenfield.
**Delivers:** Семь файлов `.planning/codebase/` на месте и не пересобраны. `PROJECT.md` отделяет Validated от Active. `config.json` коммитит документы (`commit_docs: true`), включает исследование и не уводит прогон в следующую фазу (`auto_advance: false`, `branching_strategy: none`).
**Addresses:** Карта кодовой базы, PROJECT.md, config.json, документы `.planning/` в git
**Avoids:** Снимок из одного PROJECT.md; `.planning/` в `.gitignore`; перезапись `.cursor/rules/` и `AGENTS.md`

### Phase 2: Исследование границ
**Rationale:** Роадмап обязан прочитать одну сводку, а не четыре сырых файла. Сводка пишется после четвёрки и держит стек равным коду, который слушатель запускает через `npm run dev`.
**Delivers:** `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`, `SUMMARY.md`. Стек — текущий канбан. Сводка различает два `STACK.md` и отсылает к `TESTING.md` и `CONCERNS.md`.
**Uses:** React 19, Vite 6, Fastify 5, `node:sqlite`, npm workspaces, Turborepo — как данное, без установки новых пакетов
**Implements:** Граница «исследование читает карту и PROJECT, не пишет в `apps/`, `packages/`, `docs/`»
**Avoids:** Фаза миграции платформы; рекомендуемый `npm install` другого фреймворка, ORM или тест-раннера

### Phase 3: Скоуп урока
**Rationale:** Скоуп должен быть отдельным списком. Абзац Desired Outcome в `PROJECT.md` слушатель принимает за весь GSD, а копирование Validated раздувает v1 уже сданной доской.
**Delivers:** `REQUIREMENTS.md` с идентификаторами v1, секциями v2 и Out of Scope, таблицей трассировки в статусе Pending. v1 — видимость инициализации. Аутентификация, OpenAPI, автотесты, Docker, CI и новые возможности доски стоят в Out of Scope.
**Addresses:** Требования v1 про снимок, а не про доску
**Avoids:** Пример Authentication из шаблона; повторная постановка колонок, создания, drag, удаления, Reset demo и `@repo/shared` как новой работы

### Phase 4: План на бумаге и точка остановки
**Rationale:** `ROADMAP.md` и `STATE.md` пишутся одним шагом после требований. Это последняя граница снимка: план виден целиком, исполнение не начато.
**Delivers:** `ROADMAP.md` с фазами, зависимостями и наблюдаемыми критериями успеха; пустые чекбоксы; число планов TBD; файлов планов нет. `STATE.md` ссылается на `PROJECT.md`, фокус — инициализация, прогресс 0, выполненных планов нет, каталога фаз нет, дата 2026-10-05. Следующая команда в состоянии — `/gsd-discuss-phase 1`, и она в этом снимке не запускается.
**Addresses:** Роадмап на бумаге, состояние на границе «инициализация собрана», неизменность кода доски
**Avoids:** `.planning/phases/`, закрытые чекбоксы, «Phase 1 in progress», пары веток as-is/to-be, граф и правки `docs/`

### Phase Ordering Rationale

- Зависимость документов односторонняя: карта и PROJECT уже есть, исследование читает их, требования читают сводку и FEATURES, роадмап и состояние пишутся вместе после требований.
- Группировка совпадает с тремя дверями и одним рантаймом: фаза 1 закрепляет вход, фаза 2 не рисует вторую архитектуру доски, фазы 3–4 описывают урок, а не слои «БД → API → UI».
- Порядок закрывает pitfalls 1, 4 и 6 до пуша: комплект собран, `.planning/` в git, каталога фаз нет. Фазы 2 и 3 закрывают смену стека и копирование Validated. Сквозной критерий всех четырёх — дифф против `01-graphify` содержит только `.planning/`.
- Четыре фазы — рекомендуемая нарезка. Сливать их можно только так, чтобы каждый артефакт из списка table stakes остался в чей-то «Delivers». Дробить дальше и добавлять фазу продукта в этот снимок нельзя.

### Research Flags

Phases likely needing deeper research during planning:
- Ни одна фаза этого снимка. Планирование здесь — запись уже исследованных документов. Отдельный `/gsd-plan-phase` с исследованием в этом снимке не запускать.
- Любая будущая фаза про долг доски (drag, валидация, тесты, доступ) — только в следующем снимке. В этот роадмап её не включать и research-phase для неё сейчас не открывать.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Карта и конфиг уже лежат в дереве. Паттерн brownfield `/gsd-map-codebase` до `/gsd-new-project` зафиксирован.
- **Phase 2:** Четыре файла и сводка уже написаны по репозиторию и локальному воркфлоу GSD. Повторное исследование стека даст greenfield-рекомендации, которые этот снимок запрещает.
- **Phase 3:** Категории v1, v2 и Out of Scope берутся из FEATURES.md. Шаблон требований используется без секции-примера Authentication.
- **Phase 4:** Совместная запись ROADMAP и STATE — стандартный шаг `/gsd-new-project`. Критерий успеха — файлы и пустые чекбоксы, не интеграция.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Версии сверены с `package-lock.json`, манифестами и `.planning/codebase/STACK.md`. Внешние обзоры «стека 2026» не использовались |
| Features | HIGH | P1 совпадает с Active в `PROJECT.md` и с выходом `/gsd-new-project` при `workflow.research: true`. Граница P1/P2 — суждение по уроку, состав P1 от этого не плавает |
| Architecture | HIGH | Сверена с картой кодовой базы и локальным воркфлоу. Рантайм цитируется, не проектируется заново |
| Pitfalls | HIGH | Сверены с `PROJECT.md`, `config.json`, `.gitignore`, `CONCERNS.md` и текстом `new-project`. Детект multi-repo на этом корне — MEDIUM: вложенных `.git` у `apps/*` нет, риск — соседний корень воркспейса и ответ «No» на Git Tracking |

**Overall confidence:** HIGH

### Gaps to Address

- Имена фаз в этой сводке — рекомендация для роадмапа, не измерение. Менять формулировки можно. Выкинуть карту, PROJECT, config, research, требования, роадмап, STATE или `commit_docs` нельзя.
- Node.js не запинен. Это свойство репозитория, не задача инициализации. В роадмап этого снимка фазу «записать engines» не ставить.
- `docs/_ai/README.md` всё ещё говорит, что каталогов `graphify-out/` и `.planning/` нет. Расхождение — граница слоёв. В этом снимке фразу не чинить.
- Долг доски из `CONCERNS.md` и `TESTING.md` описан и намеренно не закрыт. Планировщик не превращает его в v1 и не создаёт под него `PLAN.md`.
- Флаги ворот в `config.json` включены заранее. В `STATE.md` и в критериях фаз прямо записать, что включённый флаг не равен выполненной проверке.
- Пуш и ветка-снимок — после полного комплекта на `main`, одним указателем. Это шаг оркестратора, не содержимое `phases/`.

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — цель снимка, Validated, Active, Out of Scope, Constraints, Key Decisions (2026-10-05)
- `.planning/config.json` — `commit_docs: true`, `workflow.research: true`, `auto_advance: false`, `branching_strategy: none`
- `.planning/codebase/` — семь файлов карты, включая `STACK.md`, `ARCHITECTURE.md`, `TESTING.md`, `CONCERNS.md` (2026-10-05)
- `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md` — четыре входа этой сводки (2026-10-05)
- `package-lock.json`, корневой `package.json`, манифесты workspace, `turbo.json` — фактический стек
- Локальные `gsd-new-project` (`SKILL.md`, `workflows/new-project.md`) и `gsd-map-codebase` — состав выхода и порядок questioning → research → requirements → roadmap
- Шаблоны `requirements.md`, `roadmap.md`, `state.md` в `get-shit-done/templates/` — форма документов; секция Authentication в шаблоне требований является примером, не скоупом

### Secondary (MEDIUM confidence)
- Детект multi-repo в `new-project` — сработает ли он на соседнем корне воркспейса без суффикса `-demo`, в PITFALLS оценено как MEDIUM. Защита не зависит от детекта: документы пишутся только в репозиторий `-demo`

### Tertiary (LOW confidence)
- Нет. Граница P1/P2 не опрашивала слушателей, но состав P1 совпадает с активными требованиями проекта и с выходом воркфлоу, поэтому в LOW не уходит

---
*Research completed: 2026-10-05*
*Ready for roadmap: yes*
