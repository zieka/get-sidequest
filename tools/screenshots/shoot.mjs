// Load the full-app harness, click the active quest, screenshot.
// usage: bun shoot.mjs <outfile> [query] [--click "<quest title>"] [--wait ms] [--w W --h H]
import { connect, sleep } from './drive.mjs'

const args = process.argv.slice(2)
const out = args[0]
const query = args[1]?.startsWith('--') ? '' : (args[1] ?? '')
const opt = (name, dflt) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : dflt
}
const clicks = args.flatMap((a, i) =>
  a === '--click' ? [{ text: args[i + 1] }] : a === '--sel' ? [{ sel: args[i + 1] }] : [],
)
const wait = Number(opt('--wait', 1500))
const width = Number(opt('--w', 1600))
const height = Number(opt('--h', 1000))
const evalExpr = opt('--eval', null)
const cropSel = opt('--crop', null)
const pad = Number(opt('--pad', 0))
const DPR = 2
import { spawnSync } from 'node:child_process'

const page = await connect()
await page.evaluate(`(() => {
  window.__sqResize && window.__sqResize(${width}, ${height}); return 1 })()`)
await page.goto(
  `http://localhost:1437/tools/ui-harness/site-app.html${query}`,
  'document.body.innerText.length',
)
await sleep(wait)
for (const c of clicks) {
  const box = c.sel
    ? await page.rect(c.sel)
    : await page.box(`(() => {
    const leaf = [...document.querySelectorAll('div,span,p,h3,button')]
      .filter((e) => !e.children.length && e.textContent.trim() === ${JSON.stringify(c.text)})
      .pop()
    return leaf
  })()`)
  if (!box) throw new Error(`no element for ${JSON.stringify(c)}`)
  await page.click(box)
  await sleep(wait)
}
if (evalExpr) {
  await page.evaluate(evalExpr)
  await sleep(wait)
}
const errors = await page.evaluate(`JSON.stringify((window.__errors ?? []).slice(0, 10))`)
console.log('errors:', errors)
console.log('invoked:', await page.evaluate(`JSON.stringify(window.__invoked ?? [])`))
await page.screenshot(out)
if (cropSel) {
  const r = await page.rect(cropSel)
  if (!r) throw new Error(`no element for crop ${cropSel}`)
  const x = Math.max(0, Math.round((r.left - pad) * DPR))
  const y = Math.max(0, Math.round((r.top - pad) * DPR))
  const w = Math.round((r.width + 2 * pad) * DPR)
  const h = Math.round((r.height + 2 * pad) * DPR)
  const res = spawnSync('sips', ['-c', String(h), String(w), '--cropOffset', String(y), String(x), out, '--out', out], { encoding: 'utf8' })
  if (res.status !== 0) throw new Error(`sips crop failed: ${res.stderr}`)
  console.log('cropped', { x, y, w, h })
}
console.log('wrote', out)
page.close()
