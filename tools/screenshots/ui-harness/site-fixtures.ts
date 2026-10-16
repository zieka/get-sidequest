/** Synthetic data for marketing screenshots. Nothing here is a real repo. */

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
export const NOW = Date.now()

export const HOME = '/Users/dev'

export const WORKSPACES = [
  { id: '__home__', name: 'Home', created_at: NOW - 90 * DAY, sort_order: -1 },
  { id: 'w-acme', name: 'Acme', created_at: NOW - 80 * DAY, sort_order: 0 },
  { id: 'w-oss', name: 'Open Source', created_at: NOW - 60 * DAY, sort_order: 1 },
  { id: 'w-me', name: 'Personal', created_at: NOW - 40 * DAY, sort_order: 2 },
]

const projectRow = (
  id: string,
  workspace_id: string,
  name: string,
  sort_order: number,
  extra: Record<string, unknown> = {},
) => ({
  id,
  workspace_id,
  path: `${HOME}/code/${name}`,
  name,
  created_at: NOW - 70 * DAY,
  sort_order,
  project_type: 'git_repo',
  child_repos: null,
  notification_sound: null,
  last_active_quest_id: null,
  setup_command: null,
  review_template: null,
  default_profile_id: null,
  default_context_projects: null,
  journal_path: null,
  starred: 0,
  ...extra,
})

export const PROJECTS = [
  {
    ...projectRow('__home__', '__home__', 'Home', 0),
    path: HOME,
    project_type: 'directory',
  },
  projectRow('p-api', 'w-acme', 'api-gateway', 0, {
    last_active_quest_id: 'q-rate-limit',
    starred: 1,
  }),
  projectRow('p-web', 'w-acme', 'web-dashboard', 1, { starred: 1 }),
  projectRow('p-mobile', 'w-acme', 'mobile-app', 2),
  projectRow('p-infra', 'w-acme', 'infra', 3),
  projectRow('p-sq', 'w-oss', 'sidequest', 0, { starred: 1 }),
  projectRow('p-docs', 'w-oss', 'get-sidequest', 1),
  projectRow('p-dot', 'w-me', 'dotfiles', 0),
  projectRow('p-bot', 'w-me', 'recipe-bot', 1),
]

type QuestSpec = {
  id: string
  project_id: string
  title: string
  type?: 'research' | 'changes' | 'review'
  status?: 'backlog' | 'active' | 'archived'
  branch?: string
  activeFor?: number
  quietFor?: number
  needs_attention?: boolean
  pr_number?: number | null
  supervisor_id?: string | null
  sort_order?: number
  description?: string
  completedAgo?: number
  model_override?: string | null
  effort_override?: string | null
  agent_id?: string
}

const questRow = (s: QuestSpec, i: number) => {
  const type = s.type ?? 'changes'
  const status = s.status ?? 'backlog'
  const activated = status === 'active' ? NOW - (s.activeFor ?? HOUR) : null
  const updated = NOW - (s.quietFor ?? s.activeFor ?? 2 * HOUR)
  return {
    id: s.id,
    project_id: s.project_id,
    title: s.title,
    description: s.description ?? s.title,
    type,
    status,
    worktree_path:
      type === 'research' || status === 'backlog'
        ? null
        : `${HOME}/.sidequest/worktrees/${s.id}`,
    branch_name: type === 'research' || status === 'backlog' ? null : s.branch ?? `sidequest/${s.id}`,
    base_branch: 'main',
    pr_number: s.pr_number ?? null,
    pinned_pr_number: null,
    plan_mode: 0,
    agent_id: s.agent_id ?? 'claude-code',
    token_budget: null,
    created_at: NOW - 3 * DAY - i * HOUR,
    updated_at: updated,
    activated_at: activated,
    needs_attention: s.needs_attention ? 1 : 0,
    sort_order: s.sort_order ?? i,
    completed_at: status === 'archived' ? NOW - (s.completedAgo ?? 3 * HOUR) : null,
    spawned_by_recurring_id: null,
    supervisor_id: s.supervisor_id ?? null,
    supervisor_sort_order: null,
    context_projects: null,
    model_override: s.model_override ?? null,
    effort_override: s.effort_override ?? null,
    profile_id: null,
    journal_enabled: 1,
    journal_status: null,
    cached_session_stats: null,
  }
}

