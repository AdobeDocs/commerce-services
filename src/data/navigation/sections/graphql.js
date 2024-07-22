module.exports = [
  {
    title: "Introduction",
    path: "/graphql/",
  },
  {
    title: "Catalog Service",
    path: "/graphql/catalog-service",
    pages:[
      {
        title: "categories query",
        path: "/graphql/catalog-service/categories.md",
      },
      {
        title: "products query",
        path: "/graphql/catalog-service/products.md"
      },
      {
        title: "productSearch query",
        path: "/graphql/live-search/product-search.md",
      },
      {
        title: "refineProduct query",
        path: "/graphql/catalog-service/refine-product.md"
      }
    ]
  },
  {
    title: "Live Search",
    path: "/graphql/live-search",
    pages: [
      {
        title: "attributeMetadata query",
        path: "/graphql/live-search/attribute-metadata.md"
      },
      {
        title: "productSearch query",
        path: "/graphql/live-search/product-search.md"
      }
    ]
  },
  {
    title: "Product Recommendations",
    path: "/graphql/recommendations/",
    pages: [
      {
        title: "recommendations query",
        path: "graphql/recommendations/recommendations.md"
      }
    ]
  },
];
