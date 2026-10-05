# Requirements: gsd-graphify-workshop

**Defined:** 2026-10-05
**Core Value:** Человек открывает снимок и видит настоящую инициализацию GSD на маленьком brownfield-приложении, а не пустой шаблон.

## User Stories

- Как слушатель воркшопа, я открываю снимок и с первой страницы `.planning/PROJECT.md` понимаю, что канбан уже есть, а урок — инициализация GSD.
- Как слушатель, я нахожу карту кода, конфиг, исследование, требования, роадмап и состояние в git и не путаю их с кодом доски.
- Как слушатель, я вижу, что роадмап ещё не исполнялся: чекбоксы пустые, каталога `.planning/phases/` нет, прогресс в `STATE.md` равен 0.

## Acceptance Criteria

- В снимке есть семь файлов `.planning/codebase/`, `PROJECT.md`, `config.json`, пять файлов `.planning/research/`, `REQUIREMENTS.md`, `ROADMAP.md` и `STATE.md`.
- `config.json` содержит `commit_docs: true`, `workflow.research: true`, `mode: interactive`, `granularity: standard`, `workflow.auto_advance: false`, `git.branching_strategy: none`.
- Требования v1 описывают видимость инициализации. Способности доски из `PROJECT.md` → Validated не повторяются здесь как новая работа.
- Diff снимка не меняет `apps/`, `packages/`, `docs/`, `docs/_ai/`, `.cursor/rules/`, `package.json`, `package-lock.json`, `turbo.json`.
- `.planning/` не попадает в `.gitignore`.

## Definition of Done

- Все пункты v1 ниже есть в дереве и привязаны ровно к одной фазе роадмапа.
- Чекбоксы v1 и фаз пустые, статусы трассировки — Pending. Закрытие пунктов — не этот снимок.
- `STATE.md` показывает прогресс 0 и следующий шаг `/gsd-discuss-phase 1`, который в этом снимке не запускался.
- Каталогов `.planning/phases/` и файлов `PLAN.md`, `VERIFICATION.md`, `UI-SPEC.md`, `CONTEXT.md` нет.

## v1 Requirements

Требования этого снимка. Каждое попадёт ровно в одну фазу роадмапа. Чекбокс остаётся пустым: файлы в дереве не означают, что фаза исполнена.

### Карта

