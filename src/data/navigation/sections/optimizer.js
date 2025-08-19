module.exports = [
  {
    title: "Merchandising Services",
    path: "/optimizer/",
    pages: [
        {
          title: "Ingest product and price data",
          path: "/optimizer/data-ingestion/",
          header: "true",
          pages: [
            {
              title: "Authentication",
              path: "/optimizer/data-ingestion/authentication.md"
            },
            {
              title: "Get started",
              path: "/optimizer/data-ingestion/using-the-api.md"
            },
            {
              title: "API Reference",
              path: "https://developer.adobe.com/commerce/services/reference/rest/",
              EventTarget: "_top"
            }
          ]
        },
        {
          title: "Retrieve catalog data",
          path: "/optimizer/merchandising-services/",
          header: "true",
          pages: [
            {
              title: "Get started",
              path: "/optimizer/merchandising-services/using-the-api.md"
            },
            {
              title: "Use cases",
              path: "/optimizer/merchandising-services/use-cases.md"
            },
            {
              title: "Limitations",
              path: "/optimizer/merchandising-services/limitations.md"
            },
            {
              title: "Monitor and troubleshoot",
              path: "/optimizer/merchandising-services/troubleshooting.md"
            },
            {
              title: "API Reference",
              path: "https://developer.adobe.com/commerce/services/reference/graphql/",
              EventTarget: "_top"
            }
          ]
        },
        {
          title: "Tutorial",
          path: "/optimizer/ccdm-use-case.md"
        }
    ]
  }
];
