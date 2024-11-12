---
title: Using the catalog management and configuration APIs
edition: ee
description: Get information about using GraphQL queries and mutations to manage channels, policies, and configuration for search and recommendations capabilities.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Getting started with catalog management and configuration

Developers creating ecommerce sites to sell to various businesses can use the Catalog Management Admin APIs to setup, configure, and manage catalogs and catalog tools for product discovery and merchandising. The Catalog Management APIs are implemented as a GraphQL (Graph Query Language) endpoint to manage the following types of data.

- Channels (Scoping Service) - Schema - <-- what is channel ? examples
- Policies (Scoping Service) - Schema - <-- what is policy? examples
- Live Search Configuration (Search Admin Service) - Schema
- Product Recommendations Configuration (Recommendations Admin Service) - Schema TBD
- Merchandising configuration for search and recommendation rules

## Endpoints

Send all API requests to the `TBD`.

## Authentication

## Headers

Include the following headers in each API request.

<!--Requires update for CCDM context-->

Header name| Description
--- | ---
`AC-Environment-Id` |  Specify the environment id for the data space where commerce data is stored. If no Commerce backend, how do you get the data space environment ID? Retrieve SaaS data space id from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command.}
`Locale` | Define what this is and where to get it? How is it related to existing info from `Magento-Store-Code`,`Magento-Store-View-Code`, `Magento-Website-Code`
`X-Api-Key` | This value must be set to `search_gql`.
