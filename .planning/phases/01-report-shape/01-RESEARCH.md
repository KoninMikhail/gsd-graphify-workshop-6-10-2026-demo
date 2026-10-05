# Phase 1: Состав отчёта - Research

**Researched:** 2026-10-05
**Domain:** скачивание Markdown из React-доски
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Файл скачивается в браузере, на диск сервера не пишется.
- Кнопка Export markdown в шапке рядом с Reset demo.
- Имя файла всегда task-board.md.
- Каркас: # Task Board, затем ## To Do, ## In Progress, ## Done.
- Задача — пункт списка. Непустое описание — абзац с двумя пробелами.
- Пустая колонка при непустой доске — секция и строка *No tasks*.
- Текст берётся из задач, которые уже на экране.

### Claude's Discretion
- Как собрать Blob и вызвать скачивание.

### Deferred Ideas (OUT OF SCOPE)
- Экранирование знаков Markdown — фаза 2.
- Доска без единой задачи — фаза 3.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Текст отчёта | Browser/Client | — | Чистая функция от массива Task |
| Скачивание | Browser/Client | — | Blob и ссылка с атрибутом download |
| Хранение задач | API/Backend | Database/Storage | Уже есть. Новый маршрут не нужен |

</architectural_responsibility_map>

<research_summary>
## Summary

Доска уже держит задачи в состоянии App и группирует их через groupByStatus. Отчёт можно собрать из этого массива, не добавляя Fastify-маршрут. Скачивание — временная ссылка на Blob и имя task-board.md.

Тестов в репозитории нет. Корневой package.json не содержит скрипт test, поэтому ворота исполнения вызовут npm test и упадут, пока скрипт не появится. Раннер для чистой функции — Vitest в окружении node, рядом с Vite 6.

**Primary recommendation:** buildTaskReport и downloadTaskReport в apps/frontend/src/report.ts, кнопка в шапке, npm test через turbo и vitest run.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.1.0 | Кнопка в существующем App | Уже стоит |
| Vite | 6.3.5 | Сборка фронтенда | Уже стоит |
| @repo/shared | workspace | Task, TASK_STATUSES, COLUMN_LABELS | Контракт колонок |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | 3.x, совместимый с Vite 6 | npm test | Ставится в этой фазе, только как devDependency фронтенда |

Новый UI-кит, серверный рендер Markdown и запись файла на диск не нужны.
</standard_stack>

## Validation Architecture

- Раннера нет. Волна 0 этой фазы создаёт его.
- Быстрая проверка: npm test из корня.
- Полный прогон тот же: один пакет тестов.
- Команда должна появиться до конца плана, иначе ворота исполнения не увидят тесты.
- Клик по кнопке автоматическим тестом не покрывается: jsdom не поднимать. Покрывается текст buildTaskReport.
