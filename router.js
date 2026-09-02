import { createRouter } from "./wms/url-router.js";

const routerOptions = {
  // titlePrefix: '',
  // titleSuffix: '',
  // isActiveLinkClass: false,
  // activeLinkClass: 'router-active',
  routes: [
    {
      path: "/",
      name: "index",
      title: "Home Page",
      description: "Welcome to the Home Page",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "header" },
        { src: "hp/hp-hero" },
        { src: "hp/hp-content" },
        { src: "usp" },
        { src: "styly" },
        { src: "promo-bannery" },
        { src: "ukazkove-byty" },
        { src: "showroom-banner" },
        { src: "footer" },
      ],
    },
    {
      path: "/detail",
      name: "detail",
      title: "Detail stylu",
      description: "Detail stylu",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "header" },
        { src: "detail-template/detail-hero" },
        { src: "detail-template/detail-content" },
        { src: "usp" },
        { src: "styly" },
        { src: "showroom-banner" },
        { src: "promo-bannery" },
        { src: "footer" },
      ],
    },
    // 404
    {
      path: "/404",
      name: "404",
      title: "404",
      description: "404 - Stránka neexistuje",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "header" },
        { src: "404" },
        { src: "footer" },
      ],
    },
    // DEV
    {
      path: "/style",
      name: "style",
      title: "Style",
      description: "",
      blocks: [
        { src: "meta-common", type: "meta" },
        { src: "header" },
        { src: "dev/style" },
        { src: "footer" },
      ],
    },
  ]
}

export const router = createRouter(routerOptions);