const SPECS: QuestSpec[] = [
  // api-gateway — the selected project
  {
    id: 'q-rate-limit',
    project_id: 'p-api',
    title: 'Add rate limiting to the /orders endpoint',
    branch: 'feat/orders-rate-limit',
    status: 'active',
    activeFor: 58 * MIN,
    quietFor: 2 * MIN,
    pr_number: null,
    sort_order: 0,
    description:
      'Add a token-bucket rate limiter to POST /orders. Per-API-key limits, configurable via env, 429 with Retry-After. Cover with integration tests.',
  },
  {
    id: 'q-jwt',
    project_id: 'p-api',
    title: 'Migrate auth middleware to JWT v2 claims',
    branch: 'feat/jwt-v2-claims',
    status: 'active',
    activeFor: 3 * HOUR,
    quietFor: 4 * MIN,
    supervisor_id: 's-platform',
    sort_order: 1,
  },
  {
    id: 'q-flaky',
    project_id: 'p-api',
    title: 'Fix flaky checkout integration test',
    branch: 'fix/checkout-flake',
    status: 'active',
    activeFor: 42 * MIN,
    quietFor: 11 * MIN,
    needs_attention: true,
    sort_order: 2,
  },
  {
    id: 'q-p99',
    project_id: 'p-api',
    title: 'Why is /search p99 latency 3x higher since Tuesday?',
    type: 'research',
    status: 'active',
    activeFor: 25 * MIN,
    quietFor: 25 * MIN,
    sort_order: 3,
  },
  {
    id: 'q-review-212',
    project_id: 'p-api',
    title: 'Review PR #212: idempotency keys for webhooks',
    type: 'review',
    branch: 'feat/webhook-idempotency',
    status: 'active',
    activeFor: 15 * MIN,
    quietFor: 1 * MIN,
    pr_number: 212,
    supervisor_id: 's-platform',
    sort_order: 4,
  },
  {
    id: 'q-pg',
    project_id: 'p-api',
    title: 'Upgrade the Postgres driver to v9 and fix deprecations',
    sort_order: 0,
    supervisor_id: 's-platform',
  },
  {
    id: 'q-otel',
    project_id: 'p-api',
    title: 'Add OpenTelemetry tracing to the worker queue',
    sort_order: 1,
    supervisor_id: 's-platform',
  },
  {
    id: 'q-adr',
    project_id: 'p-api',
    title: 'Write an ADR for the event-sourcing rollout',
    type: 'research',
    sort_order: 2,
  },
  {
    id: 'q-retry',
    project_id: 'p-api',
    title: 'Dedupe retry logic across the three HTTP clients',
    sort_order: 3,
  },
  {
    id: 'q-done-1',
    project_id: 'p-api',
    title: 'Bump Node to 22 in CI and Dockerfiles',
    status: 'archived',
    completedAgo: 40 * MIN,
  },
  {
    id: 'q-done-2',
    project_id: 'p-api',
    title: 'Return 404 instead of 500 for unknown order ids',
    status: 'archived',
    completedAgo: 2 * HOUR,
  },
  {
    id: 'q-done-3',
    project_id: 'p-api',
    title: 'Audit error handling in the payments client',
    type: 'research',
    status: 'archived',
    completedAgo: 5 * HOUR,
  },
  // web-dashboard
  {
    id: 'q-web-1',
    project_id: 'p-web',
    title: 'Dark mode for the billing pages',
    status: 'active',
    activeFor: 2 * HOUR,
    quietFor: 3 * MIN,
    branch: 'feat/billing-dark-mode',
  },
  {
    id: 'q-web-2',
    project_id: 'p-web',
    title: 'Replace moment with date-fns',
    status: 'active',
    activeFor: 4 * DAY,
    quietFor: 3 * DAY + 2 * HOUR,
    branch: 'chore/date-fns',
    supervisor_id: 's-platform',
  },
  { id: 'q-web-3', project_id: 'p-web', title: 'Virtualize the audit log table' },
  { id: 'q-web-4', project_id: 'p-web', title: 'Keyboard navigation for the command menu' },
  // mobile-app
  {
    id: 'q-mob-1',
    project_id: 'p-mobile',
    title: 'Offline queue for order submissions',
    status: 'active',
    activeFor: 90 * MIN,
    quietFor: 2 * MIN,
    branch: 'feat/offline-queue',
  },
  { id: 'q-mob-2', project_id: 'p-mobile', title: 'Crash on rotate in the scanner screen' },
  // infra
  { id: 'q-infra-1', project_id: 'p-infra', title: 'Terraform module for the new staging VPC' },
  // sidequest
  {
    id: 'q-sq-1',
    project_id: 'p-sq',
    title: 'Supervisor board: show where a dragged quest will land',
    status: 'active',
    activeFor: 30 * MIN,
    quietFor: 1 * MIN,
    branch: 'fix/drop-indicator',
  },
  { id: 'q-sq-2', project_id: 'p-sq', title: 'Windows build spike', type: 'research' },
  // get-sidequest
  {
    id: 'q-docs-1',
    project_id: 'p-docs',
    title: 'Refresh docs and screenshots for v0.74',
    status: 'active',
    activeFor: 20 * MIN,
    quietFor: 20 * MIN,
    branch: 'docs/v0.74-refresh',
  },
  // dotfiles
  { id: 'q-dot-1', project_id: 'p-dot', title: 'Port tmux config to the new status line' },
  // recipe-bot
  {
    id: 'q-bot-1',
    project_id: 'p-bot',
    title: 'Scale ingredient quantities by servings',
    status: 'active',
    activeFor: 2 * DAY,
    quietFor: 26 * HOUR,
    branch: 'feat/servings',
  },
  // home
  {
    id: 'q-home-1',
    project_id: '__home__',
    title: 'Which of my repos still pin Node 18?',
    type: 'research',
    status: 'active',
    activeFor: 10 * MIN,
    quietFor: 10 * MIN,
  },
]

