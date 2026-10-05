---
phase: 1
slug: report-shape
status: draft
shadcn_initialized: false
preset: none
created: 2026-10-05
---

# Phase 1 — UI Design Contract

> Кнопка скачивания в существующей шапке. Новый дизайн-кит не вводится.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none |
| Icon library | none |
| Font | Manrope, уже на `:root` |

---

## Spacing Scale

Объявленные значения шапки уже в `styles.css`. Новых токенов нет.

| Token | Value | Usage |
|-------|-------|-------|
| sm | 12px | gap `.toolbar` 0.75rem |
| md | 16px | не менять |

Exceptions: радиус кнопки 999px, как у `.reset`.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Label | наследует кнопку | 700 | 1.45 |

Текст кнопки: `Export markdown`.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Ink | var(--ink) #1c2a22 | Текст кнопки |
| Line | var(--line) | Граница, как у Reset demo |
| Accent | #0f6b4c | Не красить эту кнопку акцентным фоном |

Кнопка прозрачная, класс `.export` рядом с `.reset`.

---

## Interaction

- Место: `div.toolbar`, сразу после Reset demo.
- `type="button"`.
- `disabled` при `loading || saving`.
- Клик скачивает `task-board.md`. Ошибку пустой доски эта фаза не показывает.
