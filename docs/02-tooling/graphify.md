# Graphify

Репозиторий — пример корпуса для воркшопа graphify.

## Корпус

В собранный граф вошли файлы репозитория, которые не отсекает `.gitignore`:

- TypeScript и JSON в `apps/` и `packages/`
- документация `docs/` и правила в `.cursor/`

Каталог `node_modules` в корпус не входит.

## Состояние в репозитории

Граф собран в `graphify-out/`:

- `graph.json` — граф для `graphify query`, `path`, `explain`
- `GRAPH_REPORT.md` — отчёт
- `graph.html` — интерактивный просмотр в браузере
- `manifest.json` — отпечатки файлов для следующего обновления

Скрипта пересборки нет: каталога `scripts/` в репозитории нет. Обновление уже собранного графа — `graphify update .`.
