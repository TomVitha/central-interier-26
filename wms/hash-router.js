// HASH ROUTER
import routes from "/wms/routes.json" with { type: "json" };

const titlePrefix = ''
const titleSuffix = ''

// Function that watches the url and calls the urlLocationHandler
async function hashRouterHandler(hashChangeEvent) {
  // Avoids redirect if hash is empty
  if (!window.location.hash) {
    window.history.pushState(null, null, hashChangeEvent.oldURL);
    console.warn('Router alert: Redirect avoided (empty hash).');
    return
  }

  let path = window.location.hash.replace("#page/", "")
  if (path.length == 0) {
    console.warn("Router error: No location provided.")
    path = "404";
  }

  navigate(path);
};

async function navigate(path) {

  // Check route/path/page exists
  if (!routes[path]) {
    console.error(`Navigator Error: Location "${path}" doesn't exist, redirecting to 404.`)
    path = "404"
  }

  // const page = routes[location];
  updateContent(path)

  // Jump to the top of the page
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  })
}


async function updateContent(path) {

  const page = routes[path]
  const blocksContainer = document.querySelector("#wms-blocks")

  // DEV Log all properties
  // for (const property in page) {
  //   if (!Object.hasOwn(page, property)) continue;
  //   console.warn(`${property}: ${page[property]}`);
  // }

  document.title = `${titlePrefix}${page["title"]}${titleSuffix}`
  document.querySelector('meta[name="description"]')?.setAttribute("content", page["description"]);

  const blocks = await createBlocks(path)
  blocksContainer.replaceChildren(document.createRange().createContextualFragment(blocks.join("\n")))
}


async function createBlocks(path) {

  let blocksDivs = []
  for (const block of routes[path]["blocks"]) {

    const div = document.createElement("div")
    const filepath = `./pages/${block["src"]}.html`
    let html

    // Load inner HTML from external file given provided filename
    try {
      const response = await fetch(filepath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      html = await response.text();
    }
    catch (error) {
      console.error("Failed to load content:", error);
    }

    // If the provided path doesn't lead to an existing file, fetch returns the content of the current file
    // Check if the server returned the main index.html instead of the requested partial
    if (html.includes("<!DOCTYPE html>")) {
      throw new Error(`File not found (Server returned full page): ${filepath}`);
    }

    // HTML Content
    div.innerHTML = html;

    // Attributes
    const vDataAttr = block.type == "content" ? "data-v-d084fd22"
      : "meta" ? "data-v-0dccd748"
        : ""
    div.setAttribute(vDataAttr, "")
    div.setAttribute("class", block["class"] || "")
    div.setAttribute("id", block["id"] || "")
    
    blocksDivs.push(div.outerHTML)
  }
  return blocksDivs
}


export function initRouter() {
  window.addEventListener("hashchange", hashRouterHandler);
  // Initial page load
  const path = window.location.hash.startsWith('#page/') ? window.location.hash.replace("#page/", "") : "index"
  navigate(path)
}