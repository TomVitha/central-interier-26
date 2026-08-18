import { createRouter } from "./url-router.js";

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
        { src: "metaaa", type: "meta" },
        { src: "header" },
        { src: "kontent" },
        { src: "footer" },
      ],
    },
    {
      path: "/style",
      name: "style",
      title: "Style",
      description: "",
      blocks: [
        { src: "metaaa", type: "meta" },
        { src: "header" },
        { src: "style" },
        { src: "footer" },
      ],
    },
    {
      path: "/detail",
      name: "detail",
      title: "Detail stylu",
      description: "Detail stylu",
      blocks: [
        { src: "metaaa", type: "meta" },
        { src: "header" },
        { src: "detail" },
        { src: "footer" },
      ],
    },
    {
      path: "/404",
      name: "404",
      title: "404",
      description: "404 - Stránka neexistuje",
      blocks: [
        { src: "metaaa", type: "meta" },
        { src: "header" },
        { src: "404" },
        { src: "footer" },
      ],
    },
  ]
}



export const router = createRouter(routerOptions);
