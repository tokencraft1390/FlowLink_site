# Platform Independence Standard

## Purpose

FlowLink products must remain usable and distributable without depending on approval from a single app store, device vendor, hosting provider, payment processor, or identity provider.

## Distribution policy

1. Web and PWA delivery is the primary compatibility path whenever the product can reasonably operate in a browser.
2. Native Android packages are optional distribution targets, not the canonical product.
3. Android packages must be signed with project-controlled signing keys. Signing material must never be committed to source control.
4. Store registration or developer verification may be used for compatibility and reach, but must not become the sole source of application identity, business logic, customer data, or release history.
5. Source, build instructions, release metadata, and integrity hashes should remain independently recoverable.

## Architecture requirements

- Keep core business logic and data services independent from Google Play APIs unless a feature genuinely requires them.
- Isolate vendor-specific integrations behind adapters so they can be replaced.
- Avoid hard-coded assumptions that installation or payment must originate from one marketplace.
- Keep deployable web assets portable across standards-compatible hosts.
- Maintain an export/backup path for critical business data and configuration.
- Treat package names, signing keys, domains, and repository history as controlled project assets.

## Android release requirements

For any Android build:

- Preserve a standards-based web/PWA route where technically practical.
- Keep the APK/AAB build reproducible from the repository and documented build environment.
- Record package name, version, signing-key fingerprint, build commit, and artifact SHA-256 for each release.
- Back up signing keys securely in more than one controlled location.
- Never place signing keys or recovery secrets in GitHub, CI logs, public artifacts, or client-side code.
- Google Play or Android developer verification may be supported, but independent ownership of the package identity and signing chain is mandatory.

## Release gate

A release should not be considered platform-independent if removing any one external marketplace or hosting vendor would permanently prevent the team from rebuilding, operating, migrating, or distributing the product.

## Current strategy

FlowLink remains web-first. Android-native packaging, if introduced, will be an additional distribution layer rather than a dependency for the underlying product.
