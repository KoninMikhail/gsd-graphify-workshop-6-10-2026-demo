---
phase: 2
slug: safe-text
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-10-05
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest, уже поставленный фазой 1 |
| **Config file** | apps/frontend/vitest.config.ts |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | RPT-04, RPT-05 | T-02-01 | title *Sketch* становится `\*Sketch\*` | unit | `npm test` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | RPT-04 | T-02-02 | `*No tasks*` остаётся литералом каркаса | unit | `npm test` | ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. Новые кейсы дописываются в `apps/frontend/src/report.test.ts`. Отдельный раннер не ставить.

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
