---
name: create-adr
description: >-
   Создание ADR (Architecture Decision Record) в docs/adr/.
   Шаблон, gate «нужен ли ADR», supersede. Use when ADR, архитектурное решение,
   зафиксировать решение, create-adr.
---

# Create ADR

Rule: `.cursor/rules/adr.mdc`. ADR фиксирует **почему**, не дублирует `architecture.md`.

## Gate: нужен ли ADR

| Ситуация                                             | ADR                                                  |
| ---------------------------------------------------- | ---------------------------------------------------- |
| Паттерн по конвенции проекта                         | ❌                                                   |
| Выбор между 2+ подходами с trade-offs                | ✅                                                   |
| Auth, контракт сервисов, миграция, cutover read path | ✅                                                   |
| Поток данных / диаграмма                             | ❌ → `docs/01-architecture/` / `_ai/architecture.md` |

## Путь и именование

- Файл: `docs/adr/<nnn>-<kebab-slug>.md`
- Номер = max + 1 в папке; обновить `docs/adr/README.md` (таблица ADR | Title | Status)

## Шаблон

```markdown
# <Краткий заголовок решения>

**Status:** Accepted  
**Date:** YYYY-MM-DD  
**Scope:** repo | data-access | module-name

## Context

Что за проблема, ограничения, почему сейчас.

## Decision

Используем … (настоящее время, одно решение).

## Alternatives

| Вариант | Плюсы | Минусы | Почему нет        |
| ------- | ----- | ------ | ----------------- |
| A       | …     | …      | …                 |
| B       | …     | …      | выбран / отклонён |

## Consequences

Положительные и отрицательные последствия, что мониторить.

## References

- [architecture.md](../_ai/architecture.md)
- Kaiten: `Refs: #id` (опц.)
```

## Self-check перед завершением

- [ ] Status, Date, Scope, Context, Decision, Alternatives, Consequences
- [ ] Решение в настоящем времени; один файл = одно решение
- [ ] Строка в `docs/adr/README.md`
- [ ] Ссылка из `architecture.md` или domain/audit-doc, если выбор неочевиден
- [ ] Не дублирует whole sections из architecture.md

## Supersede

Новое решение по той же теме — новый файл; в старом: `> **Superseded by** [nnn-slug.md](nnn-slug.md)`; Status → Superseded.

## Связанные артефакты

| Артефакт                  | Роль                |
| ------------------------- | ------------------- |
| rule `adr.mdc`            | gate, anti-patterns |
| rule `docs-structure.mdc` | дерево docs/        |
