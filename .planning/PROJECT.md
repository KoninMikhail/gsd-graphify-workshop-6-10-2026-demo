# gsd-graphify-workshop

## What This Is

Учебный репозиторий воркшопа: канбан из трёх колонок, на котором показывают, как GSD садится на уже существующий код. Слушатель смотрит не новый продукт, а снимок репозитория после конкретной стадии. Сейчас эта стадия — базовая инициализация GSD: карта кодовой базы уже есть, дальше появляются документы планирования. Код доски в этом снимке не меняется.

## Core Value

Человек открывает снимок и видит настоящую инициализацию GSD на маленьком brownfield-приложении, а не пустой шаблон.

## Requirements

### Validated

- ✓ Участник открывает одну страницу Task Board и видит колонки To Do, In Progress и Done — existing
- ✓ Участник загружает задачи из Fastify и SQLite при открытии доски — existing
- ✓ Участник создаёт задачу с заголовком; статус по умолчанию `todo` — existing
- ✓ Участник перетаскивает карточку внутри колонки и между колонками, порядок сохраняется — existing
- ✓ Участник удаляет карточку — existing
- ✓ Участник возвращает три демо-задачи кнопкой Reset demo; пустая база при старте backend засевается теми же тремя задачами — existing
- ✓ Frontend и backend используют одни типы задач из `@repo/shared` — existing

### Active

- [ ] Участник открывает этот снимок и видит завершённую базовую инициализацию GSD поверх текущего канбана
- [ ] В `.planning/` лежат конфиг, исследование домена, требования v1, роадмап и состояние проекта
- [ ] Исходный код доски в этом снимке совпадает с кодом до инициализации, кроме документов планирования

### Out of Scope

- Новые возможности доски (редактирование заголовка, описание в форме, роли, вход) — этот снимок показывает инициализацию, а не следующий инкремент продукта
- Исполнение фаз роадмапа — следующие снимки, не этот
- Пары веток as-is / to-be — стадия фиксируется одним снимком: новое состояние, коммит, пуш, ветка-снимок
- Аутентификация, OpenAPI, автотесты, Docker и CI — в текущем приложении этого нет, и инициализация это не добавляет

## Context

Репозиторий `gsd-graphify-workshop` — монорепозиторий npm workspaces и Turborepo. Доска: React 19 и Vite (`apps/frontend`, порт 5173, proxy `/api` → `localhost:3001`). API: Fastify и один файл SQLite `apps/backend/data/tasks.db` (`node:sqlite`). Общий контракт — `packages/shared`.

Карта кодовой базы снята до этого документа и лежит в `.planning/codebase/`. Сервер — источник правды после каждой мутации. Слоя сервисов нет: маршруты в `apps/backend/src/index.ts`, SQL в `apps/backend/src/db.ts`. `PATCH /tasks/:id` и клиентский `updateTask` есть, доска их не вызывает.

Человеческая документация — `docs/`. Сжатый снимок для агентов — `docs/_ai/`. Граф graphify в этот снимок на `main` не входит: он живёт на ветке `01-graphify`.

Стадии воркшопа — линейные снимки. Уже есть `00-initial` и `01-graphify`. Текущая работа на `main` — пример инициализации GSD.

## Constraints

- **Стек:** остаётся текущий монорепозиторий (React 19, Vite 6, Fastify 5, `node:sqlite`, npm workspaces, Turborepo) — воркшоп показывает GSD на этом коде, а не смену платформы
- **Объём снимка:** в этом снимке не менять поведение доски — иначе пример инициализации смешается с примером фичи
- **Git:** документы `.planning/` коммитятся в репозиторий — слушатель должен увидеть их в снимке. Пуш и ветка-снимок делаются после того, как инициализация собрана
- **Проверки:** автотестов нет. Существующая проверка кода — `npm run typecheck` из корня. Для документов планирования она ничего не доказывает

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Сначала карта кодовой базы, потом PROJECT.md | Репозиторий уже содержит канбан. Brownfield-инициализация GSD начинается с `.planning/codebase/` | ✓ Good |
| Стадия — один снимок, не пара as-is/to-be | Новое состояние коммитится, пушится и отрезается веткой. Отдельные ветки «до» и «после» на одну стадию не нужны | — Pending |
| Этот снимок — только инициализация GSD | Нужно показать, как выглядит репозиторий сразу после базового `/gsd-new-project`, без исполнения роадмапа | — Pending |
| Код доски не входит в объём этого снимка | Иначе слушатель не отличит инициализацию от изменения продукта | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-05 after initialization*
