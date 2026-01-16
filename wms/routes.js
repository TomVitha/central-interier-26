[
  {
    // name will correspond to path in URL (.html extension is implicit)
    name: "index",
    title: "Home Page",
    description: "Welcome to the Home Page",
    blocks: [
      {
        // meta blocks will have attribute data-v-0dccd748
        type: "meta", 
        elements: [
          { src: "metaaaa" },
        ]
      },
      {
        // content blocks will have attribute data-v-d084fd22
        type: "content",  
        elements: [
          // optional class and id for the blocks
          { src: "kontent", class: "klasa", id: "ajdy" },
          { src: "skriptz" },
        ]
      }
    ]
  },
  {
    name: "about-us",
    title: "About Us",
    description: "Learn more about us",
    blocks: [
      {
        type: "meta",
        elements: [
          "metaaa"
        ]
      },
      {
        type: "content",
        elements: [
          { src: "kontent" },
          { src: "skriptz" },
        ]
      }
    ]
  }
]