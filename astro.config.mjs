import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

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
