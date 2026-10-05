# Скрипты и CI

CI-конфигурации в репозитории нет. Проверены корень и типичные каталоги: `.github/`, `.gitlab/`, `.circleci/` отсутствуют. Файлов `Jenkinsfile`, `azure-pipelines.yml`, `bitbucket-pipelines.yml` нет.

## Корень

`package.json`, имя пакета `gsd-graphify-workshop`.

| Скрипт | Команда |
| --- | --- |
| `build` | `turbo run build` |
| `dev` | `turbo run dev` |
| `lint` | `turbo run lint` |
| `typecheck` | `turbo run typecheck` |

Зависимость разработки: `turbo` `^2.5.4`, `typescript` `^5.8.3`.

## turbo.json

| Задача | Поведение |
| --- | --- |
| `build` | `dependsOn: ["^build"]`, выход `dist/**` |
| `dev` | `cache: false`, `persistent: true` |
| `lint` | `dependsOn: ["^build"]` |
| `typecheck` | `dependsOn: ["^build"]` |

Пакет без своих `scripts` в turbo-задачи не попадает. У `@repo/typescript-config` скриптов нет: это общие `base.json`, `node.json`, `react.json`.

## @repo/backend (`apps/backend`)

| Скрипт | Команда |
| --- | --- |
| `build` | `tsc -p tsconfig.json` |
| `dev` | `tsx watch src/index.ts` |
| `start` | `node dist/index.js` |
| `typecheck` | `tsc -p tsconfig.json --noEmit` |
| `lint` | `tsc -p tsconfig.json --noEmit` |

## @repo/frontend (`apps/frontend`)

| Скрипт | Команда |
| --- | --- |
| `dev` | `vite` |
| `build` | `tsc -p tsconfig.json --noEmit && vite build` |
| `preview` | `vite preview` |
| `typecheck` | `tsc -p tsconfig.json --noEmit` |
| `lint` | `tsc -p tsconfig.json --noEmit` |

## @repo/shared (`packages/shared`)

| Скрипт | Команда |
| --- | --- |
| `build` | `tsc -p tsconfig.json` |
| `dev` | `tsc -p tsconfig.json --watch` |
| `typecheck` | `tsc -p tsconfig.json --noEmit` |
| `lint` | `tsc -p tsconfig.json --noEmit` |

`lint` и `typecheck` во всех трёх пакетах — одна и та же проверка `tsc --noEmit`. Отдельного тест-раннера в скриптах нет.
