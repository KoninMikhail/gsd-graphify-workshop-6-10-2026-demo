# 00-start — онбординг

Быстрый вход в **gsd-graphify-workshop**: учебная kanban-доска (колонки `todo`, `in_progress`, `done`).

| Документ | Назначение |
| --- | --- |
| [local-setup.md](./local-setup.md) | Установка, адреса, прокси `/api` |
| [local-infra-options.md](./local-infra-options.md) | Файл SQLite `apps/backend/data/tasks.db` |
| [dev-workflow.md](./dev-workflow.md) | Команды из корня репозитория |
| [common-issues.md](./common-issues.md) | Занятые порты, зависимости, прокси |
| [onboarding-checklist.md](./onboarding-checklist.md) | Чеклист первого запуска |

## Что нужно

- **Node.js** — процесс backend (`node:sqlite`) и frontend (Vite).
- **npm** — в корневом `package.json` поле `packageManager`: `npm@11.13.0`.

Отдельный сервер базы не нужен. Backend сам создаёт файл SQLite. Подробности — [local-infra-options.md](./local-infra-options.md).

## Первые шаги

Из корня репозитория:

```bash
npm install
npm run dev
```

- UI: `http://localhost:5173`
- API: `http://localhost:3001` (`GET /health` → `{ "ok": true }`)

Дальше — [local-setup.md](./local-setup.md).

## Контекст продукта

- [project-brief.md](../_ai/project-brief.md)
- [product-context.md](../_ai/product-context.md)
- [tech-stack.md](../_ai/tech-stack.md)