export const QUESTS = SPECS.map(questRow)

export const SUPERVISORS = [
  {
    id: 's-platform',
    name: 'Platform',
    enabled: 1,
    auto_answer_enabled: 1,
    auto_start_enabled: 1,
    pull_backlog_enabled: 1,
    active_quest_ceiling: 3,
    extended_prompt_enabled: 0,
    extended_prompt: '',
    close_quest_enabled: 1,
    close_quest_prompt:
      'A PR exists for the branch, CI is green, and the PR description summarizes the change.',
    supervisor_id: null,
    model: 'auto',
    created_at: NOW - 20 * DAY,
    updated_at: NOW - DAY,
  },
  {
    id: 's-nightly',
    name: 'Nightly chores',
    enabled: 0,
    auto_answer_enabled: 1,
    auto_start_enabled: 1,
    pull_backlog_enabled: 1,
    active_quest_ceiling: 1,
    extended_prompt_enabled: 0,
    extended_prompt: '',
    close_quest_enabled: 0,
    close_quest_prompt: '',
    supervisor_id: 's-platform',
    model: 'sonnet',
    created_at: NOW - 10 * DAY,
    updated_at: NOW - DAY,
  },
]

export const SETTINGS = Object.entries({
  setup_completed: 'true',
  last_workspace_id: 'w-acme',
  language: 'en',
  effort_level: 'xhigh',
  default_agent: 'claude-code',
  auto_mode: 'true',
  smart_routing_enabled: 'true',
  terminal_panel_visible: 'true',
  changes_panel_visible: 'false',
  sidebar_column_width: '280',
  main_column_width: '340',
  journal_auto_write: 'true',
  journal_push_enabled: 'true',
}).map(([key, value]) => ({ key, value }))

/** Sessions the app believes are alive, one per active quest. */
export const SESSIONS = QUESTS.filter((q) => q.status === 'active').map((q) => ({
  id: `sq-${q.id}`,
  quest_id: q.id,
  working_dir: q.worktree_path ?? PROJECTS.find((p) => p.id === q.project_id)?.path ?? HOME,
  started_at: q.activated_at ?? NOW,
  is_new: false,
}))

/** Quests whose agent is busy right now (drives the Working/Idle label). */
export const WORKING = new Set([
  'q-rate-limit',
  'q-jwt',
  'q-review-212',
  'q-web-1',
  'q-mob-1',
  'q-sq-1',
])

export const DIFF_STATS: Record<string, { additions: number; deletions: number }> = {
  'q-rate-limit': { additions: 412, deletions: 38 },
  'q-jwt': { additions: 1240, deletions: 655 },
  'q-flaky': { additions: 27, deletions: 9 },
  'q-review-212': { additions: 0, deletions: 0 },
  'q-web-1': { additions: 318, deletions: 120 },
  'q-web-2': { additions: 2210, deletions: 2984 },
  'q-mob-1': { additions: 540, deletions: 61 },
  'q-sq-1': { additions: 96, deletions: 14 },
  'q-docs-1': { additions: 1830, deletions: 402 },
  'q-bot-1': { additions: 142, deletions: 20 },
}

