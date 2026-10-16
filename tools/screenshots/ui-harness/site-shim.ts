/**
 * Fake Tauri bridge for marketing screenshots: like tauri-shim.ts, but the
 * SQL layer honours simple WHERE / GROUP BY / ORDER BY so a multi-project
 * fixture renders with per-project quest lists and counts.
 */
export type Row = Record<string, unknown>
export type Tables = Record<string, Row[]>
export type Commands = Record<string, unknown>

type Listener = { event: string; handler: (e: unknown) => void }

const ARRAY_COMMANDS = new Set([
  'fuzzy_filter_files',
  'get_all_project_analyses',
  'get_batch_branch_diff_stats',
  'get_git_log',
  'get_worktree_sizes',
  'list_active_sessions',
  'list_branches',
  'list_custom_sounds',
  'list_extensions',
  'list_github_issues',
  'list_github_prs',
  'list_journal_entries',
  'list_journal_retention_candidates',
  'list_journal_roots',
  'list_opencode_models',
  'list_quest_attachments',
  'list_recurring_quest_runs',
  'list_recurring_quests',
  'list_remote_branches',
  'list_remotes',
  'list_running_supervisor_sessions',
  'list_skills',
  'list_supervisors',
  'list_worktree_directories',
  'recent_journal_entries',
  'reconcile_sessions',
  'search_changed_files',
  'search_journal_entries',
])

function literal(token: string, values: unknown[]): unknown {
  const t = token.trim()
  const ph = /^\$(\d+)$/.exec(t)
  if (ph) return values[Number(ph[1]) - 1]
  if (t === '?') return values.shift()
  if (/^'.*'$/.test(t)) return t.slice(1, -1)
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t)
  if (/^null$/i.test(t)) return null
  return t
}

function col(name: string): string {
  return name.trim().replace(/^[a-z]+\./i, '')
}

function matches(row: Row, clause: string, values: unknown[]): boolean {
  const c = clause.trim()
  let m: RegExpExecArray | null
  if ((m = /^([\w.]+)\s+IS\s+NOT\s+NULL$/i.exec(c)))
    return row[col(m[1])] != null
  if ((m = /^([\w.]+)\s+IS\s+NULL$/i.exec(c))) return row[col(m[1])] == null
  if ((m = /^([\w.]+)\s+(NOT\s+)?IN\s*\(([^)]*)\)$/i.exec(c))) {
    const list = m[3].split(',').map((x) => literal(x, values))
    const hit = list.some((v) => v == row[col(m![1])])
    return m[2] ? !hit : hit
  }
  if ((m = /^([\w.]+)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/.exec(c))) {
    const a = row[col(m[1])] as number | string | null
    const b = literal(m[3], values) as number | string | null
    switch (m[2]) {
      case '=':
        return a == b
      case '!=':
      case '<>':
        return a != b
      case '>':
        return (a as number) > (b as number)
      case '<':
        return (a as number) < (b as number)
      case '>=':
        return (a as number) >= (b as number)
      case '<=':
        return (a as number) <= (b as number)
    }
  }
  return true
}

