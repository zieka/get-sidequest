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
            { label: 'Supervisor', slug: 'docs/guides/supervisor' },
            { label: 'Journals', slug: 'docs/guides/journals' },
            { label: 'Handoffs', slug: 'docs/guides/handoffs' },
            { label: 'Keyboard Shortcuts', slug: 'docs/guides/keyboard-shortcuts' },
            { label: 'Settings', slug: 'docs/guides/settings' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'Git Worktree Architecture', slug: 'docs/advanced/git-worktrees' },
            { label: 'Toolkit', slug: 'docs/advanced/toolkit' },
            { label: 'Supervisor Customization', slug: 'docs/advanced/supervisor-customization' },
            { label: 'Multi-Project Workflows', slug: 'docs/advanced/multi-project' },
            { label: 'Tmux Configuration', slug: 'docs/advanced/tmux' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Shortcuts Cheat Sheet', slug: 'docs/reference/shortcuts' },
            { label: 'Configuration', slug: 'docs/reference/configuration' },
            { label: 'FAQ', slug: 'docs/reference/faq' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
