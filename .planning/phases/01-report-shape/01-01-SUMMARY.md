---
phase: 01-report-shape
plan: 01
subsystem: ui
tags: [react, markdown, vitest, vite]

requires: []
provides:
  - Сборщик Markdown-отчёта по задачам на экране
  - Кнопка Export markdown, скачивающая task-board.md
  - Первый прогон npm test на vitest
affects: [02-safe-text, 03-empty-report]

tech-stack:
  added: [vitest@5.0.3]
  patterns:
    - Отчёт собирается в браузере из состояния доски
    - Пустая колонка при непустой доске пишет *No tasks*

key-files:
  created:
    - apps/frontend/src/report.ts
    - apps/frontend/src/report.test.ts
    - apps/frontend/vitest.config.ts
  modified:
    - apps/frontend/src/App.tsx
    - apps/frontend/src/styles.css
    - apps/frontend/package.json
    - package.json
    - turbo.json

key-decisions:
  - "Файл собирается в браузере из задач, которые уже на экране"
  - "Пустой массив задач не ветвится: три секции *No tasks* допустимы до фазы 3"
  - "Vitest 5.0.3, потому что установленный Vite 6.4.3 входит в его peer-диапазон"

patterns-established:
  - "buildTaskReport: # Task Board, затем секции TASK_STATUSES, в конце один перевод строки"
  - "Непустое описание — абзац с двумя пробелами под пунктом списка"
  - "npm test из корня — turbo run test, во frontend — vitest run"

requirements-completed: [RPT-01, RPT-02, RPT-03]

duration: 6min
completed: 2026-10-05
---

# Phase 1 Plan 01: Состав отчёта Summary

**Кнопка Export markdown скачивает task-board.md: заголовок Task Board, три секции колонок и *No tasks* для пустой колонки**

## Performance

- **Duration:** 6 min
- **Started:** 2026-10-05T08:10:00Z
- **Completed:** 2026-10-05T08:16:02Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- `buildTaskReport` собирает `# Task Board` и секции To Do, In Progress, Done в порядке `TASK_STATUSES`
- Задачи секции идут по возрастанию `position`; непустое описание становится абзацем под пунктом
- Кнопка Export markdown в шапке скачивает `task-board.md` из задач, которые уже на экране
- `npm test` из корня зелёный: 5 тестов vitest

## Task Commits

Each task was committed atomically:

1. **Task 1: Собрать текст отчёта из задач на экране** - `af64efe` (feat)
2. **Task 2: Скачать task-board.md кнопкой в шапке** - `afc8294` (feat)
3. **Task 3: Поставить vitest и проверить состав файла** - `a0b682b` (test)

**Plan metadata:** docs commit вместе с STATE.md, ROADMAP.md и REQUIREMENTS.md

## Files Created/Modified

- `apps/frontend/src/report.ts` — сборка текста и скачивание Blob
- `apps/frontend/src/App.tsx` — кнопка Export markdown в `.toolbar` сразу после Reset demo
- `apps/frontend/src/styles.css` — `.export` с той же границей и disabled, что у `.reset`
- `apps/frontend/src/report.test.ts` — секции, описание, пустая колонка, порядок `position`, отсутствие метаданных
- `apps/frontend/vitest.config.ts` — environment node, include `src/**/*.test.ts`
- `apps/frontend/package.json` — скрипт `vitest run` и devDependency vitest
- `package.json` — скрипт `turbo run test`
- `turbo.json` — задача `test` с `dependsOn: ["^build"]`
- `package-lock.json` — фиксация vitest 5.0.3

## Decisions Made

- Файл собирается в браузере из `tasks` в `App`. Новый серверный маршрут не добавлялся.
- Пустой список задач не обрабатывается отдельно. Три секции `*No tasks*` на пустой доске допустимы до фазы 3.
- Vitest 5.0.3: в дереве стоит Vite 6.4.3, peer vitest 5 — `^6.4.0`. Vitest 3 тоже совместим с Vite 6, выбран текущий релиз с подходящим peer.
- Временная ссылка скачивания добавляется в `document.body` и снимается после клика, затем вызывается `URL.revokeObjectURL`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

План 01-01 закрывает фазу 1. Сборщик и кнопка готовы для фазы 2 (экранирование) и фазы 3 (пустая доска без файла).

Проверено в браузере на `http://127.0.0.1:5174/` (порт 5173 занят слайдами). Клик по Export markdown скачал `task-board.md` (`text/markdown;charset=utf-8`). Текст совпал с карточками на экране, включая дополнительную задачу To Do «выаываыва» из текущей базы. Reset demo не нажимался, чтобы не стереть эту карточку. Пустая колонка в браузере не воспроизводилась; её покрывают unit-тесты.

## Self-Check: PASSED

- FOUND: apps/frontend/src/report.ts
- FOUND: apps/frontend/src/App.tsx
- FOUND: apps/frontend/src/report.test.ts
- FOUND: apps/frontend/vitest.config.ts
- FOUND: af64efe, afc8294, a0b682b в `git log --oneline`

## Known Stubs

None

---
*Phase: 01-report-shape*
*Completed: 2026-10-05*
