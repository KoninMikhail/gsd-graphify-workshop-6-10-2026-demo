---
phase: 01-report-shape
verified: 2026-10-05T08:22:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
re_verification: false
human_verification:
  - test: "На доске с задачами хотя бы в двух колонках нажать Export markdown и открыть скачанный файл."
    expected: "Скачивается task-board.md. Внутри # Task Board, затем ## To Do, ## In Progress, ## Done. Задачи секции идут как на доске. Непустое описание — абзацем под пунктом. Пустая колонка при остальных задачах содержит *No tasks*."
    why_human: "Vitest гоняет buildTaskReport в environment node и не кликает кнопку. Факт скачивания Blob в браузере из этой проверки не запускался."
---

# Phase 1: Состав отчёта Verification Report

**Phase Goal:** Участник получает файл Markdown, в котором текущие задачи разложены по тем же трём колонкам и в том же порядке, что на доске.
**Verified:** 2026-10-05T08:22:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

MVP user-story gate не применялся: `gsd-sdk query phase.mvp-mode 01` вернул `active: false`, `roadmap_mode: null`.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Участник открывает файл и видит заголовок Task Board, затем секции To Do, In Progress и Done. | ✓ VERIFIED | `buildTaskReport` пишет `# Task Board` и секции по `TASK_STATUSES` (`todo`, `in_progress`, `done`) с `COLUMN_LABELS`. Точная строка демо-файла в `report.test.ts` совпадает с примером из `01-CONTEXT.md`. |
| 2 | Участник видит в каждой секции задачи этой колонки по возрастанию `position`, а непустое описание — под заголовком задачи. | ✓ VERIFIED | `formatSection` фильтрует по `status` и сортирует `left.position - right.position`. `formatTask` для непустого `description.trim()` даёт `- {title}`, пустую строку и абзац с двумя пробелами. Пустое описание в текст не входит. |
| 3 | Участник видит заголовок пустой колонки, если на доске при этом есть задачи в других колонках. | ✓ VERIFIED | Секции строятся для каждого статуса независимо от числа задач. Тест с одной задачей `todo` ожидает `## In Progress` и `## Done`. |
| 4 | Кнопка Export markdown в шапке скачивает task-board.md. | ✓ VERIFIED | В `header .toolbar` сразу после Reset demo стоит `button.export` с текстом Export markdown. `onClick` вызывает `downloadTaskReport(tasks)`. Имя ссылки — `task-board.md`, тип Blob — `text/markdown;charset=utf-8`. |
| 5 | Пустая колонка при непустой доске даёт секцию со строкой *No tasks*. | ✓ VERIFIED | Тело пустой секции — ровно `*No tasks*`. Тест проверяет `## In Progress\n\n*No tasks*` и то же для Done при одной задаче To Do. |

**Score:** 5/5 truths verified

Roadmap success criteria 1–3 соответствуют истинам 1–3. Истины 4–5 добавлены из `must_haves` плана и не сужают контракт роадмапа.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `apps/frontend/src/report.ts` | Сборка Markdown и скачивание | ✓ VERIFIED | 40 строк. `buildTaskReport` и `downloadTaskReport` содержат реальную сборку и Blob, не заглушку. Нет `createdAt`. |
| `apps/frontend/src/App.tsx` | Кнопка в шапке | ✓ VERIFIED | Импорт `downloadTaskReport` и вызов с состоянием `tasks`. Кнопка `disabled={loading \|\| saving}`. |
| `apps/frontend/src/report.test.ts` | Состав файла | ✓ VERIFIED | 5 активных тестов, value-level assertions, без skip. |
| `apps/frontend/src/styles.css` | Стили `.export` | ✓ VERIFIED | `.export` в тех же правилах, что `.reset`: граница, прозрачный фон, disabled. |

**Artifacts:** 4/4 verified

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `App.tsx` | `downloadTaskReport` | `onClick` кнопки Export markdown | ✓ WIRED | `downloadTaskReport(tasks)` на строке 291. `tasks` — то же состояние, из которого `groupByStatus` рисует колонки. |
| `downloadTaskReport` | `buildTaskReport` | аргумент Blob | ✓ WIRED | Blob создаётся из `buildTaskReport(tasks)`, не из константы. |
| Доска | Файл | общий порядок `position` и `COLUMN_LABELS` | ✓ WIRED | И колонки, и секции берут подписи из `COLUMN_LABELS` и сортируют один массив задач по `position` по возрастанию. |

**Wiring:** 3/3 connections verified

`gsd-sdk query verify.artifacts` и `verify.key-links` вернули ошибку «No must_haves.artifacts / key_links found»: в плане списки заданы строками, не объектами `path` / `from`. Проверка уровней 1–3 сделана по файлам напрямую.

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `App.tsx` export button | `tasks` | `api.fetchTasks()` → `GET /tasks` → `listTasks()` `SELECT ... FROM tasks` | Да | ✓ FLOWING |
| Колонки доски | `board` | `useMemo(() => groupByStatus(tasks), [tasks])` | Да, тот же `tasks` | ✓ FLOWING |
| `buildTaskReport` | аргумент `tasks` | передаётся из обработчика кнопки | Да, не пустой литерал | ✓ FLOWING |

Начальное `useState<Task[]>([])` перезаписывается ответом `fetchTasks` до того, как кнопка становится активной (`disabled={loading || saving}`).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Состав файла: секции, описание, пустая колонка, порядок `position`, без метаданных | `npm test` | `@repo/frontend`: `src/report.test.ts` 5 passed; turbo 2 successful | ✓ PASS |
| Клик Export markdown в браузере | — | Сервер и браузер не запускались | ? SKIP → human verification |

