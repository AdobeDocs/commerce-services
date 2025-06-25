---
title: Merchandising Services Developer Guide
edition: saas
description: Use the Merchandising Services powered by Channels and Polices to implement large, complex catalogs and develop highly performant storefront experiences.
keywords:
  - GraphQL
  - REST
  - Services
  - Backend Development
  - Search
  - Recommendations
  - Integration
  - Storefront
---

# Merchandising Services Developer Guide

This guide provides API reference and usage information for developers and commerce site administrators involved in storefront development, maintenance, and operations.

Developers can use Adobe Commerce Optimizer Merchandising Services to implement large, complex catalogs, and develop highly performant storefront experiences. Merchandising Services provides a data model that separates product data from product context, allowing businesses to compose custom catalogs for different business models, such as B2B, B2C, and D2C and to manage the catalogs in a way that aligns with their go-to-market strategies.

![Merchandising Services product data and context](../_images/merchandising/merchandising-svcs-parts.png)

- **Product data** provides the details about the products to be sold-sku, attributes, metadata, and assets data, and prices for each item.

- **Product context** defines the business context for the products including catalog views, data access policies for catalog syndication, and catalog source (`locale`).

Developers can use these components together to compose and deliver custom catalogs quickly, without duplicating or refactoring the base catalog data.

<InlineAlert variant="info" slots="text"/>

For additional architecture and implementation details, see the [Adobe Commerce Optimizer Guide](https://experienceleague.adobe.com/docs/commerce/optimizer/overview.html) in Experience League.

## Resources

Adobe Commerce Optimizer Merchandising Services provides the following APIs:

**[Data Ingestion API](data-ingestion/index.md)**—REST API to add and manage product and pricing data for merchandising across multiple business channels and locales. Data includes products, product attribute metadata, price books, and prices. The API expects data in JSON format, which can be added to the Merchandising services data pipeline directly using the API or ingested from third-party systems.

**Catalog Views and Policies**—From the UI, you can create catalog views that represent distribution channels for product sales, catalog source (locales), and policies to set up and deliver custom, composable catalogs with minimal development effort. For details, see the [Adobe Commerce Optimizer Guide](https://experienceleague.adobe.com/en/docs/commerce/optimizer/overview).

**[Merchandising API](merchandising-services/index.md)**—GraphQL API to access rich view-model (read-only) catalog data to build product-related storefront experiences. The Merchandising API is designed to be used by frontend applications to access catalog data.

*Example Integration*: Use the Merchandising API to query catalog data by sending a GraphQL query to filter products by attributes, such as category or brand, or retrieve localized pricing for a specific region. For example, a query can be sent to fetch products within a specific category and display their localized prices on a storefront page, enabling tailored and region-specific storefront experiences.

*Example Integration*: Use the Merchandising API to query catalog data by sending a GraphQL query to retrieve product details, including name, price, and availability, for rendering on a storefront page. This enables dynamic and personalized storefront experiences.
