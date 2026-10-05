# Testing

Автоматических тестов в репозитории нет. Нет скрипта `test`, нет файлов `*.test.*` и `*.spec.*`, тест-раннер в зависимости не добавлен.

Что можно запустить:

| Команда | Что проверяет |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` в workspace-пакетах (после `^build`) |
| `npm run lint` | тот же `tsc --noEmit` |
| `npm run build` | сборка shared, backend и frontend |

Ручная проверка доски: `npm run dev`, страница `http://localhost:5173`, здоровье API `GET http://localhost:3001/health` → `{ ok: true }`.

Покрытие, фикстуры и CI-гейт тестов не настроены. См. [workflow.md](./workflow.md), [ci-and-scripts](../02-tooling/ci-and-scripts.md).
