# Phase 1: Состав отчёта - Context

**Gathered:** 2026-10-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Участник нажимает кнопку на доске и скачивает файл Markdown с текущими задачами: заголовок Task Board, секции To Do, In Progress, Done, задачи по `position`. Пустая колонка при непустой доске остаётся видимой секцией. Поведение доски без единой задачи — фаза 3. Экранирование знаков Markdown — фаза 2.

</domain>

<decisions>
## Implementation Decisions

### Скачивание
- **D-01:** Участник получает файл скачиванием в браузере. На диск сервера отчёт не пишется.
- **D-02:** Кнопка стоит в шапке доски рядом с Reset demo. Подпись кнопки: `Export markdown`.
- **D-03:** Имя файла всегда `task-board.md`.

### Вид файла
- **D-04:** Первая строка — `# Task Board`. Дальше секции `## To Do`, `## In Progress`, `## Done` в этом порядке.
- **D-05:** Задача — пункт списка `- {title}`. Непустое описание — следующий абзац под пунктом, обычным текстом. Пустое описание в файл не входит.
- **D-06:** Внутри секции задачи идут по возрастанию `position`.
- **D-07:** Файл строится по задачам, которые сейчас видны на доске, чтобы на демо открытый файл совпадал с экраном.

### Пустая колонка
- **D-08:** Если в колонке нет карточек, а на доске есть другие задачи, секция остаётся и под заголовком содержит строку `*No tasks*`.

### Claude's Discretion
- Как именно собрать Blob и вызвать скачивание — на усмотрение плана. Наблюдаемый результат зафиксирован выше.
- Пользователь отдал выбор формулировке «лишь бы было максимально наглядно для рассказа». Критерий выбора: слушатель на одном экране видит кнопку, доску и тот же состав в скачанном файле.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Майлстоун
- `.planning/PROJECT.md` — цель v1.0 и граница снимка: код в этом обсуждении не пишется, решения только фиксируются
- `.planning/REQUIREMENTS.md` — RPT-01, RPT-02, RPT-03 входят в фазу 1; RPT-06 (доска без задач) не входит
- `.planning/ROADMAP.md` — Phase 1: Состав отчёта

### Контракт доски
- `packages/shared/src/index.ts` — `Task`, `TaskStatus`, `COLUMN_LABELS` (To Do, In Progress, Done)
- `apps/frontend/src/App.tsx` — шапка с Reset demo, куда встаёт кнопка экспорта

No external specs — требования и вид файла зафиксированы в decisions выше.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `COLUMN_LABELS` в `packages/shared/src/index.ts`: подписи секций уже совпадают с колонками доски.
- Список задач на экране живёт в `apps/frontend/src/App.tsx`. Отдельного экспортёра нет.

### Established Patterns
- Интерфейс доски на английском: `Add a task…`, `Reset demo`. Кнопка экспорта тоже на английском.
- Три демо-задачи без описания: Sketch the board layout, Wire Fastify routes, Demo drag and drop.

### Integration Points
- Шапка `apps/frontend/src/App.tsx` (`header.header`) — единственное место кнопки.
- Данные задач уже приходят с Fastify. Новый маршрут для скачивания эта фаза не требует: файл собирается из задач на экране.

</code_context>

<specifics>
## Specific Ideas

Наглядный файл для трёх демо-задач:

```markdown
# Task Board

## To Do

- Sketch the board layout

## In Progress

- Wire Fastify routes

## Done

- Demo drag and drop
```

Колонка без карточек при остальных задачах на доске:

```markdown
## In Progress

*No tasks*
```

Задача с описанием:

```markdown
- Wire Fastify routes

  Routes live in index.ts.
```

</specifics>

<deferred>
## Deferred Ideas

- Поведение доски без единой задачи — фаза 3. Строка `*No tasks*` туда не переносится: это метка пустой колонки, не пустого отчёта.
- Экранирование знаков Markdown и побайтовая стабильность файла — фаза 2.
- Запись отчёта на сервер, PDF, фильтры — вне майлстоуна.

</deferred>

---

*Phase: 1-Состав отчёта*
*Context gathered: 2026-10-05*
