# Sidequest Marketing & Documentation Site Design

## Overview

A combined marketing landing page and documentation site for the Sidequest macOS app, hosted from the `get-sidequest` distribution repository on GitHub Pages. The marketing page features an HD-2D style (Octopath Traveler-inspired) Three.js village scene as the hero, blending pixel art characters with 3D environments, depth-of-field, and time-of-day-aware lighting.

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
- Dark & electric aesthetic with RPG pixel art identity
- HD-2D style: 2D pixel sprites in 3D environments with bokeh and volumetric lighting
- Existing app characters (Supervisor Robot, Chronicler Owl, Courier Cat) are the brand mascots
- Glassmorphic UI elements (navbar, cards) over the dark background
- Self-hosted fonts (no third-party requests)

## Marketing Landing Page

### Page Flow

1. **Navigation bar** — Fixed, glassmorphic blur background. Logo + wordmark left. Links: Features, Docs, GitHub. Download CTA button right (violet gradient).

2. **Hero section — HD-2D Living Village**

   A full-viewport Three.js scene rendered in Octopath Traveler's HD-2D style. A small RPG village where Sidequest's agent characters go about their work. The camera slowly pans across the village via Theater.js choreography. Lighting dynamically matches the visitor's local time of day.

   **Technical approach:**
   - Three.js for the 3D scene — textured planes for terrain/buildings, billboarded quads for pixel sprites, post-processing (bokeh DoF, bloom, god rays)
   - Theater.js for cinematic camera choreography — smooth, slow panning (~30s loop)
   - Time-aware lighting — reads local time, interpolates between dawn/day/dusk/night palettes. Sun/moon position, sky color, shadow direction, window glow all shift
   - Pixel art sprites — existing 32x32 SVG characters rendered to textures with pixelated rendering. Subtle idle animations (bobbing, blinking)

   **Village buildings (each maps to a feature):**

   | Building | Feature | Character | Activity |
   |----------|---------|-----------|----------|
   | Watchtower | Supervisor | Supervisor Robot | Standing on balcony, antenna glowing, scanning horizon |
   | Library | Journals | Chronicler Owl | Sitting at desk visible through window, writing sparkles |
   | Courier Post | Handoffs | Courier Cat | Walking path carrying scrolls between buildings |
   | Quest Board | Quest Management | (none — focal point) | Wooden board in village square with pinned parchments |
   | Workshop | Terminal | (ambient) | Chimney smoke, faint glow from inside |

   **Atmospheric details (all subtle, "living picture"):**
   - Gentle particles — fireflies at night, dust motes in golden hour, leaves in twilight
   - Faint chimney smoke from the workshop
   - Water feature (stream or fountain) with subtle reflections
   - Trees/foliage with very slight sway
   - Window glows that warm up as it gets darker

   **Camera behavior:**
   - Slow cinematic pan (Theater.js) — ~30s loop traversing the village
   - Slight tilt-shift angle (isometric-ish, matching Octopath perspective)
   - Depth of field keeps focal subject sharp, foreground/background softly blurred

   **Overlay text on the scene:**
   - Headline (Alpha Lyrae): "Your AI development team, orchestrated."
   - Subheadline (Satoshi): "Run parallel Claude Code agents, supervise them automatically, and ship faster than ever."
   - CTAs: "Download for macOS" (primary, gradient) + "Read the docs" (secondary, outline)
   - Subtle dark gradient at bottom edge for text readability

   **Mobile fallback:**
   Fall back to a static pre-rendered image of the village (4 variants: dawn, day, dusk, night) with CSS parallax effect. No GPU drain.

   **Hero-to-page transition:**
   Village stays fixed briefly as user scrolls (parallax sticky) before scrolling away into the feature sections.

3. **The problem** — Brief pain statement about juggling multiple Claude Code sessions, context switching, lack of organization. Clean text section — contrast point between atmospheric hero and practical product pitch.

