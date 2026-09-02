/**
 * Inserts pre-loaded HTML content into the DOM (content is bundled at build time, no runtime fetch/missing files).
 * @param {string|Node} target - Target element selector or the element itself.
 * @param {string} html - HTML source to insert.
 * @param {boolean} replace - Replace element (true) or insert inside (false).
 */
export function insertContent(target, html, replace = false) {
  const targetElement = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  if (!targetElement) {
    console.error(`Target element not found: '${target}'`)
    return
  }

  const fragment = document.createRange().createContextualFragment(html);
  replace ? targetElement.replaceWith(fragment) : targetElement.replaceChildren(fragment);
}