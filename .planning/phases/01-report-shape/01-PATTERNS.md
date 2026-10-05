# Phase 1: Состав отчёта - Patterns

**Mapped:** 2026-10-05

## Аналоги

### Кнопка в шапке
- Файл: `apps/frontend/src/App.tsx`
- Роль: единственное место действий доски
- Образец: кнопка Reset demo внутри `div.toolbar`, `type="button"`, `disabled={loading || saving}`
- Новая кнопка Export markdown ставится сразу после неё и вызывает функцию, а не `api.*`

### Стили кнопки
- Файл: `apps/frontend/src/styles.css`
- Роль: `.reset` — прозрачный фон, граница `var(--line)`, скругление 999px
- Класс `.export` добавляется в те же списки селекторов, что и `.reset`

### Порядок колонок
- Файл: `packages/shared/src/index.ts`
- `TASK_STATUSES` = todo, in_progress, done
- `COLUMN_LABELS` = To Do, In Progress, Done
- `apps/frontend/src/App.tsx` функция `groupByStatus` уже сортирует по `position`

## Что не копировать
- `api.ts` — для отчёта повторный запрос не нужен
- `apps/backend/src/index.ts` — новый маршрут не добавлять
