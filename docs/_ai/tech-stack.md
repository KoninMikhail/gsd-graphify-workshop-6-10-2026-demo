# Tech stack

Корневой пакет `gsd-graphify-workshop`, `private`, `"packageManager": "npm@11.13.0"`. Поле `engines` нет: версия Node в репозитории не зафиксирована. Backend импортирует встроенный модуль `node:sqlite`.

## Зависимости (диапазоны из package.json)

| Место | Пакеты |
| --- | --- |
| Корень | `turbo` ^2.5.4, `typescript` ^5.8.3 |
| `@repo/frontend` | `react` / `react-dom` ^19.1.0, `vite` ^6.3.5, `@vitejs/plugin-react` ^4.4.1, `@dnd-kit/core` ^6.3.1, `@dnd-kit/sortable` ^10.0.0, `@dnd-kit/utilities` ^3.2.2 |
| `@repo/backend` | `fastify` ^5.3.3, `@fastify/cors` ^11.0.1, `tsx` ^4.19.4, `@types/node` ^22.15.21 |
| Общее | `@repo/shared` подключается как workspace-зависимость (`*`) |

`@repo/typescript-config` публикует файлы `base.json`, `node.json`, `react.json` (strict, ES2022). Frontend расширяет `react.json` и добавляет `types: ["vite/client"]`. Backend и shared расширяют `node.json` (`NodeNext`, `outDir: dist`).

Шрифты страницы (Fraunces, Manrope) подключаются в `index.html` с `fonts.googleapis.com`. Других внешних сервисов нет.

## Скрипты

Корень делегирует в Turbo:

| Команда | Эффект |
| --- | --- |
| `npm run dev` | `turbo run dev` |
| `npm run build` | `turbo run build` (`dependsOn: ["^build"]`, outputs `dist/**`) |
| `npm run lint` | `turbo run lint` |
| `npm run typecheck` | `turbo run typecheck` |

`lint` и `typecheck` в каждом пакете — `tsc --noEmit` (у frontend `-p tsconfig.json`). В `turbo.json` оба зависят от `^build`. Отдельного ESLint в скриптах нет.

| Пакет | `dev` | `build` | прочее |
| --- | --- | --- | --- |
| frontend | `vite` | `tsc --noEmit && vite build` | `preview`: `vite preview` |
| backend | `tsx watch src/index.ts` | `tsc -p tsconfig.json` | `start`: `node dist/index.js` |
| shared | `tsc -p tsconfig.json --watch` | `tsc -p tsconfig.json` | экспорт `"."` указывает на `dist/` |

Задача `dev` в Turbo: `cache: false`, `persistent: true`.

Тест-раннера нет. См. [testing.md](./testing.md), [workflow.md](./workflow.md), [env](../03-reference/env-and-config.md).
