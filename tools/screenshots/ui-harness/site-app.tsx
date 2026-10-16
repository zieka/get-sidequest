/**
 * The whole Sidequest shell against synthetic data, for marketing screenshots.
 * Mirrors src/main.tsx with the Tauri bridge faked by site-shim.ts.
 */
import { init as initGhostty } from 'ghostty-web'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../../src/App'
import { FontSizeEffects } from '../../src/components/FontSizeEffects'
import { I18nEffects } from '../../src/components/I18nEffects'
import { SettingsEffects } from '../../src/components/SettingsEffects'
import { SettingsInitializer } from '../../src/components/SettingsInitializer'
import { ThemeEffects } from '../../src/components/ThemeEffects'
import { TooltipProvider } from '../../src/components/ui/tooltip'
import { appStore } from '../../src/lib/store'
import {
  ANALYSES,
  CHANGED_FILES,
  DIFF_STATS,
  GITHUB_LINKS,
  HOME,
  JOURNAL_ENTRIES,
  JOURNAL_HITS,
  NOW,
  PROJECTS,
  QUESTS,
  QUEST_ISSUES,
  SESSIONS,
  SETTINGS,
  SUPERVISORS,
  WORKING,
  WORKSPACES,
} from './site-fixtures'
import { installSiteShim } from './site-shim'
import { TRANSCRIPT } from './site-transcript'
import '../../src/i18n'
import '../../src/index.css'

const JOURNAL_BODY: Record<string, string> = {
  default: `---
id: jn_01ACME
date: 2026-10-13
project: api-gateway
source: auto
tags: [rate-limit, orders, api-keys]
summary: Keying on client IP throttled the whole office; limits now hang off the API key.
---

# Orders rate limits must be per API key, not per IP

## What I expected

A per-IP token bucket in front of \`POST /orders\` would be enough to stop one noisy client from starving the rest.

## What is actually true

Every request from the office NAT shares one IP, so a single busy integration throttled everyone behind it. The limiter now keys on the API key from the \`Authorization\` header and only falls back to IP for unauthenticated calls. Over-limit requests get a 429 with \`Retry-After\`.

## How I confirmed it

\`test/orders.rateLimit.test.ts\` drives two keys through one IP and asserts the second key is never throttled by the first. Limits are read from \`ORDERS_RATE_LIMIT_PER_MINUTE\` and \`ORDERS_RATE_LIMIT_BURST\`.
`,
}

const encoder = new TextEncoder()
const bytes = (text: string) =>
  btoa(String.fromCharCode(...encoder.encode(text)))

