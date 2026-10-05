---
phase: 1
slug: report-shape
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-10-05
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x (ставится планом 01-01) |
| **Config file** | apps/frontend/vitest.config.ts — none until Wave 0 |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test` после появления скрипта; до него `npm run typecheck`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | RPT-01, RPT-02, RPT-03 | T-01-02 | В тексте нет id, createdAt, updatedAt | unit | `npm test` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | RPT-01 | — | Кнопка вызывает downloadTaskReport(tasks) | grep | `npm run typecheck` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | RPT-01, RPT-02, RPT-03 | T-01-02 | Три демо-задачи и *No tasks* | unit | `npm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/frontend/src/report.test.ts` — кейсы состава файла
- [ ] `apps/frontend/vitest.config.ts` — environment node
- [ ] `vitest` в devDependencies `@repo/frontend`
- [ ] корневой скрипт `test`: `turbo run test`
- [ ] задача `test` в `turbo.json` с `dependsOn: ["^build"]`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Браузер кладёт task-board.md в загрузки | RPT-01 | Клик и диалог загрузок не поднимаются в node | Открыть доску, нажать Export markdown, открыть файл |

*Автоматические проверки покрывают текст файла. Клик остаётся ручным.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
