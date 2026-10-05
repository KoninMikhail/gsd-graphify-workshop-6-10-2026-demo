---
name: create-pr
description: >-
   Create pull request: git diff summary, test plan, Kaiten card link. Universal, user-level.
   Use when create PR, pull request, опиши PR, test plan, gh pr create.
---

# Create Pull Request

Универсальный workflow описания и создания PR. Полностью architecture-agnostic.

## Когда применять

- Пользователь просит создать PR или описать pull request.
- После `code-review` без blockers.
- Ветка готова к review.

## Workflow

```
- [ ] 1. git status — нет ли незакоммиченного мусора
- [ ] 2. git log + git diff <base>...HEAD — полная картина ветки
- [ ] 3. Сверить с задачей / Kaiten AC
- [ ] 4. Составить Summary + Test plan (шаблон ниже)
- [ ] 5. Показать пользователю title + body
- [ ] 6. Push + gh pr create — только по явной просьбе
```

## Сбор контекста

Параллельно (если доступно):

```bash
git status
git diff
git log --oneline -10
git diff main...HEAD   # base branch — уточнить у пользователя или из remote
```

Учитывать **все** коммиты ветки, не только последний.

## Шаблон PR body

```markdown
## Summary

- …
- …

## Test plan

- [ ] …
- [ ] …

## Kaiten

Refs: #12345678
```

### Summary

- 1–3 bullet: **что** и **зачем** (не построчный changelog).
- Если breaking change — явно указать.

### Test plan

Чеклист для QA и ревьюера:

- Happy path из AC.
- Negative / edge cases.
- Регрессия смежных областей (если затронуты).
- Команды для локальной проверки (`npm run test`, … — из проекта).

### Kaiten

- `Refs: #card_id` в body или footer.
- Кратко: какие AC закрывает PR.

## Title

- Как в Conventional Commits, если принято в репо — см. `commit-messages` и `git log`.
- Или краткое описание фичи/фикса на языке команды.
- ≤ ~100 символов.

## Push и create

**Только по явной просьбе пользователя:**

```bash
git push -u origin HEAD
gh pr create --title "…" --body "$(cat <<'EOF'
## Summary
…

## Test plan
- [ ] …

Refs: #12345678
EOF
)"
```

Не push без просьбы. Не force-push. Не `--no-verify`.

## Anti-patterns

- PR description = список файлов без смысла.
- Test plan «проверил локально» без конкретных шагов.
- Один bullet summary на 15 коммитов разного смысла — предложить split PR.
- Секреты в description.

## Связанные skills

| Skill                     | Когда                              |
| ------------------------- | ---------------------------------- |
| `commit-messages`         | Стиль заголовка, если conventional |
| `code-review`             | Перед созданием PR                 |
| `fix-bug` / `write-tests` | Контекст фикса и тест-план         |
