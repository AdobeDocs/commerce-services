module.exports = [
  {
    title: "Composable Catalog Data Model",
    path: "/composable-catalog/",
    pages: [
        {   title: "Manage catalog data",
            path: "/composable-catalog/manage-catalog-data.md"
      },
      {   title: "Set up and manage catalogs",
            path: "/composable-catalog/manage-catalogs.md"
        },
        {
            title: "Catalog data ingestion API",
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
            title: "Catalog management and rules API",
            path: "composable-catalog/admin/",
            header: "true",
            pages: [
              {
                title: "Using the API",
                path: "/composable-catalog/admin/using-the-api.md"
                },
               {
                title: "API Reference",
                path: "/composable-catalog/admin/api-reference.md"
                },
            ]
        },
        {
            title: "Storefront API",
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
        { title: "CCDM Use-Case",
          path: "/composable-catalog/ccdm-use-case.md"
      },
    ]
  },
];