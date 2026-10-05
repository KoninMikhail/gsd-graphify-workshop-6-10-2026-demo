# Phase 3: Пустой отчёт - Context

**Gathered:** 2026-10-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Доска без единой задачи не скачивает файл и показывает понятную ошибку. Пустая колонка при остальных задачах на доске по-прежнему даёт секцию *No tasks*.

</domain>

<decisions>
## Implementation Decisions

### Пустая доска
- **D-01:** Если задач нет, downloadTaskReport не вызывается и файл не появляется.
- **D-02:** На месте баннера ошибки текст ровно `Nothing to export`.
- **D-03:** Кнопка Export markdown остаётся на месте, чтобы на демо было что нажать.

Выбор сделан для наглядности урока: пустая колонка оставляет секцию, пустая доска не создаёт файл. Это контраст со слайдом про ошибку без файла.

### Claude's Discretion
- Сбрасывать ли предыдущий текст ошибки при успешном скачивании. Для демо — да, чтобы баннер не зависал.

</decisions>

<canonical_refs>
## Canonical References

- `.planning/REQUIREMENTS.md` — RPT-06
- `.planning/phases/01-report-shape/01-CONTEXT.md` — *No tasks* не менять

</canonical_refs>

<code_context>
## Existing Code Insights

- Баннер ошибки уже есть в App.tsx: `{error ? <p className="banner error">{error}</p> : null}`.
- Кнопка Export markdown появляется в плане 01-01.

</code_context>

<specifics>
## Specific Ideas

Нажатие Export markdown на пустой доске не кладёт task-board.md в загрузки. На экране виден баннер Nothing to export.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 3-Пустой отчёт*
*Context gathered: 2026-10-05*