export const GITHUB_LINKS = {
  branch_prs: {
    'q-jwt': {
      number: 218,
      state: 'OPEN',
      is_draft: false,
      title: 'Migrate auth middleware to JWT v2 claims',
      url: 'https://github.com/acme/api-gateway/pull/218',
    },
    'q-web-2': {
      number: 77,
      state: 'OPEN',
      is_draft: true,
      title: 'Replace moment with date-fns',
      url: 'https://github.com/acme/web-dashboard/pull/77',
    },
  },
  numbered_prs: {
    '212': {
      number: 212,
      state: 'OPEN',
      is_draft: false,
      title: 'Idempotency keys for webhooks',
      url: 'https://github.com/acme/api-gateway/pull/212',
    },
  },
  issues: {
    '191': {
      number: 191,
      state: 'OPEN',
      title: 'Checkout integration test is flaky on CI',
      url: 'https://github.com/acme/api-gateway/issues/191',
    },
  },
  failed_quests: [],
  failed_prs: [],
  failed_issues: [],
}

export const QUEST_ISSUES = [
  { quest_id: 'q-flaky', issue_number: 191, project_id: 'p-api' },
]

export const JOURNAL_ENTRIES = [
  ['Orders rate limits must be per API key, not per IP', 'auto', 2 * HOUR],
  ['Postgres driver v9 drops implicit UTC; set timezone on the pool', 'agent', DAY],
  ['Webhook retries were double-counting under the old nonce scheme', 'auto', 2 * DAY],
  ['Checkout flake: the fixture seeds overlap on parallel workers', 'manual', 3 * DAY],
  ['The payments client swallows 5xx when the circuit is half-open', 'auto', 6 * DAY],
].map(([title, source, ago], i) => ({
  filename: `${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 48)}.md`,
  created_at: Math.floor((NOW - (ago as number)) / 1000),
  id: `jn_0${i}ACME`,
  title,
  source,
}))

export const JOURNAL_HITS = JOURNAL_ENTRIES.map((e, i) => ({
  id: e.id,
  title: e.title,
  summary: [
    'Keying on client IP throttled the whole office. Limits now hang off the API key, with a 429 and Retry-After.',
    'pg v9 removed the implicit UTC session timezone, which shifted every created_at by the host offset in tests.',
    'Two retries of the same delivery could both land because the nonce was derived from the timestamp.',
    'Parallel jest workers seeded overlapping order ids; the fixture now namespaces ids per worker.',
    'The half-open circuit returned an empty body instead of surfacing the upstream 5xx.',
  ][i],
  snippet: '',
  project: ['api-gateway', 'api-gateway', 'api-gateway', 'api-gateway', 'api-gateway'][i],
  date: new Date(e.created_at * 1000).toISOString().slice(0, 10),
  tags: [
    ['rate-limit', 'orders', 'api-keys'],
    ['postgres', 'timezone', 'driver'],
    ['webhooks', 'idempotency'],
    ['tests', 'flaky', 'jest'],
    ['payments', 'circuit-breaker'],
  ][i],
  source: e.source,
  path: `${HOME}/.sidequest/journal/api-gateway/${e.filename}`,
  quest_id: null,
  rank: null,
  matched_terms: [],
  title_match: false,
}))

export const ANALYSES: Record<string, { languages: string[]; frameworks: string[] }> = {
  'p-api': { languages: ['TypeScript'], frameworks: ['Fastify'] },
  'p-web': { languages: ['TypeScript'], frameworks: ['React', 'Vite'] },
  'p-mobile': { languages: ['Swift'], frameworks: [] },
  'p-infra': { languages: ['HCL'], frameworks: [] },
  'p-sq': { languages: ['Rust', 'TypeScript'], frameworks: ['Tauri', 'React'] },
  'p-docs': { languages: ['TypeScript'], frameworks: ['Astro'] },
  'p-dot': { languages: ['Shell'], frameworks: [] },
  'p-bot': { languages: ['Python'], frameworks: [] },
}

export const CHANGED_FILES = [
  { path: 'src/middleware/rateLimit.ts', status: 'added', staged: false },
  { path: 'src/middleware/index.ts', status: 'modified', staged: false },
  { path: 'src/routes/orders.ts', status: 'modified', staged: false },
  { path: 'src/config/env.ts', status: 'modified', staged: false },
  { path: 'test/orders.rateLimit.test.ts', status: 'added', staged: false },
  { path: 'docs/api/orders.md', status: 'modified', staged: false },
]
