module.exports = [
  {
    title: "Merchandising Services Developer Guide",
    path: "/composable-catalog/",
    pages: [
      {   title: "Set up and manage catalogs",
            path: "/composable-catalog/manage-catalogs.md"
      },
      { title: "Tutorial",
          path: "/composable-catalog/ccdm-use-case.md"
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
/* Commenting out the Channel and Policies API section during the early access period. Customers will
use the Commerce Optimizer UI to configure channels and policies.

       {
            title: "Channels and Policies API",
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
*/
        {
            title: "Merchandising Services API",
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
    ]
  },
];