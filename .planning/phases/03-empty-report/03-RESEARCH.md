# Phase 3: Пустой отчёт - Research

**Researched:** 2026-10-05
**Domain:** отказ от скачивания при пустом списке задач
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Если задач нет, downloadTaskReport не вызывается.
- Баннер ошибки показывает ровно Nothing to export.
- Кнопка Export markdown остаётся на месте.
- *No tasks* для пустой колонки не менять.

### Claude's Discretion
- Гасить предыдущий баннер при успешном скачивании. Для демо — да.

### Deferred Ideas (OUT OF SCOPE)
- Нет.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Решение скачивать или нет | Browser/Client | — | Чистая функция decideExport, чтобы её покрыл vitest |
| Баннер | Browser/Client | — | Уже есть p.banner.error |

</architectural_responsibility_map>

<research_summary>
## Summary

Проверка `tasks.length === 0` внутри onClick не попадает в node-тесты. Решение выносится в decideExport и тестируется отдельно. App только показывает message и не создаёт Blob.

Пустая колонка и пустая доска остаются разными: первая пишет *No tasks* и файл скачивает, вторая файл не создаёт.

**Primary recommendation:** decideExport в report.ts, ветка в onClick, кейсы в report.test.ts.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | поставлен фазой 1 | decideExport | Уже есть после фазы 1 |

Новых зависимостей нет.
</standard_stack>

## Validation Architecture

- Команда: npm test.
- Кейс пустого массива обязателен.
- Кейс одной задачи todo обязателен, чтобы не сломать пустую колонку.
- Появление файла в папке загрузок остаётся ручной проверкой.