4. **Feature showcase** — Five features, alternating layout. Each feature card gets a small pixel art icon of the corresponding building/character next to the headline:

   **Feature 1: Parallel Quest Board**
   - Icon: Quest Board pixel art
   - Headline: "Run a team of agents, not just one"
   - Copy: Kanban-style board to manage multiple Claude Code sessions simultaneously. Drag quests between backlog and active. Each quest runs in its own isolated git worktree.
   - `[SCREENSHOT: Quest board showing Backlog and Active columns, 3-4 quest cards with status indicators, one mid-drag]`

   **Feature 2: Supervisor Agent**
   - Icon: Supervisor Robot pixel art
   - Headline: "Supervision on autopilot"
   - Copy: A dedicated agent monitors your active quests, auto-answers routine prompts, activates backlog items when slots open, and escalates only what needs your attention.
   - `[SCREENSHOT: Supervisor panel showing auto-approved actions and an escalation notification]`

   **Feature 3: Journals**
   - Icon: Chronicler Owl pixel art
   - Headline: "Every discovery, documented"
   - Copy: Automatic markdown summaries of every quest conversation. Decisions, findings, and learnings captured without lifting a finger.
   - `[SCREENSHOT: Journal view showing a markdown document with quest summary, key decisions section]`

   **Feature 4: Built-in Terminal**
   - Icon: Workshop pixel art
   - Headline: "Full Claude Code, zero context switching"
   - Copy: Embedded terminal with the complete Claude Code experience. Switch between active quests instantly. Everything in one window.
   - `[SCREENSHOT: Terminal panel with active Claude Code session, quest tabs visible above]`

   **Feature 5: Usage Dashboard**
   - Icon: Trading Post pixel art
   - Headline: "Know what you're spending"
   - Copy: Token usage tracking, cost estimates, and performance metrics across all your projects and quests.
   - `[SCREENSHOT: Usage dashboard showing token charts, cost breakdown, project leaderboard]`

5. **Download CTA** — Final section with download button. Subtle floating pixel art RPG items (sword, potion, scroll) gently bobbing behind the text.

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
- Astro + Starlight (docs framework)
- Three.js (HD-2D village scene)
- Theater.js (camera choreography)
- Tailwind CSS (styling)
- GitHub Pages via GitHub Actions
- Bun as package manager

### Architecture
- Marketing page at `/` — fully custom Astro page with Three.js canvas
- Docs at `/docs/` — Starlight layout, sidebar, search (content in `src/content/docs/docs/`)
- Shared `tailwind.config` with brand tokens
- Fonts self-hosted (Alpha Lyrae, Satoshi, Geist Mono)
- Three.js scene loaded as a client-side component (`client:load` or `client:only="react"`)
- Pixel art assets from the main sidequest app repo copied to `public/sprites/`
- Responsive — full Three.js on desktop, static fallback images on mobile

### Starlight Customization
- Override default theme colors with violet/cyan palette
- Custom CSS for Alpha Lyrae and Satoshi fonts
- Sidebar slugs prefixed with `docs/` (Starlight 0.38 lacks routePrefix)
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
| Hero style | HD-2D Three.js village | Completely unique in dev tools space, ties into app's RPG identity |
| 3D engine | Three.js + Theater.js | Three.js for rendering, Theater.js for cinematic choreography |
| Time-of-day lighting | Dynamic via local time | Site feels alive on every visit, no two visits identical |
| Mobile fallback | Static pre-rendered images | Preserves experience without GPU drain |
| Character integration | Reuse app's existing pixel art | Brand consistency, no new art needed for MVP |
| Social proof | Deferred | No prominent users yet |
| Testimonials | Deferred | No real quotes yet |
| Comparison table | Omitted | Avoid giving competitors exposure |

## Competitor Context

Evaluated against: Air (air.dev), Conductor (conductor.build), Superset (superset.sh), Augment Intent (augmentcode.com/product/intent). All use dark-first design, monospace fonts, hero screenshots, and developer-native aesthetic. Every single one looks the same. Sidequest's HD-2D village hero and RPG identity is a complete departure — unmistakable, memorable, and directly tied to the product's quest metaphor.

## Art Assets Available (from main sidequest repo)

### Character Sprites (SVG pixel art, 32x32 viewBox)
- **SupervisorRobot** — Animated awake/asleep states, glowing antenna, attention indicator
- **ChroniclerOwl** — Animated writing sparkles, pencil bobbing, glasses, robes
- **CourierCat** — Wizard cat with purple robes, star hat, carrying scrolls
- **AwakeRobot** / **SleepyRobot** — Alternate robot states

### RPG Items (SVG pixel art from WelcomeScene)
- PixelSword, PixelScroll, PixelPotion, PixelChest, PixelCrystal, PixelRocket

### Portraits (PNG)
- `supervisor.png`, `chronicler.png`, `wizard-cat.png`

### Other
- `sidequest_map.png` — Fantasy map illustration (grayscale/engraving style, 3MB)
- `app-icon.png` — Application icon

Source paths: `/Users/kylescully/Repos/sidequest/src/components/icons/` and `/Users/kylescully/Repos/sidequest/src/assets/portraits/`
