// URL ROUTER (Vue-Router-like: createRouter({ routes }) -> { push, replace, init })
import { blockTypes } from "./block-types.js";
import { getBlockHtml, onBlocksHotUpdate } from "./block-loader.js";

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

const defaultOptions = {
  titlePrefix: '',
  titleSuffix: '',
  isActiveLinkClass: false,
  activeLinkClass: 'router-active',
}

export function createRouter(options) {

  // Merge default options with user-provided options and destructure into individual variables
  const { routes, titlePrefix, titleSuffix, isActiveLinkClass, activeLinkClass } = { ...defaultOptions, ...options }

  const routesByPath = new Map(routes.map(route => [normalizePath(route.path), route]))
  const routesByName = new Map(routes.map(route => [route.name, route]))
  const notFoundRoute = routesByName.get('404')
  const blockTypesByName = new Map(blockTypes.map(blockType => [blockType.name, blockType]))

  function resolve(pathname) {
    const route = routesByPath.get(normalizePath(pathname))
    if (!route) {
      console.error(`Router Error: Location "${pathname}" doesn't exist, rendering 404.`)
      return notFoundRoute
    }
    return route
  }

  function createBlock(block) {

    // Assume type "content" if not specified
    const blockType = blockTypesByName.get(block.type || "content")
    const blockEl = document.createElement(blockType.element)

    // Inner content (imported through Vite, see block-loader.js)
    blockEl.innerHTML = getBlockHtml(block.src)

    // Attributes
    blockEl.setAttribute(blockType.vDataAttr, "")
    blockEl.setAttribute("class", block.class || "")
    blockEl.setAttribute("id", block.id || "")

    return blockEl.outerHTML
  }

  function createPathBlocks(route) {
    return route.blocks.map(block => createBlock(block))
  }

  async function render(route, { scroll = true } = {}) {

    const blocksContainer = document.querySelector("#wms-blocks")

    document.title = `${titlePrefix}${route.title}${titleSuffix}`
    document.querySelector('meta[name="description"]')?.setAttribute("content", route.description);

    const blocks = createPathBlocks(route)
    blocksContainer.replaceChildren(document.createRange().createContextualFragment(blocks.join("\n")))   // Fragment allows executing scripts inside loaded HTML (dangerous for prod, fine for local dev)

    // Active link class
    if (isActiveLinkClass) {
      document.querySelectorAll('a[href]').forEach(link => {
        if (normalizePath(link.pathname) === normalizePath(route.path)) {
          link.classList.add(activeLinkClass);
        } else {
          link.classList.remove(activeLinkClass);
        }
      });
    }

    // Jump to the top of the page (skipped when re-rendering in place after a hot update)
    if (scroll) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      })
    }
  }

  async function goTo(path, { push = true } = {}) {
    const route = resolve(path)
    await render(route)
    push ? window.history.pushState(null, null, path) : window.history.replaceState(null, null, path)
  }

  function push(path) {
    return goTo(path, { push: true })
  }

  function replace(path) {
    return goTo(path, { push: false })
  }

  function onPopState() {
    replace(window.location.pathname)
  }

  function onLinkClick(event) {

    if (event.defaultPrevented || event.button !== 0) return
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return

    const link = event.target.closest('a[href]')
    if (!link) return
    if (link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('rel') === 'external') return
    if (link.origin !== window.location.origin) return
    if (link.pathname === window.location.pathname && link.hash !== '') return   // in-page anchor jump, let the browser handle it

    event.preventDefault()
    push(link.pathname)
  }

  function init() {
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onLinkClick)

    // Re-render the current route in place when a block's HTML file is edited (Vite HMR)
    onBlocksHotUpdate(() => render(resolve(window.location.pathname), { scroll: false }))

    return replace(window.location.pathname)
  }

  return { push, replace, init }
}
