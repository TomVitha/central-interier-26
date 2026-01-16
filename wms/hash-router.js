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

async function navigate(location) {
  // Validation
  if (!location) {
    console.error("Navigator Error: No location name provided.")
    return
  }

  // Check route/path/page exists
  let route = routes[location];
  if (!route) {
    console.error(`Navigator Error: Location "${location}" doesn't exist.`)
    console.log('Redirecting to 404...')
    route = routes["404"]
  }


  // * CONTENT RENDERING * //
  // const pageHTML = await fetch(route.template).then((response) => response.text());						// get the html from the template
  // document.querySelector("#dev-cms-content").innerHTML = pageHTML;											// set the content of the content div to the html
  // document.title = `${pageTitlePrefix}${route.title}${pageTitleSuffix}`;							// set the title of the document to the title of the route
  // document.querySelector('meta[name="description"]')?.setAttribute("content", route.description);		// set the description of the document to the description of the route

  updateContent(location)


  // Jump to the top of the page
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  })
  // updateNavbarActiveLink(location)					                                                // update the active link in the navbar
}


async function updateContent(pageName) {

  const blocksContainer = document.querySelector("#wms-blocks")

  console.warn("page name:", pageName)
  const page = routes[pageName]
  console.warn("current page:", page)

  // DEV Log all properties
  for (const property in page) {
    if (!Object.hasOwn(page, property)) continue;
    console.warn(`${property}: ${page[property]}`);
  }

  // FIXME
  // document.title = page["title"]
  // document.querySelector('meta[name="description"]')?.setAttribute("content", page["description"]);

  let blocksDivs = []

  // * Blocks Rendering
  for (const block of page["blocks"]) {
    // console.debug("current page block:", block)
    const vDataAttr = block.type == "content" ? "data-v-d084fd22"
      : "meta" ? "data-v-0dccd748"
        : "000" // DEBUG

    const div = document.createElement("div")

    const filepath = `./pages/${block["src"]}.html`
    // console.debug("filepath:", filepath);


    // Load inner HTML from external file given provided filename
    try {
      const response = await fetch(filepath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const htmlContent = await response.text();

      // HACK possibly - if the provided path doesn't lead to an existing file, fetch returns the content of the current file
      // Check if the server returned the main index.html instead of the requested partial
      if (htmlContent.includes("<!DOCTYPE html>")) {
        throw new Error(`File not found (Server returned full page): ${filepath}`);
      }

      console.debug("htmlContent:", htmlContent);

      // TODO: Handle scripts

      div.innerHTML = htmlContent;

      div.setAttribute(vDataAttr, "")
      div.setAttribute("class", block["class"] || "")
      div.setAttribute("id", block["id"] || "")

      // blocksContainer.append(div)

      // add div to blocks
      blocksDivs.push(div)
    }
    catch (error) {
      console.error("Failed to load content:", error);
    }
  }

  blocksContainer.replaceChildren(...blocksDivs)

}


export function hashChangeListener() {
  window.addEventListener("hashchange", hashRouterHandler);                   // create a function that watches the hash and calls the urlLocationHandler
  if (window.location.hash.startsWith('#page/')) {
    const newPath = window.location.hash.replace("#page/", "")
    navigate(newPath);            // first-time load navigation - from existing hash, or default to index
  } else {
    navigate("about-us")
  }
}