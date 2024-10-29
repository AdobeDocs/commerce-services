---
title: Composable Catalog Data Model
edition: ee
description: Backend developers learn about the composable catalog data model APIs available to create and manage catalog data, create and manage catalogs for multiple channels and regions, and configure merchandising capabilities. Frontend developers learn about the APIs for creating storefronts from the central data store created using the composable catalog data model.
---

# Composable catalog data model overview

The composable catalog data model is a collection of APIs that merchants can use to create product catalogs for headless commerce implementations. This approach allows businesses to set up catalogs that align with their business models and go-to-market strategies.

Developers can use composable catalog data model APIs to:

- Add and manage catalog data in a central data store that can be used to merchandise and sell products in multiple business channels and locales. Data includes products, attributes, prices, assets, and inventory.
- Configure distribution channels and locales to filter products into custom catalogs with customer-specific pricing and regional settings for language, currency, and units of measure.
- Configure merchandising capabilities by setting up rules for search and product recommendations.

## Data Ingestion API

Developers setting up ecommerce catalogs use the Data Ingestion API to add and manage product data available for creating product catalogs. The Data Ingestion API is implemented as a REST (Representational State Transfer) API endpoint to manage the following types of data.

- Products <-- what is product?, how to create product
- Product Variants <--what is variant, how to create product variants
- Product Metadata <-- what client can manage, how to extend?
- PriceBooks and Prices <-- what is price, how price connected to products, what is price book

### Catalog Management Admin APIs

Developers creating ecommerce sites to sell to various businesses can use the Catalog Management Admin APIs to setup, configure, and manage catalogs and catalog tools for product discovery and merchandising. The Catalog Management APIs are implemented as a GraphQL (Graph Query Language) endpoint to manage the following types of data.

- Channels (Scoping Service) - Schema - <-- what is channel ? examples
- Policies (Scoping Service) - Schema - <-- what is policy? examples
- Live Search Configuration (Search Admin Service) - Schema
- Product Recommendations Configuration (Recommendations Admin Service) - Schema TBD
- Merchandising configuration for search and recommendation rules

## Storefront Integration APIs

Frontend developers can use the Discovery APIs to create commerce storefronts using the product data from the central data store configured on the backend. The Catalog Management APIs are implemented as a GraphQL (Graph Query Language) endpoint to retrieve the following types of data.

- Product Search query - <-- consolidated search api overview
- Search metadata query - <-- supplementary search api (storefront)
- Product Recommendations query -  <-- consolidated p-rex api overview
- Product Query and Product View model - <-- what is product view
- Simple Product View  <-- what is simple product view?
- Complex Product View <-- what is complex product view? key differences between Complex and Simple
- Refine Complex Product - how client can interact with options, consolidated api overview
