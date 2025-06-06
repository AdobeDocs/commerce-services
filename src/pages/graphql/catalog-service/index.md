---
title: Catalog Service for Adobe Commerce
description: Learn how Catalog Service implements GraphQL.
keywords:
  - GraphQL
  - Services
---

# Catalog Service for Adobe Commerce

The Catalog Service for Adobe Commerce extension contributes to a services-only GraphQL schema that contains queries that return specialized catalog data that is not available in the [core GraphQL schema](https://developer.adobe.com/commerce/webapi/graphql/schema/). The queries in this schema allow Commerce merchants to quickly and fully render product-related content on the storefront, including product detail pages and product list pages.

Catalog Service provides the following queries:

*  [`categories`](categories.md)
*  [`products`](products.md)
*  [`refineProduct`](refine-product.md)
*  [`variants`](product-variants.md)

It also extends the Live Search [`productSearch`](../live-search/product-search.md#catalog-service) query to return product view data.

You can optionally implement [API Mesh for Adobe Developer App Builder](https://developer.adobe.com/graphql-mesh-gateway/) to integrate the two Adobe Commerce GraphQL systems with private and third-party APIs and other software interfaces using Adobe Developer. The mesh can be configured to ensure calls routed to each endpoint contain the correct authorization information in the headers.

The [Catalog Service Guide](https://experienceleague.adobe.com/docs/commerce-merchant-services/catalog-service/overview.html) describes the architecture and implementation of this product.
