# Domain context

Словарь домена — карточка на доске. Других сущностей нет.

## Статусы

`TASK_STATUSES = ["todo", "in_progress", "done"]`. Значение вне списка даёт ошибку `Invalid status: …` и HTTP 400 на create, patch и reorder.

Подписи колонок (`COLUMN_LABELS`) — только для UI: To Do, In Progress, Done. В базе хранится код статуса, не подпись.

## Правила записи

Из `apps/backend/src/db.ts`:

- `title` обрезается; пустая строка → `Title is required`.
- `description` обрезается; если поле не передано при создании, пишется `""`.
- Статус при создании по умолчанию `todo`.
- `position` при создании — `MAX(position) + 1` среди задач того же статуса; у первой задачи колонки позиция `0` (`COALESCE(MAX(position), -1) + 1`).
- `id` — `randomUUID()`. `createdAt` и `updatedAt` — `new Date().toISOString()`.
- `PATCH` меняет только переданные поля. Смена `status` сама по себе позицию не пересчитывает: берётся `input.position` или прежняя.
- Удаление отсутствующего id возвращает `false` → 404. Успешное удаление не сдвигает `position` соседей.
- Reorder требует непустой массив и существующие id. Чужой статус отклоняется до записи.

Схема SQLite не содержит внешних ключей. `PRAGMA foreign_keys = ON` включён, ограничений `REFERENCES` в `CREATE TABLE` нет. `PRAGMA journal_mode = WAL`.

## Демо-задачи

`seedIfEmpty` ничего не делает, если `COUNT(*) > 0`. `resetToDemo` очищает таблицу и вставляет три задачи из константы `DEMO_TASKS` (заголовок и статус, без описания).

UI после drag выставляет позицию заново: индекс в колонке, начиная с 0, и отправляет все карточки одним reorder.

См. [domains.md](./domains.md), [product-context.md](./product-context.md), [entities](../03-reference/entities-catalog.md).
