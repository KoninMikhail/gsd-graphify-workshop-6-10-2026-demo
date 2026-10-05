# Phase 2: Безопасный текст - Research

**Researched:** 2026-10-05
**Domain:** экранирование текста внутри уже собранного Markdown
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Экранировать `\`, обратную кавычку, `*`, `_`, `[`, `]`, `<`, `>`. Обратный слэш заменяется первым.
- Переводы строк в title схлопываются в пробел.
- В description переводы строк остаются. Строка, которая начинается с `#`, `-`, `+` или `>`, получает префикс `\`.
- `# Task Board`, заголовки секций и `*No tasks*` не экранируются.
- В шаблон не входят id, createdAt, updatedAt.

### Claude's Discretion
- Имя функции escapeMarkdownText в report.ts.

### Deferred Ideas (OUT OF SCOPE)
- Пустая доска — фаза 3.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Экранирование | Browser/Client | — | Чистая функция рядом с buildTaskReport |

</architectural_responsibility_map>

<research_summary>
## Summary

Каркас файла уже решено собирать в report.ts. Экранировать нужно только подставляемые title и description, иначе сломается список и строка *No tasks*.

Отдельная библиотека Markdown не нужна: набор символов короткий и зафиксирован. Тесты добавляются в report.test.ts, раннер фазы 1 переиспользуется.

**Primary recommendation:** escapeMarkdownText в report.ts и новые кейсы в существующем report.test.ts.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | поставлен фазой 1 | Кейсы экранирования | Уже будет в проекте после фазы 1 |

Новых зависимостей нет.
</standard_stack>

## Validation Architecture

- Инфраструктура появляется в фазе 1. Здесь только новые кейсы.
- Команда: npm test.
- Обязательный контрпример: литерал *No tasks* остаётся без обратных слэшей.
