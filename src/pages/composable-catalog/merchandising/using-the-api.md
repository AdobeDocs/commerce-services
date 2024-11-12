---
title: Using the Merchandising API
edition: ee
description: Get information about using the GraphQL queries, mutations, and types provided by the merchandising APIs.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the merchandising API

Frontend developers can use the storefront APIs to create commerce storefront experiences using the catalog data configured on the backend. The storefront APIs are implemented as a GraphQL (Graph Query Language) endpoint to retrieve the following types of data.

- Product Search query - <-- consolidated search api overview
- Search metadata query - <-- supplementary search api (storefront)
- Product Recommendations query -  <-- consolidated p-rex api overview
- Product Query and Product View model - <-- what is product view
- Simple Product View  <-- what is simple product view?
- Complex Product View <-- what is complex product view? key differences between Complex and Simple
- Refine Complex Product - how client can interact with options, consolidated api overview

## Endpoint

Send all GraphQL API requests to the `https://catalog-service.adobe.io/graphql`.

## Authentication

## Headers

Include the following headers in each Data Ingestion API request.

<!--Requires update for CCDM context-->

Header name| Description
--- | ---
`Magento-Environment-Id` | This value is displayed at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment** or can be obtained by running the `bin/magento config:show services_connector/services_id/environment_id` command.
`Magento-Store-Code` | The code assigned to the store associated with the active store view. For example, `main_website_store`.
`Magento-Store-View-Code` | The code assigned to the active store view. For example, `default`.
`Magento-Website-Code` | The code assigned to the website associated with the active store view. For example, `base`.
`X-Api-Key` | This value must be set to `search_gql`.
