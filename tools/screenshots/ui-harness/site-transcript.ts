/** Fake Claude Code panes, keyed by tmux session id. ANSI-styled like the real TUI. */

const B = '\x1b[1m'
const D = '\x1b[2m'
const R = '\x1b[0m'
const GREEN = '\x1b[32m'
const CYAN = '\x1b[36m'
const MAGENTA = '\x1b[35m'
const YELLOW = '\x1b[33m'

const nl = '\r\n'

function tool(cmd: string, result: string[]): string {
  return (
    `${GREEN}●${R} ${B}Bash${R}${D}(${cmd})${R}${nl}` +
    result.map((l, i) => `  ${D}${i === 0 ? '⎿ ' : '  '}${l}${R}${nl}`).join('')
  )
}

function read(path: string, lines: string): string {
  return `${GREEN}●${R} ${B}Read${R}${D}(${path})${R}${nl}  ${D}⎿  Read ${lines} lines${R}${nl}`
}

function edit(path: string, add: number, del: number): string {
  return `${GREEN}●${R} ${B}Update${R}${D}(${path})${R}${nl}  ${D}⎿  Updated ${path} with ${add} addition${add === 1 ? '' : 's'}${del ? ` and ${del} removal${del === 1 ? '' : 's'}` : ''}${R}${nl}`
}

function write(path: string, lines: number): string {
  return `${GREEN}●${R} ${B}Write${R}${D}(${path})${R}${nl}  ${D}⎿  Wrote ${lines} lines to ${path}${R}${nl}`
}

function say(text: string): string {
  return `${B}●${R} ${text}${nl}`
}

const rateLimit =
  `${D}SessionStart:startup says:${R}${nl}` +
  `${D}  ${B}Sidequest${R}${D} · quest context${R}${nl}` +
  `${D}  ────────────────────────────────────────${R}${nl}` +
  `${D}  ${B}Journal${R}${D}  earlier quests that may help${R}${nl}` +
  `${D}    2026-10-11  Webhook retries were double-counting under the old nonce scheme${R}${nl}` +
  `${D}               ~/.sidequest/journal/api-gateway/webhook-retries-double-counting.md${R}${nl}` +
  nl +
  `${D}> Add a token-bucket rate limiter to POST /orders. Per-API-key limits, configurable${R}${nl}` +
  `${D}  via env, 429 with Retry-After. Cover with integration tests.${R}${nl}` +
  nl +
  say("I'll start by looking at how requests reach the orders route and what middleware already exists.") +
  nl +
  tool('ls src/middleware src/routes', [
    'src/middleware: auth.ts  cors.ts  index.ts  requestId.ts',
    'src/routes:     health.ts  orders.ts  search.ts  webhooks.ts',
  ]) +
  nl +
  read('src/routes/orders.ts', '142') +
  read('src/middleware/index.ts', '38') +
  read('src/config/env.ts', '61') +
  nl +
  say(
    'Middleware is composed in `src/middleware/index.ts` and the API key is already resolved by `auth.ts`, so the limiter can key on `req.apiKey`. I\'ll add a token bucket with a per-key map and expose two env knobs.',
  ) +
  nl +
  write('src/middleware/rateLimit.ts', 84) +
  edit('src/middleware/index.ts', 3, 1) +
  edit('src/config/env.ts', 6, 0) +
  edit('src/routes/orders.ts', 2, 0) +
  nl +
  say('Now the integration tests: one key under the limit, one over it, and two keys sharing an IP.') +
  nl +
  write('test/orders.rateLimit.test.ts', 97) +
  nl +
  tool('bun test test/orders.rateLimit.test.ts', [
    'bun test v1.3.2',
    '',
    `${GREEN}✓${R} allows requests under the limit (12 ms)`,
    `${GREEN}✓${R} returns 429 with Retry-After once the bucket is empty (18 ms)`,
    `${GREEN}✓${R} does not throttle a second key on the same IP (9 ms)`,
    `${GREEN}✓${R} refills at ORDERS_RATE_LIMIT_PER_MINUTE (41 ms)`,
    '',
    ' 4 pass, 0 fail, 11 expect() calls',
  ]) +
  nl +
  edit('docs/api/orders.md', 14, 0) +
  nl +
  say(
    'Done. `POST /orders` now runs through a token-bucket limiter keyed on the API key (falling back to IP for unauthenticated calls). Limits come from `ORDERS_RATE_LIMIT_PER_MINUTE` (default 120) and `ORDERS_RATE_LIMIT_BURST` (default 20); over-limit requests get a 429 with `Retry-After`. Four integration tests cover the behaviour and the API doc is updated.',
  ) +
  nl +
  `${D}✻ Worked for 6m 12s · 184k tokens${R}${nl}` +
  nl +
  `${CYAN}❯${R} ${D}Try "open a PR for this"${R}${nl}` +
  `${D}─────────────────────────────────────────────────────────────────────────────${R}${nl}` +
  `  ${YELLOW}⏵⏵ auto mode on${R}${D} (shift+tab to cycle) · ~/.sidequest/worktrees/q-rate-limit · feat/orders-rate-limit${R}${nl}`

const idle =
  `${D}> Investigate the task described in the quest.${R}${nl}` +
  nl +
  say('Looking into it now.') +
  nl +
  `${CYAN}❯${R} ${nl}`

export const TRANSCRIPT: Record<string, string> = {
  'sq-q-rate-limit': rateLimit,
  default: idle,
}