- [ ] **MAP-01**: Слушатель открывает семь файлов `.planning/codebase/` (`STACK.md`, `INTEGRATIONS.md`, `ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `CONCERNS.md`) и видит канбан как он есть.

### Проект

- [ ] **PROJ-01**: Слушатель читает `.planning/PROJECT.md` и отличает способности доски в Validated от Active-объёма, который состоит только из документов инициализации.

### Конфиг

- [ ] **CFG-01**: Слушатель читает `.planning/config.json` и видит `commit_docs: true`, `workflow.research: true`, `mode: interactive`, `granularity: standard`, `workflow.auto_advance: false` и `git.branching_strategy: none`.
- [ ] **CFG-02**: Слушатель читает в снимке, что `workflow.plan_check`, `workflow.verifier`, `workflow.nyquist_validation`, `workflow.ui_phase` и `workflow.code_review` — настройки будущих фаз, а не доказательство, что проверка уже выполнена.

### Исследование

- [ ] **RES-01**: Слушатель открывает `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md` и `SUMMARY.md`.
- [ ] **RES-02**: Слушатель по тексту сводки отличает `.planning/codebase/STACK.md` (как устроен репозиторий) от `.planning/research/STACK.md` (решение стек не менять).
- [ ] **RES-03**: Слушатель по сводке находит, что автотестов нет, и где `.planning/codebase/CONCERNS.md` перечисляет хрупкие места доски.

### Требования

- [ ] **REQ-01**: Слушатель читает `.planning/REQUIREMENTS.md` с идентификаторами v1, секцией v2, Out of Scope и таблицей трассировки, и не видит в v1 загрузку доски, создание, перетаскивание, удаление и Reset demo как новую работу.

### Роадмап

- [ ] **ROAD-01**: Слушатель читает `.planning/ROADMAP.md` и видит фазы, цель каждой, требования, наблюдаемые критерии успеха и пустые чекбоксы.
- [ ] **ROAD-02**: Слушатель не находит в этом снимке каталог `.planning/phases/` и файлы `PLAN.md`, `VERIFICATION.md`, `UI-SPEC.md`, `CONTEXT.md`.

### Состояние

- [ ] **STATE-01**: Слушатель читает `.planning/STATE.md` и видит прогресс 0, отсутствие каталога фаз, дату 2026-10-05 и следующий шаг `/gsd-discuss-phase 1`, который в этом снимке не запускался.

### Граница снимка

- [ ] **SNAP-01**: Слушатель сравнивает снимок с кодом до инициализации и не видит правок в `apps/`, `packages/`, `docs/`, `docs/_ai/`, `.cursor/rules/`, `package.json`, `package-lock.json` и `turbo.json`.
- [ ] **GIT-01**: Слушатель видит документы `.planning/` в git, а `.planning/` не входит в `.gitignore`.

## v2 Requirements

Другие снимки воркшопа. В текущий роадмап не входят.

### Следующие уроки

- **DISC-01**: Слушатель проходит `/gsd-discuss-phase 1` и видит контекст фазы.
- **PLAN-01**: Слушатель проходит `/gsd-plan-phase` и видит каталог `.planning/phases/` с планами.
- **EXEC-01**: Слушатель исполняет фазу, и в снимке появляются правки продукта, а не только документы инициализации.
- **GRAPH-01**: Слушатель смотрит граф graphify на ветке `01-graphify`, а не в снимке инициализации.
- **PLAT-01**: Слушатель видит аутентификацию, OpenAPI, автотесты, Docker или CI, если отдельный снимок специально про эти слои.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Новые возможности доски (редактирование заголовка, описание в форме, роли, вход) | Этот снимок — инициализация, не инкремент продукта |
| Повторная постановка загрузки, создания, drag, удаления и Reset demo в v1 | Они уже в `PROJECT.md` → Validated. Копия заставит роадмап «строить» работающую доску |
| Пример Authentication из шаблона требований | Входа в приложении нет, инициализация его не добавляет |
| Исполнение фаз роадмапа | Следующие снимки. Здесь чекбоксы пустые |
| Каталог `.planning/phases/` и `PLAN.md` | Пустой каталог выглядит как начатый `/gsd-plan-phase` |
| `CONTEXT.md` и `UI-SPEC.md` | Это discuss и ui-phase после готовой инициализации |
| Пара веток as-is / to-be | Стадия фиксируется одним снимком: состояние, коммит, пуш, ветка |
| Смена стека, слой сервисов, второй пакет типов | Воркшоп показывает GSD на текущем монорепозитории |
| Граф `graphify-out/` на этом снимке | Граф живёт на `01-graphify` |
| Перезапись `AGENTS.md` и `.cursor/rules/` | Там уже правила воркшопа. Шаблон GSD их затрёт |
| `.planning/` в `.gitignore` | Слушатель не увидит урок в снимке |
| Копия роадмапа в `docs/` или `docs/_ai/` | Команды GSD читают `.planning/`. Гайды доски не дублировать и в этом снимке не править |
| Закрытые чекбоксы v1 и фаз | Закрытый пункт выглядит как прошедший execute и `/gsd-transition` |
| `auto_advance: true` | Тот же прогон уйдёт в discuss и смешает два снимка |

## Traceability

Таблица заполняется вместе с роадмапом. До этого фазы не назначены.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MAP-01 | — | Pending |
| PROJ-01 | — | Pending |
| CFG-01 | — | Pending |
| CFG-02 | — | Pending |
| RES-01 | — | Pending |
| RES-02 | — | Pending |
| RES-03 | — | Pending |
| REQ-01 | — | Pending |
| ROAD-01 | — | Pending |
| ROAD-02 | — | Pending |
| STATE-01 | — | Pending |
| SNAP-01 | — | Pending |
| GIT-01 | — | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 0
- Unmapped: 13

---
*Requirements defined: 2026-10-05*
*Last updated: 2026-10-05 after initialization research*
