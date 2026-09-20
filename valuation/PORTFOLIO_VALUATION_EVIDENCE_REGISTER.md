# Portfolio Valuation Evidence Register

**Owner:** FlowLink Revenue AI LLC / Zachary Ribble  
**As of:** 2026-09-20  
**Purpose:** Prevent provisional valuation assumptions from being mistaken for formal evidence.

## Evidence labels

- **FORMAL** — repository/component inventory has been completed with traceable reconstruction hours and documented compensation/rate sources, or a documented market-comparable set has been assembled and normalized.
- **PROVISIONAL** — a screening estimate or partial evidence exists, but one or more formal requirements remain open.
- **PENDING** — no formal repository-hour inventory or defensible market-comparable set has been completed.
- **N/A / EXCLUDED** — third-party, duplicate, empty, support-only, or otherwise excluded from standalone portfolio valuation until ownership/scope is resolved.

A GitHub repository is evidence of implementation scope, **not** evidence of historical hours worked. Commit counts, lines of code, file counts, issue counts, or repository size must not be converted directly into labor hours.

## Portfolio-wide valuation rule

A project may carry a replacement-cost indication only when the record identifies:
1. canonical repository/repositories;
2. component/workstream inventory;
3. reconstruction-hour basis by workstream;
4. documented market compensation/rate source, date, geography, and role mapping;
5. reusable/open-source/shared-component deductions;
6. unfinished-work and technical-obsolescence adjustments;
7. calculation date and reviewer.

A project may carry a market indication only when the record identifies:
1. genuinely comparable software/IP/licensing transactions or offers;
2. source and date;
3. rights transferred or licensed;
4. maturity/revenue/customer context;
5. transaction structure;
6. normalization adjustments;
7. reason the comparable is applicable.

Asking prices, grant amounts, hypothetical revenue, list prices, founder targets, and generic SaaS multiples are **not** market comparables.

## Current register

