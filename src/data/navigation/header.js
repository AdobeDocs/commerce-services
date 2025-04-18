module.exports = [
    {
      title: "Commerce Data Services",
      path: "/",
    },
    {
      title: "Merchandising Services powered by Channels and Policies",
      menu: [
        {
          title: "Overview",
          path: "/composable-catalog/"
        },
        {
          title: "Catalog data ingestion",
          path: "/composable-catalog/data-ingestion/"
        },
/* Commenting out the Channel and Policies API section during the early access period. Customers will
use the Commerce Optimizer UI to configure channels and policies.
        {
          title: "Channels and Policies",
          path: "/composable-catalog/admin/"
        },
*/
        {
          title: "Storefront",
          path: "/composable-catalog/storefront-services/"
        },
      ]
    },
    {
      title: "Storefront APIs",
      path: "/graphql/"
    },
    {
      title: "Events and SDKs",
      menu: [
        {
          title: "Storefront Events SDK",
          path: "/shared-services/storefront-events/"
        },
        {
          title: "Product Recommendations SDK",
          path: "/product-recommendations/"
        },
        {
          title: "Live Search Events",
          path: "/live-search/"
        },
      ]
    },
    {
      title: "Reporting",
      path: "/reporting/"
   }
  ];
