# RELEASE_GATE.md

## Governing Rule

- **Mobile (360–430px):** Understand → Trust → Act → Pay → Confirm.
- **Desktop (1280–1440px+):** Inspect → Configure → Analyze → Manage → Prove.

## Product-Specific Mobile & Desktop Requirements

| Product | Mobile Non-Negotiable (Must Convert/Act) | Desktop Enhancement (Explain/Manage) |
|---|---|---|
| **FlowLink (Revenue Infrastructure)** | One dominant conversion CTA above the fold. Copy is offer-dependent (e.g., Buy Now, Get Started, Request Setup, Book Call). The gate requires existence and tappability (min 44px height), not a specific label. Trust proof (badge, testimonial, stat) visible nearby. Forms: 1–3 fields max; `font-size: 16px` on inputs to prevent iOS zoom. | Workflow logic, integration connectors, revenue dashboards, and full "gap-closing" explanation. |
| **CreatorFlow (Digital Product)** | Product tile → "Buy" CTA → production checkout (actual stack – Stripe or other) → instant delivery/access → unmissable confirmation. End-to-end fulfillment test on 360–430px must pass before release. | Resource library management, customer logs, pricing editors, fulfillment logs. |
| **LoopVault (Onchain Monitoring)** | Must show: (a) current risk state (safe/alert), (b) single most important active alert, (c) timestamp/evidence context, (d) next safe user action. Do not port the full desktop dashboard. | Full position monitoring, granular risk controls, historical alert evidence, Base chain explorer integrations. |

## Binary Release Rule

If the core commercial path (FlowLink/CreatorFlow) or operational risk-readiness (LoopVault) fails at 360px, 390px, or 430px, the release is blocked—regardless of how polished the desktop build looks.

## Breakpoint Smoke Test (Pre-Deploy)

- [ ] 360px, 390px, 430px – No horizontal scroll. CTAs tappable. Core path passes.
- [ ] 431–767px – Not a separate certification tier, but staging must include an intermediate-width spot check at approximately 600px. A release is blocked if any core commercial or operational action becomes unusable, clipped, obscured, or horizontally inaccessible. Passing at 430px and 768px reduces risk but does not guarantee correctness between them.
- [ ] 768px – Layout bridges gracefully (e.g., 1→2 column dashboards).
- [ ] 1280px, 1440px+ – Full management/analysis views unlock.
- [ ] No critical content or action depends on `:hover`.

## LoopVault Zero-Alert State (Mandatory)

When no active alert exists, LoopVault mobile must clearly display "No active risks detected" together with the timestamp of the last successful monitoring check. The primary detail action must remain available. Empty cards, indefinite loading states, stale status without timestamp, or blank final states fail the release gate.

## AI Model Gateway Security Boundary

External or free model gateways may be used during development only with sanitized, non-sensitive inputs. Production credentials, customer data, wallet secrets, signing material, private repository content, proprietary security logic, production logs, and other restricted information must never be transmitted to untrusted model providers. Runtime production systems must use explicitly approved providers and credential boundaries.

## Final Status

Responsive release gate is now technically sound, logically complete, and security-hardened. It is ready to attach to PR templates and enforce as a real merge/release criterion—not aspirational guidance.

---

**This document is frozen and authoritative. No further edits unless explicitly directed.**