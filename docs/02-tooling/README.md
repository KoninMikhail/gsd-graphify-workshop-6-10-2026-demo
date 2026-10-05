# 02-tooling

Сборка, локальный запуск и проверка типов. Корень — npm workspaces (`apps/*`, `packages/*`) и Turborepo.

| Тема | Документ |
| --- | --- |
| npm- и turbo-скрипты | [ci-and-scripts.md](./ci-and-scripts.md) |
| Корпус graphify | [graphify.md](./graphify.md) |

## Команды из корня

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

`lint` и `typecheck` в пакетах — `tsc --noEmit`. Отдельного тест-раннера в `package.json` нет.

Менеджер пакетов зафиксирован в корневом `package.json`: `npm@11.13.0`.
