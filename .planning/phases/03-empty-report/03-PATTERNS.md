# Phase 3: Пустой отчёт - Patterns

**Mapped:** 2026-10-05

## Аналоги

### Баннер ошибки
- Файл: `apps/frontend/src/App.tsx`
- Уже есть `{error ? <p className="banner error">{error}</p> : null}`
- Для пустой доски достаточно setError("Nothing to export"). Новый компонент не создавать.

### Стили баннера
- Файл: `apps/frontend/src/styles.css`
- Класс `.banner.error` уже задаёт цвет var(--danger) #8b2e2e
- CSS не менять

### Проверяемая развилка
- Файл: `apps/frontend/src/report.ts`
- Рядом с buildTaskReport добавить decideExport, по образцу чистых функций groupByStatus в App.tsx
- Тесты дописывать в `apps/frontend/src/report.test.ts`