export function select(tables: Tables, query: string, values: unknown[] = []) {
  const q = query.replace(/\s+/g, ' ').trim()
  const from = /\bFROM\s+(\w+)/i.exec(q)
  const table = from?.[1]
  let rows: Row[] = table ? [...(tables[table] ?? [])] : []

  const where = /\bWHERE\s+(.*?)(?:\s+ORDER BY|\s+GROUP BY|\s+LIMIT|$)/i.exec(q)
  if (where) {
    const vals = [...values]
    const clauses = where[1].split(/\s+AND\s+/i)
    rows = rows.filter((row) => clauses.every((cl) => matches(row, cl, vals)))
  }

  if (/GROUP BY project_id, status/i.test(q)) {
    const out = new Map<string, Row>()
    for (const r of rows) {
      const k = `${r.project_id}|${r.status}`
      const cur = out.get(k) ?? {
        project_id: r.project_id,
        status: r.status,
        count: 0,
      }
      cur.count = (cur.count as number) + 1
      out.set(k, cur)
    }
    return [...out.values()]
  }
  if (/GROUP BY project_id\b/i.test(q)) {
    const out = new Map<string, Row>()
    for (const r of rows) {
      const k = String(r.project_id)
      const cur = out.get(k) ?? { project_id: r.project_id, count: 0 }
      cur.count = (cur.count as number) + 1
      out.set(k, cur)
    }
    return [...out.values()]
  }
  if (/GROUP BY supervisor_id/i.test(q)) {
    const out = new Map<string, Row>()
    for (const r of rows) {
      const k = String(r.supervisor_id)
      const cur = out.get(k) ?? { supervisor_id: r.supervisor_id, n: 0 }
      cur.n = (cur.n as number) + 1
      out.set(k, cur)
    }
    return [...out.values()]
  }
  if (/MAX\(updated_at\)/i.test(q)) {
    const max = rows.reduce(
      (acc, r) => Math.max(acc, Number(r.updated_at ?? 0)),
      0,
    )
    return [{ max_updated: max, total: rows.length }]
  }
  if (/COUNT\(\*\)/i.test(q)) {
    const alias = /COUNT\(\*\)\s+(?:AS\s+)?(\w+)/i.exec(q)?.[1] ?? 'count'
    return [{ [alias]: rows.length }]
  }

  const order = /ORDER BY\s+(.*?)(?:\s+LIMIT|$)/i.exec(q)
  if (order) {
    const keys = order[1].split(',').map((part) => {
      const [name, dir] = part.trim().split(/\s+/)
      return { name: col(name), desc: /desc/i.test(dir ?? '') }
    })
    rows.sort((a, b) => {
      for (const { name, desc } of keys) {
        const x = a[name] as number | string
        const y = b[name] as number | string
        if (x === y) continue
        const r = x == null ? -1 : y == null ? 1 : x < y ? -1 : 1
        return desc ? -r : r
      }
      return 0
    })
  }
  const limit = /LIMIT\s+(\d+)/i.exec(q)
  if (limit) rows = rows.slice(0, Number(limit[1]))
  return rows
}

export function installSiteShim(tables: Tables, commands: Commands = {}) {
  const listeners = new Map<number, Listener>()
  let nextListenerId = 0
  const emit = (event: string, payload: unknown) => {
    for (const [id, listener] of listeners) {
      if (listener.event === event) listener.handler({ event, id, payload })
    }
  }
  const log: string[] = []

  Object.defineProperty(window, '__TAURI_INTERNALS__', {
    configurable: true,
    value: {
      transformCallback: (cb: unknown) => cb,
      invoke: async (cmd: string, args: Record<string, unknown>) => {
        switch (cmd) {
          case 'plugin:sql|load':
            return 'sqlite:sidequest.db'
          case 'plugin:sql|execute':
            return [1, 1]
          case 'plugin:sql|select': {
            const a = args as { query?: string; values?: unknown[] }
            return select(tables, String(a.query ?? ''), a.values ?? [])
          }
          case 'plugin:event|listen': {
            const id = ++nextListenerId
            listeners.set(id, {
              event: String(args.event),
              handler: args.handler as Listener['handler'],
            })
            return id
          }
          case 'plugin:event|unlisten':
            listeners.delete(Number(args.eventId))
            return null
          case 'plugin:notification|is_permission_granted':
            return false
          default: {
            if (!log.includes(cmd)) log.push(cmd)
            if (cmd in commands) {
              const answer = commands[cmd]
              return typeof answer === 'function' ? answer(args) : answer
            }
            return ARRAY_COMMANDS.has(cmd) ? [] : null
          }
        }
      },
    },
  })
  Object.defineProperty(window, '__TAURI_EVENT_PLUGIN_INTERNALS__', {
    configurable: true,
    value: { unregisterListener: () => {} },
  })
  Object.assign(window, { __invoked: log, __emit: emit })
  return { emit }
}
