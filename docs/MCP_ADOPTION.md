# FlowLink Site MCP Boundary

This customer-facing site remains a minimal sales surface. MCP code is not added to the browser bundle unless a proven customer-facing requirement exists.

## Approved usage
- Playwright patterns: production-page smoke tests, CTA verification, form/checkout navigation checks.
- Mobile MCP: external/mobile QA coverage only.
- FastMCP: backend/shared-service integration only if the site later needs controlled agent actions.

## Excluded from the site runtime
- web3-mcp
- MetaTrader MCP
- MCP Unity
- Kubernetes administration tools
- unrestricted browser automation

## Success criteria
- Homepage and CTA remain fast and understandable.
- Existing Stripe-hosted checkout architecture is preserved.
- No invented testimonials, customers, revenue, or traction.
- Any automation affecting leads or payments is authenticated, auditable, and server-side.
- Mobile and desktop checkout paths receive E2E verification before promotion.
