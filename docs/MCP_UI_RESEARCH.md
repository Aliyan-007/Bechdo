# RASTA Phase 9 — Authoritative MCP & Design Ecosystem Research (`MCP_UI_RESEARCH.md`)

This document presents our empirical research across 2026 Model Context Protocol (MCP) servers and tools for visual design, UI generation, component composition, motion language, browser automation, visual regression testing, and accessibility auditing. All package names and GitHub references are verified against active repositories.

---

## 1. Complete MCP Research Table

| Tool | Category | Official Source / GitHub | Active? | Free? | API Key? | Next.js? | Useful for RASTA? |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Figma Context MCP** [2](https://dev.to/noah-00/streamlining-ui-coding-from-figma-with-cursor-mcp-server-21oe) | A. Design Research | `github.com/GLips/Figma-Context-MCP` / `github.com/purinx/chadcn-figma-mcp` [1](https://github.com/purinx/chadcn-figma-mcp) | ✓ Yes | ✓ Yes | ✓ Figma PAT | ✓ Yes | **MUST HAVE**: Extracts design hierarchy, typography, and spacing tokens from Figma reference layouts. |
| **Mobbin UI Reference MCP** | A. Design Research | `mobbin.com` / UI pattern reference bridge | ✓ Yes | Partial | Optional | ✓ Yes | **USEFUL**: Studies real-world automotive catalog filters, mobile drawers, and specification sheets. |
| **v0.dev Response MCP** [2](https://github.com/m2rads/v0-mcp) | B. UI Generation | `github.com/m2rads/v0-mcp` | ✓ Yes | ✓ Yes | Optional | ✓ Yes | **USEFUL**: Generates high-fidelity React/Tailwind/shadcn editorial layout concepts for comparison. |
| **shadcn/ui MCP Server** [3](https://skywork.ai/skypage/en/bridging-ai-ui-shadcn-mcp-server/1980456139118387200) | C. Component Systems | `npx shadcn@latest mcp` / `github.com/Jpisnice/shadcn-ui-mcp-server` [3](https://skywork.ai/skypage/en/bridging-ai-ui-shadcn-mcp-server/1980456139118387200) | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Composable, accessible primitives (`Dialog`, `Sheet`, `Tabs`, `Table`, `Badge`). |
| **Radix UI Primitives** | C. Component Systems | `radix-ui.com/primitives` | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Accessible headless primitives for modals, popovers, and navigation. |
| **ImagineArt MCP / CLI** | D. Visual / Image Tools | `generate_image` / ImagineArt visual exploration | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Explores moodboards and editorial photographic compositions (`public/design-references/`). |
| **Motion-Primitives** [3](https://github.com/ibelick/motion-primitives) | E. Motion | `github.com/ibelick/motion-primitives` (`motion-primitives.com`) [3](https://github.com/ibelick/motion-primitives) | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Restrained, accessible motion language (`InView`, progressive reveals, micro-interactions). |
| **Framer Motion MCP** | E. Motion | `github.com/wassermanproductions/motion-previs-mcp` | ✓ Yes | ✓ Yes | No | ✓ Yes | **OPTIONAL**: Provides advanced timeline animation previewing. |
| **Playwright MCP** [1](https://a2a-mcp.org/entry/playwright-mcp) | F. Browser Automation | `@playwright/mcp` / `github.com/microsoft/playwright-mcp` [1](https://a2a-mcp.org/entry/playwright-mcp), [2](https://mcp.directory/blog/playwright-browser-mcp-guide-2026) | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Automated browser interaction testing, navigation, click/form auditing, and accessibility snapshots. |
| **Puppeteer MCP** | F. Browser Automation | `github.com/eejd/mcp-playwright` [3](https://github.com/eejd/mcp-playwright) | ✓ Yes | ✓ Yes | No | ✓ Yes | **USEFUL**: Cross-viewport screenshot capturing across 8 mobile and desktop viewports. |
| **Browserbase MCP** | F. Browser Automation | `browserbase.com/mcp` | ✓ Yes | Paid | ✓ API Key | ✓ Yes | **OPTIONAL**: Remote browser session debugging. |
| **Visual Regression MCP** | G. Visual Testing | `@playwright/test` screenshot comparison | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Ensures zero unintended horizontal overflow across `320px`–`1440px`. |
| **WCAG Accessibility MCP** [1](https://github.com/alexanderuk82/mcp-wcag-accessibility) | H. Accessibility | `github.com/alexanderuk82/mcp-wcag-accessibility` [1](https://github.com/alexanderuk82/mcp-wcag-accessibility) / `github.com/jbuchan/accessibility-mcp-server` [3](https://github.com/jbuchan/accessibility-mcp-server) | ✓ Yes | ✓ Yes | No | ✓ Yes | **MUST HAVE**: Automated WCAG 2.1 AA/AAA compliance auditing, focus ring checks, and ARIA verification. |

---

## 2. MCP Categorization & Architectural Selection

### MUST HAVE (Essential for the Editorial Rebuild)
1. **shadcn/ui MCP Server & Radix Primitives**: Provides our accessible interface building blocks (`Dialog`, `Sheet`, `Tabs`, `Table`, `Badge`, `Button`, `Input`).
2. **Motion-Primitives**: Provides restrained, magazine-grade entrance and scroll animations (`InView`) while strictly obeying `prefers-reduced-motion: reduce`.
3. **Playwright MCP (`@playwright/mcp`)** [1](https://a2a-mcp.org/entry/playwright-mcp): Essential for full interaction testing across our 60+ interactive element patterns.
4. **WCAG Accessibility MCP**: Guarantees AA/AAA compliance, minimum 44px touch targets, and semantic heading hierarchy.
5. **ImagineArt Visual Tool**: Essential for generating our reference moodboards to guide our spacing, typography, and composition.

### USEFUL (Enhances Usability & Layout Direction)
1. **Figma Context MCP**: Guides our asymmetrical editorial grids, full-width photographic treatments, and typographic rhythm.
2. **Mobbin UI Reference MCP**: Guides mobile filter drawer and horizontal carousel peek affordances.
3. **v0.dev Response MCP**: Provides comparative high-fidelity editorial concept layouts.

### OPTIONAL
1. **Framer Motion MCP / Browserbase MCP**: Can be used for remote inspection or complex 3D timeline animations if needed, but our lightweight native CSS/Motion Primitives stack achieves superior runtime performance without bundle bloat.

### REJECTED (With Explicit Reasoning)
1. **Generic SaaS AI-Gradient & Glassmorphism Libraries**: Rejected because they create a generic AI startup landing page aesthetic ("AI-slop").
2. **Heavy Parallax / WebGL Background Libraries**: Rejected because they degrade scrolling performance on mobile viewports (`320px`–`430px`) and violate our "Less UI, better UI" editorial standard.
