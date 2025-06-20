module.exports = [
  {
    title: "Merchandising Services",
    path: "/composable-catalog/",
    pages: [
        {
          title: "Ingest product and price data",
          path: "/composable-catalog/data-ingestion/",
          pages: [
            {
              title: "Using the API",
              path: "/composable-catalog/data-ingestion/using-the-api.md"
              },
            {
              title: "API Reference",
              path: "/composable-catalog/data-ingestion/api-reference.md"
            },
          ]
      },
      {
          title: "Retrieve catalog data",
          path: "composable-catalog/storefront-services/",
          header: "true",
          pages: [
            {
              title: "Using the API",
              path: "/composable-catalog/storefront-services/using-the-api.md"
              },
              {
              title: "API Reference",
              path: "/composable-catalog/storefront-services/api-reference.md"
              },
          ]
      },
      {   title: "Set up and manage catalogs",
            path: "/composable-catalog/manage-catalogs.md"
      },
      { title: "Tutorial",
          path: "/composable-catalog/ccdm-use-case.md"
      }
    ]
  }
];