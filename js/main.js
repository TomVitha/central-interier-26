/* ! IMPORTANT: Removes default app styling ! */
document.querySelectorAll('link:is([href*="app."], [href*="chunk-vendors"], [href*="footer-cg"])[href*=".css"]').forEach((element) => {
  console.warn("Removing element:", element)
  element.remove()
})


  /**
   * HEADER
   */
  (() => {
    const header = document.querySelector("header");
    const headerSubmenus = header?.querySelectorAll(".header-submenu") ?? [];

    document.addEventListener("click", (event) => {
      if (event.target.closest(".header-submenu")) return;  // Do not close/open on click inside submenu

      const currentSubmenu = event.target.closest(".header-link")?.nextElementSibling;
      const isCurrentSubmenuOpen = currentSubmenu?.classList.contains("open");

      headerSubmenus.forEach((menu) => menu.classList.remove("open"));

      if (currentSubmenu && !isCurrentSubmenuOpen) {
        currentSubmenu.classList.add("open");
      }
    });
  })()