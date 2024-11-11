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
