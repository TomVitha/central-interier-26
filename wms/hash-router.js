// HASH ROUTER
import routes from "/wms/routes.json" with { type: "json" };

const pageTitlePrefix = ''
const pageTitleSuffix = ''

// Function that watches the url and calls the urlLocationHandler
const hashRouterHandler = async (hashChangeEvent) => {
  // Debug logs
  // console.debug("Event: ", hashChangeEvent);
  // console.debug("new url: ", hashChangeEvent.newURL);
  // console.debug("old url: ", hashChangeEvent.oldURL);

  // Avoids redirect if hash is empty
  if (!window.location.hash) {
    window.history.pushState(null, null, hashChangeEvent.oldURL);
    console.warn('Router alert: Redirect avoided (empty hash).');
    return
  }

  let location = window.location.hash.replace("#page/", "")									// get the fragment (without the hash), corresponding to url path
  if (location.length == 0) {																// if the path length is 0, set it to 404 (or primary page route)
    console.warn("Router error: No location provided.")
    location = "404";
  }

  navigate(location);    // "navigate" to route (load the template html)
};

async function navigate(path) {

  // Check route/path/page exists
  if (!routes[path]) {
    console.error(`Navigator Error: Location "${path}" doesn't exist. Redirecting to 404.`)
    path = "404"
  }

  // let route = routes[location];
  updateContent(path)

  // Jump to the top of the page
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  })
}


async function updateContent(location) {

  const blocksContainer = document.querySelector("#wms-blocks")
  const page = routes[location]

  // DEV Log all properties
  // for (const property in page) {
  //   if (!Object.hasOwn(page, property)) continue;
  //   console.warn(`${property}: ${page[property]}`);
  // }

  document.title = `${pageTitlePrefix}${page["title"]}${pageTitleSuffix}`
  document.querySelector('meta[name="description"]')?.setAttribute("content", page["description"]);

  const blocks = await createBlocksDivs(location)
  blocksContainer.replaceChildren(...blocks)
}

// * Blocks Rendering
async function createBlocksDivs(route) {
  
  let blocksDivs = []
  for (const block of routes[route]["blocks"]) {

    const div = document.createElement("div")
    const filepath = `./pages/${block["src"]}.html`

    // Load inner HTML from external file given provided filename
    try {
      const response = await fetch(filepath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const html = await response.text();

      // If the provided path doesn't lead to an existing file, fetch returns the content of the current file
      // Check if the server returned the main index.html instead of the requested partial
      if (html.includes("<!DOCTYPE html>")) {
        throw new Error(`File not found (Server returned full page): ${filepath}`);
      }

      // TODO: Handle scripts

      // HTML Content
      div.innerHTML = html;

      // Attributes
      const vDataAttr = block.type == "content" ? "data-v-d084fd22"
        : "meta" ? "data-v-0dccd748"
          : "000" // DEBUG
      div.setAttribute(vDataAttr, "")
      div.setAttribute("class", block["class"] || "")
      div.setAttribute("id", block["id"] || "")

      blocksDivs.push(div)
    }
    catch (error) {
      console.error("Failed to load content:", error);
    }
  }
  return blocksDivs
}


export function initRouter() {
  window.addEventListener("hashchange", hashRouterHandler);
  if (window.location.hash.startsWith('#page/')) {
    const newPath = window.location.hash.replace("#page/", "")
    navigate(newPath);            // first-time load navigation - from existing hash, or default to index
  } else {
    navigate("index")
  }
}