const shim = installSiteShim(
  {
    settings: SETTINGS,
    workspaces: WORKSPACES,
    projects: PROJECTS,
    quests: QUESTS,
    supervisors: SUPERVISORS,
    quest_issues: QUEST_ISSUES,
    agent_profiles: [],
    recurring_quests: [],
    project_intel_catalog: [],
  },
  {
    home_dir: HOME,
    ensure_supervisor_skill: null,
    reconcile_sessions: SESSIONS,
    list_active_sessions: SESSIONS,
    check_session_health: true,
    check_session_health_deep: { alive: true, attached: true, pane_alive: true },
    has_claude_conversation: true,
    spawn_claude_session: ({ questId, workingDir }: Record<string, unknown>) =>
      SESSIONS.find((s) => s.quest_id === questId) ?? {
        id: `sq-${questId}`,
        quest_id: questId,
        working_dir: workingDir,
        started_at: NOW,
        is_new: false,
      },
    spawn_agent_session: ({ questId, workingDir }: Record<string, unknown>) =>
      SESSIONS.find((s) => s.quest_id === questId) ?? {
        id: `sq-${questId}`,
        quest_id: questId,
        working_dir: workingDir,
        started_at: NOW,
        is_new: false,
      },
    redraw_session: ({ sessionId }: Record<string, unknown>) => {
      const text = TRANSCRIPT[String(sessionId)] ?? TRANSCRIPT.default
      shim.emit(`session:output:${sessionId}`, bytes(`\x1b[H\x1b[2J${text}`))
      return null
    },
    get_resource_usage: {
      total_memory: 64 * 1024 ** 3,
      used_memory: 31 * 1024 ** 3,
      total_cpu_percent: 23,
      quests: SESSIONS.filter((s) => WORKING.has(s.quest_id)).map((s) => ({
        quest_id: s.quest_id,
        session_name: s.id,
        cpu_percent: 12,
        memory_bytes: 420 * 1024 ** 2,
        child_process_count: 3,
      })),
    },
    get_batch_branch_diff_stats: ({ questIds }: Record<string, unknown>) =>
      ((questIds as string[]) ?? Object.keys(DIFF_STATS)).map((quest_id) => ({
        quest_id,
        stats: DIFF_STATS[quest_id] ?? null,
        error: null,
      })),
    get_branch_diff_stats: DIFF_STATS['q-rate-limit'],
    get_github_links: GITHUB_LINKS,
    get_git_status: {
      files: CHANGED_FILES,
      unstaged_files: CHANGED_FILES,
      viewing_path: `${HOME}/.sidequest/worktrees/q-rate-limit`,
      merge_base: 'a1b2c3d',
    },
    get_all_changes_since_branch: {
      files: CHANGED_FILES,
      unstaged_files: [],
      viewing_path: `${HOME}/.sidequest/worktrees/q-rate-limit`,
      merge_base: 'a1b2c3d',
    },
    get_current_branch: 'main',
    get_default_branch: 'main',
    list_branches: ['main', 'develop', 'release/2.4'],
    detect_remote_type: 'github',
    get_remote_url: 'https://github.com/acme/api-gateway',
    analyze_project: ({ projectId }: Record<string, unknown>) => {
      const a = ANALYSES[String(projectId)] ?? { languages: [], frameworks: [] }
      return {
        project_id: projectId,
        languages: a.languages.map((name) => ({ name, version: null, prevalence: 1 })),
        frameworks: a.frameworks.map((name) => ({ name, version: null })),
        build_tools: [],
        artifacts_produced: [],
        artifacts_consumed: [],
        analyzed_at: NOW,
      }
    },
    get_all_project_analyses: Object.entries(ANALYSES).map(([project_id, a]) => ({
      project_id,
      languages: a.languages.map((name) => ({ name, version: null, prevalence: 1 })),
      frameworks: a.frameworks.map((name) => ({ name, version: null })),
      build_tools: [],
      artifacts_produced: [],
      artifacts_consumed: [],
      analyzed_at: NOW,
    })),
    list_journal_entries: JOURNAL_ENTRIES,
    recent_journal_entries: JOURNAL_HITS,
    search_journal_entries: JOURNAL_HITS,
    read_text_file: ({ path }: Record<string, unknown>) => JOURNAL_BODY[String(path).split('/').pop() ?? ''] ?? JOURNAL_BODY.default,
    read_journal_entry: `---\nid: jn_01ACME\ndate: 2026-10-13\nproject: api-gateway\nsource: auto\ntags: [rate-limit, orders, api-keys]\nsummary: Keying on client IP throttled the whole office; limits now hang off the API key.\n---\n\n# Orders rate limits must be per API key, not per IP\n\n## What I expected\n\nA per-IP token bucket in front of \`POST /orders\` would be enough.\n\n## What is actually true\n\nEvery request from the office NAT shares one IP, so a single busy client starved everyone else. The limiter now keys on the API key from the \`Authorization\` header and falls back to IP only for unauthenticated calls.\n\n## How I confirmed it\n\n\`test/orders.rateLimit.test.ts\` drives two keys through one IP and asserts the second key is never throttled by the first.\n`,
    list_supervisors: SUPERVISORS.map((s) => ({
      ...s,
      enabled: !!s.enabled,
      auto_answer_enabled: !!s.auto_answer_enabled,
      auto_start_enabled: !!s.auto_start_enabled,
      pull_backlog_enabled: !!s.pull_backlog_enabled,
      extended_prompt_enabled: !!s.extended_prompt_enabled,
      close_quest_enabled: !!s.close_quest_enabled,
    })),
    list_running_supervisor_sessions: ['s-platform'],
    check_supervisor_session: true,
    check_dependency: ({ name }: Record<string, unknown>) => ({
      name,
      installed: true,
      version: name === 'tmux' ? '3.5a' : name === 'git' ? '2.47.0' : '2.1.0',
    }),
    check_hook_status: {
      installed: true,
      hook_script_exists: true,
      claude_settings_configured: true,
    },
    check_claude_code_update: { installed: '2.1.0', latest: '2.1.0', update_available: false },
    get_session_usage_stats: {
      tokens: {
        input_tokens: 184_220,
        output_tokens: 21_904,
        cache_write_tokens: 92_110,
        cache_read_tokens: 1_402_330,
      },
      tools: [],
      skills: [],
      offset_state: '',
    },
    get_usage_stats: (() => {
      const tb = (i: number, o: number, cw: number, cr: number) => ({
        input_tokens: i,
        output_tokens: o,
        cache_write_tokens: cw,
        cache_read_tokens: cr,
      })
      const mc = (opus: number, sonnet: number, haiku = 0) =>
        [
          { model: 'claude-opus-4-6', count: opus },
          { model: 'claude-sonnet-5', count: sonnet },
          ...(haiku ? [{ model: 'claude-haiku-4-5-20251001', count: haiku }] : []),
        ]
      const timing = (
        name: string,
        count: number,
        avg: number,
        opus: number,
        sonnet: number,
        inTok: number,
        outTok: number,
      ) => ({
        name,
        count,
        total_duration_ms: count * avg,
        avg_duration_ms: avg,
        by_model: mc(opus, sonnet),
        input_tokens: inTok,
        output_tokens: outTok,
      })
      return {
        overall: tb(2_418_900, 312_440, 1_904_220, 41_880_300),
        by_project: [
          { project_name: 'api-gateway', project_path: `${HOME}/code/api-gateway`, tokens: tb(1_102_400, 141_200, 880_100, 19_400_000) },
          { project_name: 'web-dashboard', project_path: `${HOME}/code/web-dashboard`, tokens: tb(612_300, 80_900, 510_400, 11_200_000) },
          { project_name: 'mobile-app', project_path: `${HOME}/code/mobile-app`, tokens: tb(388_100, 44_300, 290_700, 6_100_000) },
          { project_name: 'sidequest', project_path: `${HOME}/code/sidequest`, tokens: tb(210_600, 31_040, 160_020, 3_900_300) },
          { project_name: 'recipe-bot', project_path: `${HOME}/code/recipe-bot`, tokens: tb(105_500, 15_000, 63_000, 1_280_000) },
        ],
        by_model: [
          { model: 'claude-opus-4-6', tokens: tb(1_610_200, 221_900, 1_301_000, 28_400_000) },
          { model: 'claude-sonnet-5', tokens: tb(760_400, 86_100, 580_220, 13_100_300) },
          { model: 'claude-haiku-4-5-20251001', tokens: tb(48_300, 4_440, 23_000, 380_000) },
        ],
        tools: [
          { name: 'Read', count: 4812, by_model: mc(3100, 1712) },
          { name: 'Bash', count: 3390, by_model: mc(2010, 1380) },
          { name: 'Edit', count: 2144, by_model: mc(1500, 644) },
          { name: 'Grep', count: 1920, by_model: mc(1100, 820) },
          { name: 'Write', count: 611, by_model: mc(420, 191) },
          { name: 'Glob', count: 540, by_model: mc(300, 240) },
          { name: 'WebFetch', count: 98, by_model: mc(60, 38) },
        ],
        skills: [
          timing('commit', 212, 9400, 140, 72, 410_000, 38_000),
          timing('review-pr', 64, 41_000, 50, 14, 820_000, 61_000),
          timing('test-driven-development', 48, 22_000, 30, 18, 300_000, 29_000),
          timing('systematic-debugging', 31, 35_000, 25, 6, 410_000, 33_000),
        ],
        tool_timing: [
          timing('Bash', 3390, 2300, 2010, 1380, 1_210_000, 92_000),
          timing('Read', 4812, 120, 3100, 1712, 2_900_000, 14_000),
          timing('Edit', 2144, 310, 1500, 644, 640_000, 210_000),
          timing('Grep', 1920, 95, 1100, 820, 410_000, 8_000),
          timing('Write', 611, 280, 420, 191, 120_000, 180_000),
          timing('Glob', 540, 60, 300, 240, 48_000, 2_000),
          timing('WebFetch', 98, 4100, 60, 38, 310_000, 9_000),
        ],
      }
    })(),
    get_worktree_sizes: [],
    list_worktree_directories: [],
    get_auto_discovered_paths: { git: '/opt/homebrew/bin/git', tmux: '/opt/homebrew/bin/tmux' },
    prune_expired_quests: 0,
    prune_old_handoffs: 0,
    list_extensions: [],
    get_extension_dir: `${HOME}/.sidequest/extensions`,
  },
)

Object.assign(window, { __shim: shim, __transcript: TRANSCRIPT })

localStorage.setItem('starredProjectIds', JSON.stringify(['p-api', 'p-web', 'p-sq']))
const params = new URLSearchParams(location.search)
if (params.get('theme') === 'light') {
  localStorage.setItem('theme', 'light')
  document.documentElement.classList.remove('dark')
} else {
  localStorage.setItem('theme', 'dark')
  document.documentElement.classList.add('dark')
}

initGhostty().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <JotaiProvider store={appStore}>
        <ThemeEffects />
        <FontSizeEffects />
        <SettingsInitializer />
        <SettingsEffects />
        <I18nEffects />
        <TooltipProvider delayDuration={400}>
          <App />
        </TooltipProvider>
      </JotaiProvider>
    </React.StrictMode>,
  )
})
