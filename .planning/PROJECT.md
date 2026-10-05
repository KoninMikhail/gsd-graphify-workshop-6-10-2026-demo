# gsd-graphify-workshop

## What This Is

Учебный репозиторий воркшопа: канбан из трёх колонок, на котором показывают, как GSD садится на уже существующий код. Слушатель смотрит снимок репозитория после конкретной стадии. Эта стадия — первый продуктовый майлстоун: экспорт задач доски в Markdown. Инициализация GSD остаётся на ветке `02-gsd-init`. Код доски в этом снимке не меняется. У трёх фаз есть планы, исполнение не начато.

## Core Value

Человек открывает снимок и видит, как на уже инициализированном канбане записан первый майлстоун: цель, требования и фазы, без исполненного кода.

## Current Milestone: v1.0 Экспорт отчёта в Markdown

**Goal:** Участник доски получает файл Markdown с текущими задачами: секции в фиксированном порядке, текст не ломает разметку.

**Target features:**
- Заголовок и три секции в порядке колонок To Do, In Progress, Done
- Задачи внутри секции в сохранённом порядке `position`
- Знаки Markdown в заголовке и описании остаются текстом
- Пустая доска не скачивает файл и показывает баннер Nothing to export

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

- [ ] Участник с доски получает файл Markdown по текущим задачам
- [ ] В файле заголовок Task Board и секции To Do, In Progress, Done в этом порядке
- [ ] Знаки Markdown в тексте задач не становятся разметкой
- [ ] Для доски без задач Export markdown показывает баннер Nothing to export и не скачивает файл

### Out of Scope

- Исполнение планов и правка `apps/` — следующий шаг после этого снимка
- Файл с пояснением на пустой доске — для демо выбран баннер Nothing to export
- Редактирование заголовка, роли, вход, OpenAPI, автотесты, Docker и CI
- Перезапись ветки `02-gsd-init` и пара веток as-is / to-be на эту стадию
- Фильтры, PDF и отправка отчёта наружу

## Context

Репозиторий `gsd-graphify-workshop` — монорепозиторий npm workspaces и Turborepo. Доска: React 19 и Vite (`apps/frontend`, порт 5173, proxy `/api` → `localhost:3001`). API: Fastify и один файл SQLite `apps/backend/data/tasks.db` (`node:sqlite`). Общий контракт — `packages/shared`. Задача: `title`, `description`, `status` (`todo` | `in_progress` | `done`), `position`. Подписи колонок: To Do, In Progress, Done.

Снимок инициализации — ветка `02-gsd-init`, тот же коммит, что и прежний `main` (`f0e6402`). Карта `.planning/codebase/` и исследование `.planning/research/` оттуда остаются: стек не меняется. Сервер — источник правды после каждой мутации. Слоя сервисов нет.

Человеческая документация — `docs/`. Сжатый снимок для агентов — `docs/_ai/`. В этом снимке их не правят. Граф graphify живёт на ветке `01-graphify`.

Стадии воркшопа — линейные снимки: `00-initial`, `01-graphify`, `02-gsd-init`, затем эта ветка `03-milestone`.

## Constraints

- **Стек:** остаётся текущий монорепозиторий (React 19, Vite 6, Fastify 5, `node:sqlite`, npm workspaces, Turborepo)
- **Объём снимка:** записать майлстоун на бумаге. Поведение доски не менять
- **Контракт отчёта:** данные — задачи, которые видны на доске. Пустая колонка при непустой доске пишет `*No tasks*`. Доска без задач не скачивает файл
- **Git:** документы `.planning/` коммитятся. Пуш — по отдельной просьбе. Ветка `02-gsd-init` не двигается
- **Проверки:** автотестов нет. `npm run typecheck` для этих документов ничего не доказывает

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Снимок 03 — ветка от `main`, инициализация остаётся на `02-gsd-init` | Слушатель сравнивает стадии по веткам, а не ищет майлстоун внутри снимка инициализации | ✓ Good |
| Первый продуктовый майлстоун — экспорт задач в Markdown | Это сквозной пример презентации: понятная задача с одним открытым вопросом | ✓ Good |
| Пустая доска — баннер Nothing to export, без файла | Так пустая доска отличается на демо от пустой колонки со строкой *No tasks* | ✓ Good |
| Фаз три, при `granularity: standard` | У майлстоуна три наблюдаемых исхода. Дробить их до 5–8 значило бы выдумать работу | ✓ Good |
| Нумерация фаз с 1 | Фазы снимка 02 описывали документы инициализации. Продуктовый майлстоун начинается заново | ✓ Good |
| Код доски не входит в этот снимок | Иначе слушатель не отличит записанный майлстоун от сделанной фичи | — Pending |

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
*Last updated: 2026-10-05 after milestone v1.0*
