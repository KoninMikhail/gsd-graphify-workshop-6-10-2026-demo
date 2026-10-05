# Testing

Во frontend есть Vitest 5 (`apps/frontend`, скрипт `vitest run`). Из корня: `npm test` → `turbo run test`. Первый набор — `apps/frontend/src/report.test.ts` (состав Markdown-отчёта). У backend и `@repo/shared` тестов нет.

Что можно запустить:

| Команда | Что проверяет |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` в workspace-пакетах (после `^build`) |
| `npm run lint` | тот же `tsc --noEmit` |
| `npm run build` | сборка shared, backend и frontend |
| `npm test` | `turbo run test`: vitest во frontend после `^build` |

Ручная проверка доски: `npm run dev`, страница `http://localhost:5173`, здоровье API `GET http://localhost:3001/health` → `{ ok: true }`.

Покрытие и CI-гейт тестов не настроены. Конфиг: `apps/frontend/vitest.config.ts`, среда `node`. См. [workflow.md](./workflow.md), [ci-and-scripts](../02-tooling/ci-and-scripts.md).
