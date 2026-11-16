# Verification · 16 November 2026

## Personal notebook with ASCII computational margins

A reference-direction subagent, an ASCII implementation subagent, and a separate review pass were used. Nathan Chen’s page informed the prose-first reading experience. No source, wording, branding, or background artwork was copied.

- `npm run build`: passed, including TypeScript and static generation, using the supported Webpack bundler.
- Final mobile Lighthouse with animation enabled: **98 performance / 100 accessibility / 100 best practices / 100 SEO**. Total blocking time: 160ms; CLS: 0.005. Raw report: ignored `test-results/ascii-lighthouse-mobile.json`.
- Browser QA: desktop, 855px narrow desktop, and 375px mobile; light and dark modes; both neural-network and transformer scenes; readable center column; visible narrow-screen miniature; no horizontal overflow.
- Pause verification: two screenshots of the same background crop, taken apart in time while paused, had identical SHA-256 hashes. Pause preserves the last rendered frame.
- Keyboard-operated native project disclosures opened correctly. Theme and scene controls exposed correct selected states. No console errors recorded.
- Reduced-motion and hidden-tab handling were reviewed in source by the implementation and review agents. OS-level reduced-motion emulation was not available in the browser tool, so no claim of a separate OS-level test is made.

The canvas is capped at 12fps and DPR 1.5. It is decorative, non-interactive, and excluded from the accessibility tree. The controls are reachable through a dedicated skip link.

The current local production preview uses port 3007. No deployment, commit, or Git push was performed. Earlier root files remain preserved. Local performance is a lab measurement; audit the deployed Vercel URL as well.