### Probe Execution

Пробы в плане, SUMMARY и `scripts/**/probe-*.sh` не объявлены. Шаг пропущен.

| Probe | Command | Result | Status |
|-------|---------|--------|--------|
| — | — | нет объявленных проб | SKIP |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| RPT-01 | 01-01 | Заголовок Task Board и секции To Do, In Progress, Done в этом порядке | ✓ SATISFIED | Истина 1, точное сравнение демо-отчёта |
| RPT-02 | 01-01 | Задачи секции по возрастанию `position`; непустое `description` входит, пустое нет | ✓ SATISFIED | Истина 2, тесты описания и порядка |
| RPT-03 | 01-01 | Заголовок секции остаётся, когда колонка пуста, а на доске есть другие задачи | ✓ SATISFIED | Истины 3 и 5 |

План объявляет RPT-01, RPT-02, RPT-03. В `REQUIREMENTS.md` фазе 1 назначены те же три идентификатора. Сирот нет. RPT-04 и RPT-05 назначены фазе 2, RPT-06 — фазе 3.

**Coverage:** 3/3 requirements satisfied

### Decision Coverage (warning)

Автопроверка `check.decision-coverage-verify`: 1/8 honored, blocking: false. Сообщение обработчика:

7 decision(s) not found in shipped artifacts:

- **D-01** (Скачивание): Участник получает файл скачиванием в браузере. На диск сервера отчёт не пишется.
- **D-02** (Скачивание): Кнопка стоит в шапке доски рядом с Reset demo. Подпись кнопки: `Export markdown`.
- **D-03** (Скачивание): Имя файла всегда `task-board.md`.
- **D-05** (Вид файла): Задача — пункт списка `- {title}`. Непустое описание — следующий абзац под пунктом, обычным текстом. Пустое описание в файл не входит.
- **D-06** (Вид файла): Внутри секции задачи идут по возрастанию `position`.
- **D-07** (Вид файла): Файл строится по задачам, которые сейчас видны на доске, чтобы на демо открытый файл совпадал с экраном.
- **D-08** (Пустая колонка): Если в колонке нет карточек, а на доске есть другие задачи, секция остаётся и под заголовком содержит строку `*No tasks*`.

This is a soft warning — verification status is unchanged.

Ручная сверка с кодом: все восемь решений исполнены. Эвристика подстроки не нашла русские формулировки в английском коде. На статус это не влияет.

| ID | В коде |
|----|--------|
| D-01 | Blob и временная ссылка в браузере; нового серверного маршрута отчёта нет |
| D-02 | Кнопка сразу после Reset demo, текст Export markdown |
| D-03 | `link.download = "task-board.md"` |
| D-04 | `# Task Board` и секции `COLUMN_LABELS` — этот пункт обработчик засчитал |
| D-05 | `- ${title}` и абзац `  ${description}` после trim |
| D-06 | `sort` по `position` |
| D-07 | `downloadTaskReport(tasks)` от состояния доски |
| D-08 | `*No tasks*` |

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|------------|--------|---------|----------|-----------------|---------|
| `apps/frontend/src/report.test.ts` | RPT-01, RPT-02, RPT-03 | 5 | 0 | Нет. Ожидаемый демо-текст записан вручную по `01-CONTEXT.md` | Value (`toBe` / `toContain`) | PASS |

**Disabled tests on requirements:** 0
**Circular patterns detected:** 0
**Insufficient assertions:** 0

Замечание, не пробел: `not.toContain("id")` доказывает отсутствие подстроки на демо-фикстуре. Поля `id`, `createdAt`, `updatedAt` в текст не подставляются, потому что `formatTask` использует только `title` и `description`. Стабильность повторной выгрузки — фаза 2 (RPT-05).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `apps/frontend/src/App.tsx` | 268 | `placeholder="Add a task…"` | ℹ️ Info | Подсказка существующего поля ввода, не заглушка отчёта |
| `apps/frontend/src/App.tsx` | 63 | `useState<Task[]>([])` | ℹ️ Info | Начальное пустое состояние до `fetchTasks`; кнопка в это время disabled |

**Anti-patterns:** 2 info, 0 blockers, 0 warnings

Маркеров `TBD`, `FIXME`, `XXX`, `TODO`, `HACK` в файлах фазы нет. Коммиты `af64efe`, `afc8294`, `a0b682b` есть в репозитории (`verify.commits`: all_valid).

### Human Verification Required

### 1. Скачивание task-board.md с живой доски

**Test:** Открыть доску, на которой есть задачи и хотя бы одна пустая колонка не обязательна, но колонки видны. Нажать Export markdown. Открыть скачанный файл.
**Expected:** Файл называется `task-board.md`. Заголовок Task Board, секции To Do, In Progress, Done совпадают с колонками и порядком карточек на экране. Непустое описание стоит абзацем под пунктом. Пустая колонка при других задачах на доске содержит `*No tasks*`.
**Why human:** Состав текста проверен `npm test`. Клик, имя файла в загрузках браузера и совпадение с живым экраном эта проверка не исполняла: план запрещает jsdom, сервер для верификации не поднимался.

## Gaps Summary

**Пробелов нет.** Истины, артефакты, связи и RPT-01, RPT-02, RPT-03 подтверждены кодом и тестами. Пустая доска без файла — фаза 3, экранирование — фаза 2; в фазе 1 это не дыры.

Статус `human_needed`, потому что остался один ручной шаг: скачать файл с живой доски. Автоматические проверки его не закрывают.

---

_Verified: 2026-10-05T08:22:00Z_
_Verifier: Claude (gsd-verifier)_
