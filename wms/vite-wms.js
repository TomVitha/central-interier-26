/**
 * Advanced loadContent with support for script attributes (async, defer, module)
 * @param {string|Node} target - Target element selector or the element itself.
 * @param {string} url - URL to fetch.
 * @param {boolean} replace - Replace element (true) or insert inside (false).
 */
export async function loadContent(target, url, replace = false) {
  console.debug(`Loading content for '${target}'`)

  const targetElement = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  if (!targetElement) { 
    console.error(`Target element not found: '${target}'`)
    return
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();

    // 1. Create a temporary container to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 2. Handle injection
    if (replace) {
      const range = document.createRange();
      const fragment = range.createContextualFragment(html);
      targetElement.replaceWith(fragment);
    } else {
      targetElement.innerHTML = html;
    }

    // 3. Execute scripts with attribute support
    const scripts = Array.from(tempDiv.querySelectorAll('script'));

    /*
    for (const oldScript of scripts) {
      const newScript = document.createElement('script');

      // Copy all attributes (src, type, async, defer, etc.)
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Handle inline script content
      if (oldScript.innerHTML) {
        newScript.textContent = oldScript.innerHTML;
      }

      // Append to document to trigger loading/execution
      document.head.appendChild(newScript);

      // Clean up: remove the script tag if it's not a module/external source
      // Note: Modules and external scripts usually stay in the head.
      if (!newScript.src && newScript.type !== 'module') {
        newScript.remove();
      }
    }
    */

    // Replace the script loop with this if order matters:
    for (const oldScript of scripts) {
      await new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = oldScript.innerHTML;

        newScript.onload = resolve;
        newScript.onerror = reject;

        // Inline scripts don't trigger 'onload', so resolve immediately
        document.head.appendChild(newScript);
        if (!newScript.src) resolve();
      });
    }

  } catch (error) {
    console.error("Failed to load content:", error);
  }
}