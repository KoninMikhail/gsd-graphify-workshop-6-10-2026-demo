# Phase 2: Безопасный текст - Context

**Gathered:** 2026-10-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Знаки Markdown в title и description остаются символами текста. Повторная выгрузка тех же задач даёт тот же файл. В файл не входят id, createdAt, updatedAt. Кнопка, порядок секций и строка *No tasks* уже заданы фазой 1.

</domain>

<decisions>
## Implementation Decisions

### Экранирование
- **D-01:** Экранировать в title и description символы `\`, `` ` ``, `*`, `_`, `[`, `]`, `<`, `>`. Обратный слэш заменяется первым.
- **D-02:** Переводы строк в title схлопываются в один пробел, чтобы заголовок карточки не открывал новую строку разметки.
- **D-03:** Переводы строк в description сохраняются. Строка описания, которая после экранирования начинается с `#`, `-`, `+` или `>`, получает префикс `\`.
- **D-04:** Строка `*No tasks*` и заголовки `# Task Board` / `## To Do` не экранируются: это каркас файла, не текст задачи.

### Стабильность
- **D-05:** Шаблон по-прежнему подставляет только title, description и COLUMN_LABELS. Одинаковый набор этих полей даёт одинаковый текст.

### Claude's Discretion
- Имя функции — escapeMarkdownText, рядом с buildTaskReport в report.ts.

</decisions>

<canonical_refs>
## Canonical References

- `.planning/REQUIREMENTS.md` — RPT-04, RPT-05
- `.planning/phases/01-report-shape/01-CONTEXT.md` — каркас файла, который эта фаза не меняет
- `packages/shared/src/index.ts` — поля Task

</canonical_refs>

<code_context>
## Existing Code Insights

- Сборщик появится в `apps/frontend/src/report.ts` по плану 01-01. Эта фаза меняет только подстановку title и description.

</code_context>

<specifics>
## Specific Ideas

Заголовок `*Sketch*` в файле виден как `\*Sketch\*`, а не как курсив.
Описание из двух строк не превращается во второй заголовок.

</specifics>

<deferred>
## Deferred Ideas

- Доска без задач — фаза 3.

</deferred>

---

*Phase: 2-Безопасный текст*
*Context gathered: 2026-10-05*
