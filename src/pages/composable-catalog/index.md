---
title: Merchandising Services Developer Guide
edition: ee
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

# Merchandising Services developer guide

This guide offers API reference and usage information for developers and commerce site administrators involved in storefront development, maintenance, and operations.

Developers can use Merchandising Services powered by Channels and Policies APIs to implement large, complex catalogs, and develop highly performant storefront experiences. Merchandising Services provides a data model that separates product data from product context, allowing businesses to compose custom catalogs for different business models, such as B2B, B2C, and D2C and to manage the catalogs in a way that aligns with their go-to-market strategies.

![Merchandising Services product data and context](../_images/merchandising/merchandising-svcs-parts.png)

- **Product data** provides the details about the products to be sold-sku, attributes, metadata, and assets data, and prices for each item.

- **Product context** defines the business context for the products including distribution channels, data access policies for catalog syndication, and language (`locale`) scope for the catalog.

Developers can use these components together to compose and deliver custom catalogs quickly, without duplicating or refactoring the base catalog data.

<InlineAlert variant="info" slots="text"/>

For additional architecture and implementation details, see the [Merchandising Services powered by Channels and Policies](https://experienceleague.adobe.com/en/docs/commerce/merchandising-services/overview) in Experience League.

## Composable catalogs

Composable catalogs are a key feature of Merchandising Services, created by combining product data with product context to tailor catalogs to specific business needs. Composable catalogs can:

- Support various business models (B2B, B2C, D2C).
- Power storefront experiences across web, mobile, and in-store channels.
- Be managed independently of product data for flexibility and scalability.
- Cater to different locales with regional settings for language, currency, and units of measure.
- Implement policies for customer-specific pricing and business rules.
- Target different audiences for marketing and sales efforts.
- Focus on specific product sets for targeted marketing and sales.

## API resources

Merchandising Services offers a collection of APIs to manage product data and product context independently to compose custom catalogs for storefront experiences. The APIs are available in both GraphQL and REST.

**[Data Ingestion API](data-ingestion/index.md)**—REST API to add and manage product and pricing data for merchandising across multiple business channels and locales. Data includes products, product attribute metadata, price books, and prices. Data can be added directly using the API or ingested from third-party systems.

**[Channels and Policies API](admin/index.md)**—GraphQL API to manage product context, including distribution channels, locales, and policies. Product context is used to filter products into custom catalogs with customer-specific pricing and regional settings for language, currency, and units of measure.

**[Storefront API](../../../static/graphql-api/admin-api/index.html)**—GraphQL API to access rich view-model (read-only) catalog data to build product-related storefront experiences. The Storefront API is designed to be used by frontend applications to access catalog data.
