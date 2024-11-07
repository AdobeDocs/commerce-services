---
title: Data Ingestion API
edition: ee
description: Learn how to use the Data Ingestion GraphQL API to add and manage product data using the composable catalog data model.
keywords:
  - REST
  - Services
  - Backend Development
  - Performance
---

# Data Ingestion API

Developers setting up catalogs for merchants with large or complex product assortments use the Data Ingestion API to send catalog data to Commerce storefront services directly, bypassing the need to go through an Adobe Commerce instance, saving time and processing power.

This direct connection decreases the time that it takes to process product changes because it bypasses the Adobe Commerce instance and moves catalog data from a third-party Enterprise Resource Planning (ERP) directly to Adobe Commerce services.

The Data Ingestion API is implemented as a REST (Representational State Transfer) API endpoint to manage the following types of data.

- Products <-- what is product?, how to create product
- Product variants <--what is variant, how to create product variants
- Product metadata <-- what client can manage, how to extend?
- Price books and prices <-- what is price, how price connected to products, what is price book
