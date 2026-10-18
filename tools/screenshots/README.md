# Regenerating the site screenshots

The marketing screenshots are rendered from the real Sidequest UI against
synthetic fixture data, so nothing private appears in them. They reuse the
app's UI harness (`tools/ui-harness` in the Sidequest repo), which fakes the
Tauri bridge and renders real components in a plain browser.

## One-time setup

1. Copy `ui-harness/*` from this directory into `<sidequest-repo>/tools/ui-harness/`.
2. In the Sidequest repo: `bun install`.

## Capture

```sh
cd <sidequest-repo>
bun run harness &                                   # vite on :1437

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --remote-debugging-port=9333 \
  --user-data-dir=/tmp/sidequest-harness \
  --window-size=1600,1087 --force-device-scale-factor=2 --hide-scrollbars about:blank &

cd <this-repo>/tools/screenshots
cp <sidequest-repo>/tools/ui-harness/drive.mjs .   # CDP helper; not committed here
C='--click api-gateway --click'; Q='Add rate limiting to the /orders endpoint'
BL='(()=>{document.activeElement&&document.activeElement.blur();return 1})()'

bun shoot.mjs hero.png $C "$Q"
bun shoot.mjs quest-board.png $C "$Q" --crop 'section[aria-label="Quest Log"]'
bun shoot.mjs terminal.png $C "$Q" --crop 'main[aria-label="Terminal and changes"]'
bun shoot.mjs supervisor.png $C "$Q" --sel '[title="Supervisors"]' --crop '[role="dialog"]' --eval "$BL"
bun shoot.mjs journals.png $C "$Q" --sel '[title="Search all journals"]' --crop '[role="dialog"]' --eval "$BL"
bun shoot.mjs active-quests.png $C "$Q" --sel '[title="Active quests"]' --crop '[role="dialog"]' --eval "$BL"
bun shoot.mjs usage-dashboard.png $C "$Q" --sel '[title="Usage Dashboard"]' --crop '[role="dialog"]' --eval "$BL"
bun shoot.mjs create-quest.png $C "$Q" --sel '[aria-label="Add quest to Active"]' --crop '[role="dialog"]'
```

Then downscale (`sips -Z 2560 hero.png --out ../../src/assets/screenshots/sidequest.png`,
`sips -Z 1600` for the feature images) and copy into `src/assets/screenshots/`.

## Files

| | |
|---|---|
| `ui-harness/site-app.tsx` | Renders the whole app shell (`src/App.tsx`) with the fake bridge |
| `ui-harness/site-shim.ts` | Fake `invoke`; its SQL layer honours simple WHERE / GROUP BY / ORDER BY |
| `ui-harness/site-fixtures.ts` | Workspaces, projects, quests, supervisors, journals, usage |
| `ui-harness/site-transcript.ts` | The fake Claude Code pane shown in the terminal |
| `shoot.mjs` | Loads the page, clicks, crops to an element, writes a PNG |

If the app's data layer changes (new columns, new commands), update the
fixtures; the shim returns `null` for unknown commands and `[]` for list
commands, so most additions degrade gracefully.
