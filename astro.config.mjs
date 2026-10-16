import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://zieka.github.io',
  base: '/get-sidequest/',
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
            { label: 'Installation', slug: 'docs/getting-started/installation' },
            { label: 'Setup', slug: 'docs/getting-started/setup' },
            { label: 'First Workspace', slug: 'docs/getting-started/first-workspace' },
            { label: 'First Quest', slug: 'docs/getting-started/first-quest' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Quest Types', slug: 'docs/guides/quest-types' },
            { label: 'Agents and Models', slug: 'docs/guides/agents-and-models' },
            { label: 'Supervisors', slug: 'docs/guides/supervisors' },
            { label: 'Journals', slug: 'docs/guides/journals' },
            { label: 'Handoffs', slug: 'docs/guides/handoffs' },
            { label: 'Council', slug: 'docs/guides/council' },
            { label: 'Recurring Quests', slug: 'docs/guides/recurring-quests' },
            { label: 'GitHub Integration', slug: 'docs/guides/github' },
            { label: 'Changes Panel', slug: 'docs/guides/changes-panel' },
            { label: 'Usage Dashboard', slug: 'docs/guides/usage-dashboard' },
            { label: 'Keyboard Shortcuts', slug: 'docs/guides/keyboard-shortcuts' },
            { label: 'Settings', slug: 'docs/guides/settings' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'Git Worktree Architecture', slug: 'docs/advanced/git-worktrees' },
            { label: 'Smart Router Rules', slug: 'docs/advanced/router-rules' },
            { label: 'Supervisor Customization', slug: 'docs/advanced/supervisor-customization' },
            { label: 'Sidequest CLI', slug: 'docs/advanced/cli' },
            { label: 'Toolkit', slug: 'docs/advanced/toolkit' },
            { label: 'Multi-Project Workflows', slug: 'docs/advanced/multi-project' },
            { label: 'Tmux Configuration', slug: 'docs/advanced/tmux' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Shortcuts Cheat Sheet', slug: 'docs/reference/shortcuts' },
            { label: 'Data and Storage', slug: 'docs/reference/storage' },
            { label: 'FAQ', slug: 'docs/reference/faq' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