| Project / asset | Canonical repository | Repository-hour inventory | Market comp set | Current valuation evidence status | Required closure |
|---|---|---:|---:|---|---|
| Chimera Adaptive Substrate | `tokencraft1390/chimera-adaptive-substrate` | **PROVISIONAL** | **PENDING** | Preliminary replacement-cost screening of **$30,000–$66,000** exists; not a certified appraisal or FMV conclusion. Reconstruction hours remain scenario assumptions. | Independent component/hour review; rate-source schedule; OSS/reuse/obsolescence adjustments; middleware/control-plane licensing comps. |
| LoopVault | `tokencraft1390/LoopVault-` | **PENDING** | **PENDING** | Commercial pilot evidence exists separately, but does not establish asset value. | Inventory monitor/API/evidence/dashboard workstreams; benchmark rates; DeFi monitoring/risk-data licensing comps. |
| FlowLink Revenue Platform / CreatorFlow | `tokencraft1390/revenue-platform`; `creatorflow-direct-sales-page`; `FlowLink_site` | **PENDING** | **PENDING** | Product/pricing artifacts exist; no formal asset valuation evidence set. | De-duplicate shared platform code; component-hour inventory; AI automation/SaaS asset or licensing comps. |
| Missed Call Rescue | `tokencraft1390/flowlink-missed-call-rescue` | **PENDING** | **PENDING** | Hackathon/runtime work is implementation evidence, not valuation evidence. | Inventory agent workflow, adapters, tests, deployment and docs; benchmark rates; comparable agent/workflow licensing or small software asset transactions. |
| FlowLink Payments | `tokencraft1390/flowlink-payments` | **PENDING** | **PENDING** | Separate support/payment asset; no formal standalone valuation. | Inventory only proprietary payment/orchestration work; exclude third-party payment rails; comps only if standalone rights are commercially transferable. |
| Revenue Leak Sprint | `tokencraft1390/flowlink-revenue-leak-sprint` | **PENDING** | **PENDING** | Small/support asset; standalone value unproven. | Determine whether absorbed into Revenue Platform; avoid double counting. |
| SWL / Sw.iska Protocol | `tokencraft1390/Sw.iska` | **PENDING** | **PENDING** | Protocol implementation exists; no formal cost/market evidence set. | Protocol/module/test/docs inventory; benchmark rates; protocol/middleware licensing comps. |
| Sw.iska1 | `tokencraft1390/Sw.iska1` | **N/A / EXCLUDED** | **N/A / EXCLUDED** | Apparent duplicate/minimal repository. | Resolve provenance and relationship to `Sw.iska`; do not double count. |
| ISKA.w | `tokencraft1390/ISKA.w` | **N/A / EXCLUDED** | **N/A / EXCLUDED** | Empty repository at current snapshot. | Establish substantive owned implementation before valuation. |
| Beta Bot Swarm | `tokencraft1390/Beta-Bot-swarm` | **PENDING** | **PENDING** | Dry-run/prototype evidence exists; no formal valuation evidence set. | Inventory engine, accounting, gates, tuner, harness, CI/docs; benchmark rates; trading infrastructure/tooling comps with execution maturity normalized. |
| M.M. Academy | `tokencraft1390/MM_Academy-private-` | **PENDING** | **PENDING** | Must remain separately valued until provenance/ownership/licensing/security/trademark record is complete. | Recover full source/build scope; provenance and dependency audit; component-hour inventory; educational/game software comps. |
| AETERNIA platform | `tokencraft1390/AETERNIA` | **PENDING** | **PENDING** | Early platform implementation; no formal valuation evidence set. | Separate shared platform shell from game-specific work; inventory wallet/NFC/program/UI/state work; game/IP licensing comps normalized for maturity. |
| AETERNIA: Ecosystem | `tokencraft1390/ecosystem` | **PENDING** | **PENDING** | Separate game asset within AETERNIA; avoid shared-code double count. | Game-specific component/hour inventory after shared platform deductions; comparable indie/social game asset transactions. |
| AETERNIA: Sigil | `tokencraft1390/sigil` | **N/A / EXCLUDED** | **PENDING** | Repository currently has no substantive size in the accessible snapshot. | Confirm canonical implementation location before assigning replacement cost. |
| AETERNA GPT / WMPC MVP | `tokencraft1390/AETERNA_GPT_WMPC_MVP` | **PENDING** | **PENDING** | Separate prototype asset; no formal valuation evidence set. | Inventory proprietary orchestration/UI/data work; exclude model-provider IP; comparable AI application licensing/asset transactions. |
| Chimera Quest Showcase | `tokencraft1390/chimeras-quest-showcase` | **PENDING** | **PENDING** | Showcase/support asset; potential dependency on Chimera brand/IP. | Determine standalone vs marketing/demo classification; deduct shared Chimera assets before any standalone value. |
| Chimera Bot Private | `tokencraft1390/chimera-bot-private` | **PENDING** | **PENDING** | Related Chimera implementation; standalone status unresolved. | Map overlap with Adaptive Substrate and Quest; inventory only non-duplicative proprietary components. |
| Cyber Stag CyberSecure | `tokencraft1390/cyber-stag-cybersecure` | **PENDING** | **PENDING** | Active security product; legal/provenance and authorized-use controls are separate valuation gates. | Component-hour inventory across UI/controller/policy/evidence/integrations/tests/docs; third-party dependency deductions; security tooling/licensing comps. |
| Bounty Bot | `tokencraft1390/Bounty_Bot-1` | **PENDING** | **PENDING** | New bounded bounty/audit workflow asset; copied concepts must not create double counting with Cyber Stag. | Inventory only independently owned/adapted implementation; map shared architecture; bounty automation/tooling comps. |
| HexStrike MCP | `tokencraft1390/hexstrike-mcp` | **PENDING** | **PENDING** | Security-lab/controller support asset; standalone commercial rights need review. | Separate proprietary controller/policy code from upstream tools/images; inventory only owned work; comps only after licensing review. |
| EMP_333 | `tokencraft1390/EMP_333` | **N/A / EXCLUDED** | **N/A / EXCLUDED** | Empty repository at current snapshot. | Define owned scope before valuation. |
| advisory-database | `tokencraft1390/advisory-database` | **N/A / EXCLUDED** | **N/A / EXCLUDED** | Third-party/upstream-style repository; excluded from owned-IP valuation unless independent proprietary additions are proven. | Provenance/delta review only. |
| awesome-copilot | `tokencraft1390/awesome-copilot` | **N/A / EXCLUDED** | **N/A / EXCLUDED** | Third-party/upstream-style repository; excluded from owned-IP valuation unless independent proprietary additions are proven. | Provenance/delta review only. |
| hiddify.com | `tokencraft1390/hiddify.com` | **N/A / EXCLUDED** | **N/A / EXCLUDED** | Third-party/upstream-style repository; excluded from owned-IP valuation unless independent proprietary additions are proven. | Provenance/delta review only. |

## Reconciliation rule

Portfolio totals must be reconciled only after the adjustment/de-duplication layer. Shared architecture, copied/adapted modules, common documentation, common deployment scaffolding, open-source dependencies, and upstream code are counted once or deducted.

**Cost Approach:** repository/component inventory → reconstruction hours → documented market rates → reuse/OSS/shared-work deductions → unfinished-work/obsolescence adjustments.

**Market Approach:** documented comparable transactions/licenses → rights/maturity/revenue normalization → applicability assessment.

**Income Approach:** actual attributable revenue, signed contracts, or supportable cash flows only. Prices, targets, grant asks, and hypothetical scenarios are not income evidence.

## Portfolio status as of 2026-09-20

No project is marked **FORMAL** for both repository-hour inventory and market-comparable evidence. Chimera is the most developed valuation case, but its repository-hour basis remains **PROVISIONAL** and its market comparable set remains **PENDING**.

Until a row reaches the evidence standard above, any dollar range attached to it must be labeled **screening**, **provisional**, **asking anchor**, or **scenario**, as applicable, and must not be represented as a certified appraisal, fair-market value, collateral value, tax value, or fairness opinion.
