module.exports = [
  {
    title: "Introduction",
    path: "/shared-services/",
  },
  {
    title: "Adobe Commerce storefront events",
    path: "/shared-services/storefront-events/",
    pages: [
      {
        title: "Customize event handling",
        path: "/shared-services/storefront-events/sdk/",
        pages: [
          {
            title: "Install the storefront events SDK",
            path: "/shared-services/storefront-events/sdk/install/",
            pages: [
              {
                title: "Context functions",
                path: "/shared-services/storefront-events/sdk/context/",
              },
              {
                title: "Publish functions",
                path: "/shared-services/storefront-events/sdk/publish/",
              },
              {
                title: "Subscribe functions",
                path: "/shared-services/storefront-events/sdk/subscribe/",
              },
              {
                title: "Unsubscribe functions",
                path: "/shared-services/storefront-events/sdk/unsubscribe/",
              },
            ],
          },
          {
            title: "Install the storefront events collector",
            path: "/shared-services/storefront-events/collector/",
          },
          {
            title: "Verify event collection",
            path: "/shared-services/storefront-events/collector/verify/",
          },
        ],
      },
      {
        title: "Event reference",
        path: "/shared-services/storefront-events/reference/",
        pages: [
          {
            title: "Storefront events by framework",
            path: "/shared-services/storefront-events/reference/event-framework/",
          },
          {
            title: "Complete list of storefront events",
            path: "/shared-services/storefront-events/reference/storefront-events/",
          },
        ],
      },
    ],
  },
];
