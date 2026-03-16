# Sidequest Marketing & Docs Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an Astro Starlight site with a custom dark/electric marketing landing page at `/` and documentation at `/docs/`, deployed to GitHub Pages.

**Architecture:** Astro with Starlight integration handles docs routing and search. The marketing landing page is a standalone Astro page with custom components. Tailwind CSS provides styling with brand tokens defined in a shared config. Fonts are self-hosted.

**Tech Stack:** Astro 5 + Starlight, Tailwind CSS, Bun, GitHub Actions, GitHub Pages

**Design doc:** `docs/plans/2026-03-16-marketing-docs-site-design.md`

---

### Task 1: Scaffold Astro + Starlight Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/content.config.ts`
- Create: `src/content/docs/index.mdx` (minimal placeholder)

**Step 1: Initialize Astro with Starlight**

```bash
cd /Users/kylescully/.sidequest/worktrees/8a547d33-a542-42e0-86ad-895c82b98104
bun create astro@latest . --template starlight --install --no-git --typescript strict
```

If prompted about overwriting, allow it. The `--no-git` flag prevents re-initializing git since this is already a repo.

**Step 2: Install Tailwind CSS integration**

```bash
bun add @astrojs/tailwind tailwindcss @tailwindcss/typography
```

**Step 3: Configure Astro**

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://zieka.github.io',
  base: '/get-sidequest',
  integrations: [
    starlight({
      title: 'Sidequest',
      logo: {
        src: './src/assets/app-icon.png',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/zieka/get-sidequest' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Setup', slug: 'getting-started/setup' },
            { label: 'First Workspace', slug: 'getting-started/first-workspace' },
            { label: 'First Quest', slug: 'getting-started/first-quest' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Quest Types', slug: 'guides/quest-types' },
            { label: 'Supervisor', slug: 'guides/supervisor' },
            { label: 'Journals', slug: 'guides/journals' },
            { label: 'Handoffs', slug: 'guides/handoffs' },
            { label: 'Keyboard Shortcuts', slug: 'guides/keyboard-shortcuts' },
            { label: 'Settings', slug: 'guides/settings' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'Git Worktree Architecture', slug: 'advanced/git-worktrees' },
            { label: 'Toolkit', slug: 'advanced/toolkit' },
            { label: 'Supervisor Customization', slug: 'advanced/supervisor-customization' },
            { label: 'Multi-Project Workflows', slug: 'advanced/multi-project' },
            { label: 'Tmux Configuration', slug: 'advanced/tmux' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Shortcuts Cheat Sheet', slug: 'reference/shortcuts' },
            { label: 'Configuration', slug: 'reference/configuration' },
            { label: 'FAQ', slug: 'reference/faq' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
```

**Step 4: Move app-icon.png to src/assets**

```bash
mkdir -p src/assets
cp app-icon.png src/assets/app-icon.png
```

**Step 5: Verify build**

```bash
bun run build
```

Expected: Build succeeds (may warn about missing docs pages, that's fine).

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro Starlight project with Tailwind"
```

---

### Task 2: Set Up Brand Tokens and Fonts

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/custom.css`
- Create: `public/fonts/` (font files)
- Modify: `astro.config.mjs` (if needed)

**Step 1: Add font files**

```bash
mkdir -p public/fonts
```

Font files needed (user must provide or download):
- `public/fonts/AlphaLyrae-Medium.woff2` (headlines) — obtain from the Sidequest app source at `/Users/kylescully/Repos/sidequest`
- `public/fonts/Satoshi-Variable.woff2` (body) — download from https://www.fontshare.com/fonts/satoshi
- `public/fonts/Satoshi-VariableItalic.woff2`
- `public/fonts/GeistMono-Variable.woff2` (code) — download from Vercel's geist font package

Search for font files in the sidequest repo:
```bash
find /Users/kylescully/Repos/sidequest -name "*.woff2" -o -name "*.woff" -o -name "*.ttf" -o -name "*.otf" | grep -iE "(alpha|lyrae|satoshi|geist)" | head -20
```

Copy any found fonts to `public/fonts/`.

**Step 2: Create Tailwind config**

Create `tailwind.config.mjs`:

```js
import starlightPlugin from '@astrojs/starlight-tailwind';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B0764',
        },
        cyan: {
          DEFAULT: '#38BDF8',
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        surface: '#14141F',
        background: '#0A0A0F',
      },
      fontFamily: {
        heading: ['Alpha Lyrae', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [starlightPlugin(), typographyPlugin()],
};
```

**Step 3: Create custom CSS with font-face declarations and Starlight overrides**

Create `src/styles/custom.css`:

```css
/* Font declarations */
@font-face {
  font-family: 'Alpha Lyrae';
  src: url('/get-sidequest/fonts/AlphaLyrae-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Satoshi';
  src: url('/get-sidequest/fonts/Satoshi-Variable.woff2') format('woff2');
  font-weight: 300 900;
  font-display: swap;
}

@font-face {
  font-family: 'Satoshi';
  src: url('/get-sidequest/fonts/Satoshi-VariableItalic.woff2') format('woff2');
  font-weight: 300 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/get-sidequest/fonts/GeistMono-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* Starlight theme overrides */
:root {
  --sl-color-accent-low: #1E0A3E;
  --sl-color-accent: #7C3AED;
  --sl-color-accent-high: #C4B5FD;
  --sl-color-white: #F8FAFC;
  --sl-color-gray-1: #E2E8F0;
  --sl-color-gray-2: #94A3B8;
  --sl-color-gray-3: #475569;
  --sl-color-gray-4: #1E293B;
  --sl-color-gray-5: #14141F;
  --sl-color-gray-6: #0F0F1A;
  --sl-color-black: #0A0A0F;
  --sl-font: 'Satoshi', system-ui, sans-serif;
  --sl-font-mono: 'Geist Mono', monospace;
}

/* Heading font override for Starlight docs */
:is(h1, h2, h3, h4, h5, h6) {
  font-family: 'Alpha Lyrae', system-ui, sans-serif;
}

/* Force dark mode as default */
:root {
  color-scheme: dark;
}
```

**Step 4: Verify build**

```bash
bun run build
```

Expected: Build succeeds with no font-related errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add brand tokens, fonts, and Starlight theme overrides"
```

---

### Task 3: Build Marketing Page Layout and Navigation

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/layouts/MarketingLayout.astro`
- Create: `src/components/marketing/Navbar.astro`
- Create: `src/components/marketing/Footer.astro`

**Step 1: Create the marketing layout**

Create `src/layouts/MarketingLayout.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const base = import.meta.env.BASE_URL;
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/png" href={`${base}favicon.png`} />
    <link rel="preload" href={`${base}fonts/AlphaLyrae-Medium.woff2`} as="font" type="font/woff2" crossorigin />
    <link rel="preload" href={`${base}fonts/Satoshi-Variable.woff2`} as="font" type="font/woff2" crossorigin />
  </head>
  <body class="bg-background text-white font-body antialiased">
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/custom.css';

  html {
    scroll-behavior: smooth;
  }
</style>
```

**Step 2: Create the navbar**

Create `src/components/marketing/Navbar.astro`:

```astro
---
const base = import.meta.env.BASE_URL;
---

<nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-background/70">
  <div class="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
    <a href={base} class="flex items-center gap-3">
      <img src={`${base}app-icon.png`} alt="Sidequest" class="w-8 h-8 rounded-lg" />
      <span class="font-heading text-lg text-white">Sidequest</span>
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="#features" class="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
      <a href={`${base}docs/`} class="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
      <a href="https://github.com/zieka/get-sidequest" class="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
      <a
        href="https://github.com/zieka/get-sidequest/releases/latest"
        class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-accent to-cyan-400 hover:opacity-90 transition-opacity"
      >
        Download for macOS
      </a>
    </div>
  </div>
</nav>
```

**Step 3: Create the footer**

Create `src/components/marketing/Footer.astro`:

```astro
---
const base = import.meta.env.BASE_URL;
---

<footer class="border-t border-white/5 py-12 px-6">
  <div class="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-3">
      <img src={`${base}app-icon.png`} alt="Sidequest" class="w-6 h-6 rounded-md" />
      <span class="text-sm text-gray-400">&copy; {new Date().getFullYear()} Kyle Scully. All rights reserved.</span>
    </div>
    <div class="flex items-center gap-6">
      <a href={`${base}docs/`} class="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
      <a href="https://github.com/zieka/get-sidequest" class="text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
      <a href="https://github.com/zieka/get-sidequest/releases/latest" class="text-sm text-gray-400 hover:text-white transition-colors">Releases</a>
    </div>
  </div>
</footer>
```

**Step 4: Create the index page shell**

Create `src/pages/index.astro`:

```astro
---
import MarketingLayout from '../layouts/MarketingLayout.astro';
import Navbar from '../components/marketing/Navbar.astro';
import Footer from '../components/marketing/Footer.astro';
---

<MarketingLayout
  title="Sidequest — Your AI development team, orchestrated."
  description="Run parallel Claude Code agents, supervise them automatically, and ship faster than ever."
>
  <Navbar />
  <main class="pt-16">
    <p class="text-center py-40 text-gray-400">Sections coming next...</p>
  </main>
  <Footer />
</MarketingLayout>
```

**Step 5: Verify dev server**

```bash
bun run dev
```

Visit `http://localhost:4321/get-sidequest/`. Verify navbar and footer render. Kill dev server.

**Step 6: Verify build**

```bash
bun run build
```

Expected: Build succeeds.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add marketing page layout, navbar, and footer"
```

---

### Task 4: Build Hero Section

**Files:**
- Create: `src/components/marketing/Hero.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create the hero component**

Create `src/components/marketing/Hero.astro`:

```astro
---
const base = import.meta.env.BASE_URL;
---

<section class="relative overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24">
  <!-- Background grid -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

  <!-- Radial glow -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[128px]" />

  <div class="relative mx-auto max-w-5xl text-center">
    <h1 class="font-heading text-5xl md:text-7xl tracking-tight leading-[1.1] mb-6">
      Your AI development team,
      <span class="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">orchestrated.</span>
    </h1>

    <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
      Run parallel Claude Code agents, supervise them automatically, and ship faster than ever.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <a
        href="https://github.com/zieka/get-sidequest/releases/latest"
        class="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-accent to-cyan-400 hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
      >
        Download for macOS
      </a>
      <a
        href={`${base}docs/`}
        class="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
      >
        Read the docs
      </a>
    </div>

    <!-- Screenshot placeholder -->
    <div class="relative mx-auto max-w-4xl">
      <div class="absolute -inset-4 bg-gradient-to-r from-accent/20 to-cyan-400/20 rounded-2xl blur-2xl" />
      <div class="relative rounded-xl border border-white/10 bg-surface overflow-hidden">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div class="w-3 h-3 rounded-full bg-red-500/50" />
          <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div class="w-3 h-3 rounded-full bg-green-500/50" />
          <span class="ml-2 text-xs text-gray-500">Sidequest</span>
        </div>
        <div class="aspect-[16/10] flex items-center justify-center p-8 text-gray-500 border-2 border-dashed border-white/5 m-4 rounded-lg">
          <div class="text-center">
            <p class="text-sm font-mono mb-2">[SCREENSHOT: Hero]</p>
            <p class="text-xs max-w-md">Kanban quest board with 2-3 active quests running, terminal panel visible below, showing the core Sidequest experience</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Add hero to index page**

Modify `src/pages/index.astro` — replace the placeholder `<p>` tag in `<main>`:

```astro
---
import MarketingLayout from '../layouts/MarketingLayout.astro';
import Navbar from '../components/marketing/Navbar.astro';
import Hero from '../components/marketing/Hero.astro';
import Footer from '../components/marketing/Footer.astro';
---

<MarketingLayout
  title="Sidequest — Your AI development team, orchestrated."
  description="Run parallel Claude Code agents, supervise them automatically, and ship faster than ever."
>
  <Navbar />
  <main class="pt-16">
    <Hero />
  </main>
  <Footer />
</MarketingLayout>
```

**Step 3: Verify build**

```bash
bun run build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add hero section with headline, CTAs, and screenshot placeholder"
```

---

### Task 5: Build Problem Section

**Files:**
- Create: `src/components/marketing/Problem.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create the problem component**

Create `src/components/marketing/Problem.astro`:

```astro
<section class="relative px-6 py-24">
  <div class="mx-auto max-w-3xl text-center">
    <p class="text-sm font-mono text-accent mb-4 tracking-widest uppercase">The problem</p>
    <h2 class="font-heading text-3xl md:text-4xl tracking-tight mb-6">
      One agent isn't enough anymore.
    </h2>
    <p class="text-lg text-gray-400 leading-relaxed">
      You're juggling terminal windows, losing context between sessions, and manually babysitting every prompt.
      Modern development demands parallel execution — but Claude Code gives you one session at a time.
      Sidequest gives you the whole team.
    </p>
  </div>
</section>
```

**Step 2: Add to index page**

Add `import Problem from '../components/marketing/Problem.astro';` and `<Problem />` after `<Hero />`.

**Step 3: Verify build**

```bash
bun run build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add problem statement section"
```

---

### Task 6: Build Feature Showcase

**Files:**
- Create: `src/components/marketing/Features.astro`
- Create: `src/components/marketing/FeatureCard.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create the feature card component**

Create `src/components/marketing/FeatureCard.astro`:

```astro
---
interface Props {
  headline: string;
  description: string;
  screenshotLabel: string;
  screenshotDescription: string;
  reverse?: boolean;
}

const { headline, description, screenshotLabel, screenshotDescription, reverse = false } = Astro.props;
---

<div class={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 py-16`}>
  <!-- Text -->
  <div class="flex-1 text-center md:text-left">
    <h3 class="font-heading text-2xl md:text-3xl tracking-tight mb-4">{headline}</h3>
    <p class="text-lg text-gray-400 leading-relaxed">{description}</p>
  </div>

  <!-- Screenshot placeholder -->
  <div class="flex-1 w-full">
    <div class="relative">
      <div class="absolute -inset-2 bg-gradient-to-r from-accent/10 to-cyan-400/10 rounded-xl blur-xl" />
      <div class="relative rounded-xl border border-white/10 bg-surface overflow-hidden">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div class="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div class="aspect-[16/10] flex items-center justify-center p-6 text-gray-500 border-2 border-dashed border-white/5 m-3 rounded-lg">
          <div class="text-center">
            <p class="text-sm font-mono mb-2">[SCREENSHOT: {screenshotLabel}]</p>
            <p class="text-xs max-w-sm">{screenshotDescription}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Step 2: Create the features section**

Create `src/components/marketing/Features.astro`:

```astro
---
import FeatureCard from './FeatureCard.astro';
---

<section id="features" class="relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <div class="text-center mb-8">
      <p class="text-sm font-mono text-accent mb-4 tracking-widest uppercase">Features</p>
    </div>

    <div class="divide-y divide-white/5">
      <FeatureCard
        headline="Run a team of agents, not just one"
        description="Kanban-style board to manage multiple Claude Code sessions simultaneously. Drag quests between backlog and active. Each quest runs in its own isolated git worktree — no merge conflicts, no stepping on toes."
        screenshotLabel="Quest Board"
        screenshotDescription="Quest board showing Backlog and Active columns, 3-4 quest cards with status indicators, one mid-drag"
      />

      <FeatureCard
        headline="Supervision on autopilot"
        description="A dedicated agent monitors your active quests, auto-answers routine prompts, activates backlog items when slots open, and escalates only what needs your attention."
        screenshotLabel="Supervisor"
        screenshotDescription="Supervisor panel showing auto-approved actions and an escalation notification"
        reverse
      />

      <FeatureCard
        headline="Every discovery, documented"
        description="Automatic markdown summaries of every quest conversation. Decisions, findings, and learnings captured without lifting a finger."
        screenshotLabel="Journals"
        screenshotDescription="Journal view showing a markdown document with quest summary, key decisions section"
      />

      <FeatureCard
        headline="Full Claude Code, zero context switching"
        description="Embedded terminal with the complete Claude Code experience. Switch between active quests instantly. Everything in one window."
        screenshotLabel="Terminal"
        screenshotDescription="Terminal panel with active Claude Code session, quest tabs visible above"
        reverse
      />

      <FeatureCard
        headline="Know what you're spending"
        description="Token usage tracking, cost estimates, and performance metrics across all your projects and quests."
        screenshotLabel="Usage Dashboard"
        screenshotDescription="Usage dashboard showing token charts, cost breakdown, project leaderboard"
      />
    </div>
  </div>
</section>
```

**Step 3: Add to index page**

Add `import Features from '../components/marketing/Features.astro';` and `<Features />` after `<Problem />`.

**Step 4: Verify build**

```bash
bun run build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add feature showcase with 5 alternating feature cards"
```

---

### Task 7: Build Download CTA Section

**Files:**
- Create: `src/components/marketing/DownloadCTA.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create the CTA component**

Create `src/components/marketing/DownloadCTA.astro`:

```astro
<section class="relative px-6 py-32">
  <!-- Background glow -->
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="w-[600px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
  </div>

  <div class="relative mx-auto max-w-3xl text-center">
    <h2 class="font-heading text-4xl md:text-5xl tracking-tight mb-6">
      Ready to run your
      <span class="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">sidequest?</span>
    </h2>
    <p class="text-lg text-gray-400 mb-10">
      Download Sidequest for macOS and start orchestrating your AI development team.
    </p>
    <a
      href="https://github.com/zieka/get-sidequest/releases/latest"
      class="inline-flex items-center px-8 py-4 rounded-xl text-lg font-medium text-white bg-gradient-to-r from-accent to-cyan-400 hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
    >
      Download for macOS
    </a>
  </div>
</section>
```

**Step 2: Add to index page**

Add `import DownloadCTA from '../components/marketing/DownloadCTA.astro';` and `<DownloadCTA />` after `<Features />`.

**Step 3: Verify build**

```bash
bun run build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add download CTA section"
```

---

### Task 8: Create Documentation Stub Pages

**Files:**
- Create: `src/content/docs/getting-started/installation.mdx`
- Create: `src/content/docs/getting-started/setup.mdx`
- Create: `src/content/docs/getting-started/first-workspace.mdx`
- Create: `src/content/docs/getting-started/first-quest.mdx`
- Create: `src/content/docs/guides/quest-types.mdx`
- Create: `src/content/docs/guides/supervisor.mdx`
- Create: `src/content/docs/guides/journals.mdx`
- Create: `src/content/docs/guides/handoffs.mdx`
- Create: `src/content/docs/guides/keyboard-shortcuts.mdx`
- Create: `src/content/docs/guides/settings.mdx`
- Create: `src/content/docs/advanced/git-worktrees.mdx`
- Create: `src/content/docs/advanced/toolkit.mdx`
- Create: `src/content/docs/advanced/supervisor-customization.mdx`
- Create: `src/content/docs/advanced/multi-project.mdx`
- Create: `src/content/docs/advanced/tmux.mdx`
- Create: `src/content/docs/reference/shortcuts.mdx`
- Create: `src/content/docs/reference/configuration.mdx`
- Create: `src/content/docs/reference/faq.mdx`
- Modify: `src/content/docs/index.mdx` (update welcome page)

**Step 1: Create Getting Started docs**

Each file follows this pattern — frontmatter with title and description, then a brief placeholder body indicating what content goes there. Write real content for `installation.mdx` since it already exists in the README:

`src/content/docs/getting-started/installation.mdx`:
```mdx
---
title: Installation
description: Download and install Sidequest on macOS.
---

## Download

1. Go to the [latest release](https://github.com/zieka/get-sidequest/releases/latest)
2. Download the `.dmg` file
3. Open the `.dmg` and drag **Sidequest** into your Applications folder

## First Launch

When you first open Sidequest, macOS may show a security prompt since the app is distributed outside the App Store. Right-click the app and select **Open** to bypass Gatekeeper.
```

All other files: create with frontmatter and a single `> This page is under construction.` placeholder paragraph.

**Step 2: Update the docs index**

`src/content/docs/index.mdx`:
```mdx
---
title: Sidequest Documentation
description: Learn how to use Sidequest to orchestrate parallel Claude Code sessions.
---

Welcome to the Sidequest documentation. Whether you're getting started or looking for advanced configuration, you'll find what you need here.

## Quick Links

- [Installation](/get-sidequest/docs/getting-started/installation/) — Download and set up Sidequest
- [First Quest](/get-sidequest/docs/getting-started/first-quest/) — Run your first parallel agent session
- [Supervisor](/get-sidequest/docs/guides/supervisor/) — Set up automatic quest supervision
- [Keyboard Shortcuts](/get-sidequest/docs/reference/shortcuts/) — Navigate Sidequest like a pro
```

**Step 3: Verify build**

```bash
bun run build
```

Expected: Build succeeds with all docs pages generated.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add documentation structure with stub pages"
```

---

### Task 9: Set Up GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create the workflow file**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Verify the workflow YAML is valid**

```bash
cat .github/workflows/deploy.yml | bun -e "const yaml = await import('yaml'); const fs = require('fs'); const content = fs.readFileSync('/dev/stdin', 'utf8'); yaml.parse(content); console.log('Valid YAML')"
```

Or just verify the build still passes:

```bash
bun run build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Actions workflow for GitHub Pages deployment"
```

---

### Task 10: Update README

**Files:**
- Modify: `README.md`

**Step 1: Update README to reference the new site**

The README should still work as a standalone landing for the GitHub repo, but link to the full site and docs.

Update `README.md`:

```md
<p align="center">
  <img src="app-icon.png" alt="Sidequest" width="128" />
</p>

<h1 align="center">Sidequest</h1>

<p align="center">
  Your AI development team, orchestrated.
</p>

<p align="center">
  <a href="https://zieka.github.io/get-sidequest/">Website</a> &bull;
  <a href="https://zieka.github.io/get-sidequest/docs/">Documentation</a> &bull;
  <a href="https://github.com/zieka/get-sidequest/releases/latest">Download</a>
</p>

---

Run parallel Claude Code agents, supervise them automatically, and ship faster than ever.

## Install on macOS

1. Go to the [latest release](https://github.com/zieka/get-sidequest/releases/latest)
2. Download the `.dmg` file
3. Open the `.dmg` and drag **Sidequest** into your Applications folder
```

**Step 2: Verify build**

```bash
bun run build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "docs: update README with site and docs links"
```

---

### Task 11: Final Verification

**Step 1: Clean build**

```bash
rm -rf dist node_modules
bun install
bun run build
```

Expected: Full clean build succeeds.

**Step 2: Preview locally**

```bash
bun run preview
```

Visit `http://localhost:4321/get-sidequest/` — verify:
- Marketing page renders with navbar, hero, problem, features, CTA, footer
- Screenshot placeholders are visible with descriptions
- Docs link navigates to `/get-sidequest/docs/`
- Docs sidebar shows all sections
- Starlight search works
- Brand colors (violet/cyan) are applied

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any issues from final review"
```
