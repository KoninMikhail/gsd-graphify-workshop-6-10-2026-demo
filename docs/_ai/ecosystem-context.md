# Ecosystem context

Это один git-репозиторий `gsd-graphify-workshop`. Рядом в коде не описаны другие сервисы, с которыми приложение обязано говорить.

Состав:

- браузер открывает Vite-приложение `@repo/frontend`;
- то же приложение в dev ходит на `@repo/backend` через proxy;
- оба пакета делят типы из `@repo/shared`.

Аутентификации и отдельного auth-сервиса нет. Загрузчика файлов, биллинга и аналитики нет. Шрифты в `index.html` запрашиваются с хоста Google Fonts; на API это не влияет.

Контракт между UI и API — функции `apps/frontend/src/api.ts` и типы `packages/shared`. Отдельного опубликованного SDK нет.

См. [architecture.md](./architecture.md), [integrations](../01-architecture/integrations.md), [auth](../01-architecture/auth-and-security.md).
