module.exports = [
  {
    title: "Merchandising Services",
    path: "/composable-catalog/",
    pages: [
        {
          title: "Ingest product and price data",
          path: "/composable-catalog/data-ingestion/",
          header: "true",
        pages: [
          {
            title: "Authentication",
            path: "/composable-catalog/data-ingestion/authentication.md"
          },
          {
            title: "Get started",
            path: "/composable-catalog/data-ingestion/using-the-api.md"
          },
          {
            title: "API Reference",
            path: "/composable-catalog/data-ingestion/api-reference/"
          },
        ]
      },
      {
          title: "Retrieve catalog data",
          path: "/composable-catalog/storefront-services/",
          header: "true",
          pages: [
            {
              title: "Get started",
              path: "/composable-catalog/storefront-services/using-the-api.md"
              },
            {
              title: "Use cases",
              path: "/composable-catalog/storefront-services/use-cases.md"
              },
            {
              title: "Limitations",
              path: "/composable-catalog/storefront-services/limitations.md"
            },
            {
              title: "Monitor and troubleshoot",
              path: "/composable-catalog/storefront-services/troubleshooting.md"
            },
            {
              title: "API Reference",
              path: "/composable-catalog/storefront-services/api-reference.md"
            },
          ]
      },
      { title: "Tutorial",
          path: "/composable-catalog/ccdm-use-case.md"
      },
    ]
  }
];