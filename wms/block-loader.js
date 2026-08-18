// BLOCK LOADER
// Blocks are imported through Vite (?raw) instead of fetched at runtime, which means:
//   - they are part of Vite's module graph -> editing a block file triggers HMR
//   - they are bundled into the production build -> no runtime requests, no missing files in dist
//   - a missing block fails loudly at import time instead of silently returning index.html

const blockHtml = import.meta.glob('/blocks/**/*.html', { query: '?raw', import: 'default', eager: true })

// State kept in import.meta.hot.data so it survives re-execution of this module during HMR.
// Modules that hold a stale reference to getBlockHtml() still read the fresh HTML through it.
const state = import.meta.hot ? (import.meta.hot.data.state ??= { html: null, listeners: new Set() })
  : { html: null, listeners: new Set() }

state.html = blockHtml

/**
 * Returns the HTML source of a block.
 * @param {string} src - Block name without extension, relative to /blocks (e.g. "header").
 */
export function getBlockHtml(src) {
  const path = `/blocks/${src}.html`
  const html = state.html[path]
  if (html === undefined) {
    throw new Error(`Block not found: ${path}\nAvailable blocks: ${Object.keys(state.html).join(', ')}`)
  }
  return html
}

/**
 * Registers a callback fired when any block's HTML file changes. No-op outside of dev.
 * @param {() => void} listener
 */
export function onBlocksHotUpdate(listener) {
  if (import.meta.hot) state.listeners.add(listener)
}

if (import.meta.hot) {
  // Self-accepting: a changed block re-executes this module (refreshing state.html) instead of reloading the page
  import.meta.hot.accept(() => {
    state.listeners.forEach(listener => listener())
  })
}
