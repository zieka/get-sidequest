# Sidequest Marketing & Documentation Site Design

## Overview

A combined marketing landing page and documentation site for the Sidequest macOS app, hosted from the `get-sidequest` distribution repository on GitHub Pages.

## Brand Identity

### Typography
- **Headlines:** Alpha Lyrae (continuity with the app)
- **Body:** Satoshi (warm, geometric, premium)
- **Code/terminal:** Geist Mono (developer-native)

### Color Palette
- **Background:** Near-black `#0A0A0F` with subtle blue-purple undertone
- **Surface:** Dark gray `#14141F` for cards, panels
- **Primary accent:** Electric violet `#7C3AED`
- **Secondary accent:** Cyan-blue `#38BDF8` for highlights, links, hover states
- **Text primary:** White `#F8FAFC`
- **Text secondary:** Muted gray `#94A3B8`
- **Gradient:** Violet-to-cyan for CTAs and hero elements

### Visual Language
- Dark & electric aesthetic (competitor-informed, Apple-level polish)
- Subtle dot-grid or fine line-grid backgrounds (~5% opacity)
- Glassmorphic cards with subtle blur and border glow
- Accent color glow effects behind key elements (buttons, screenshots)
- Self-hosted fonts (no third-party requests)

## Marketing Landing Page

### Page Flow

1. **Navigation bar** — Fixed, glassmorphic blur background. Logo + wordmark left. Links: Features, Docs, GitHub. Download CTA button right (violet gradient).

2. **Hero section**
   - Headline (Alpha Lyrae): "Your AI development team, orchestrated."
   - Subheadline (Satoshi): "Run parallel Claude Code agents, supervise them automatically, and ship faster than ever."
   - CTAs: "Download for macOS" (primary, gradient) + "Read the docs" (secondary, outline)
   - Full-width app screenshot with violet glow behind it
   - `[SCREENSHOT: Kanban quest board with 2-3 active quests running, terminal panel visible below]`

3. **The problem** — Brief pain statement about juggling multiple Claude Code sessions, context switching, lack of organization.

4. **Feature showcase** — Five features, alternating layout (screenshot left/right):

   **Feature 1: Parallel Quest Board**
   - Headline: "Run a team of agents, not just one"
   - Copy: Kanban-style board to manage multiple Claude Code sessions simultaneously. Drag quests between backlog and active. Each quest runs in its own isolated git worktree.
   - `[SCREENSHOT: Quest board showing Backlog and Active columns, 3-4 quest cards with status indicators, one mid-drag]`

   **Feature 2: Supervisor Agent**
   - Headline: "Supervision on autopilot"
   - Copy: A dedicated agent monitors your active quests, auto-answers routine prompts, activates backlog items when slots open, and escalates only what needs your attention.
   - `[SCREENSHOT: Supervisor panel showing auto-approved actions and an escalation notification]`

   **Feature 3: Journals**
   - Headline: "Every discovery, documented"
   - Copy: Automatic markdown summaries of every quest conversation. Decisions, findings, and learnings captured without lifting a finger.
   - `[SCREENSHOT: Journal view showing a markdown document with quest summary, key decisions section]`

   **Feature 4: Built-in Terminal**
   - Headline: "Full Claude Code, zero context switching"
   - Copy: Embedded terminal with the complete Claude Code experience. Switch between active quests instantly. Everything in one window.
   - `[SCREENSHOT: Terminal panel with active Claude Code session, quest tabs visible above]`

   **Feature 5: Usage Dashboard**
   - Headline: "Know what you're spending"
   - Copy: Token usage tracking, cost estimates, and performance metrics across all your projects and quests.
   - `[SCREENSHOT: Usage dashboard showing token charts, cost breakdown, project leaderboard]`

5. **Download CTA** — Final hero-style section with download button.

6. **Footer** — Links, GitHub, license info.

### Sections Deferred
- Social proof bar (no prominent users yet)
- Testimonials (no real quotes yet)
- Comparison table (avoid giving competitors exposure)

## Documentation Structure

Starlight-powered, at `/docs/`. Same dark theme, same typography.

### Getting Started (end users)
- Installation (download, Gatekeeper, first launch)
- Setup wizard (dependencies: Claude Code CLI, tmux, git)
- Creating your first workspace and project
- Running your first quest

### Guides (end users + power users)
- Quest types: Research vs Changes
- Using the Supervisor
- Journals and knowledge capture
- Handoffs between quests
- Keyboard shortcuts and command palette
- Settings and customization

### Advanced (developers)
- Git worktree architecture
- Toolkit: Skills, Commands, and Agents
- Supervisor prompt customization
- Multi-project workflows
- Tmux modes and configuration

### Reference
- Keyboard shortcuts cheat sheet
- Configuration options
- FAQ / Troubleshooting

## Technical Implementation

### Stack
- Astro + Starlight
- Tailwind CSS
- GitHub Pages via GitHub Actions
- Bun as package manager

### Architecture
- Marketing page at `/` — fully custom Astro page
- Docs at `/docs/` — Starlight layout, sidebar, search
- Shared `tailwind.config` with brand tokens
- Fonts self-hosted (Alpha Lyrae, Satoshi, Geist Mono)
- Screenshot placeholders as styled divs with descriptions and dashed borders
- Responsive (desktop priority, mobile supported)

### Starlight Customization
- Override default theme colors with violet/cyan palette
- Custom CSS for Alpha Lyrae and Satoshi fonts
- Custom head component for shared nav between marketing and docs
- Consistent glassmorphic card styling

### Deployment
- GitHub Actions workflow: build on push to `main`, deploy to GitHub Pages
- Future upgrade path to Vercel/Netlify/Cloudflare if PR previews needed

## Design Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Framework | Astro Starlight | Single repo serves marketing + docs, static output, Markdown-native |
| Hosting | GitHub Pages | Free, integrated with existing GitHub workflow, zero infrastructure |
| Color direction | Dark & electric | Matches competitor landscape, developer audience expectation |
| Typography | Alpha Lyrae + Satoshi + Geist Mono | App continuity + premium feel + developer-native code |
| Social proof | Deferred | No prominent users yet |
| Testimonials | Deferred | No real quotes yet |
| Comparison table | Omitted | Avoid giving competitors exposure |

## Competitor Context

Evaluated against: Air (air.dev), Conductor (conductor.build), Superset (superset.sh), Augment Intent (augmentcode.com/product/intent). All use dark-first design, monospace fonts, hero screenshots, and developer-native aesthetic. Sidequest's richer feature set (supervisor, journals, kanban, handoffs, dashboards) is its key differentiator.
