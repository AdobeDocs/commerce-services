---
title: Using the storefront API
edition: ee
description: Learn how to use the storefront APIs to manage and deliver product data to commerce storefronts or applications in the context of CCDM.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the storefront API

The storefront API endpoints for all storefront API operations operations are:

Environment | URL
----------- | ---
Testing | https://catalog-service-sandbox.adobe.io/graphql
Production | https://catalog-service.adobe.io/graphql

You must also specify multiple HTTP headers, including an API key, with each request.

## Authentication

Add authentication information here.

### Headers

When making requests to the storefront API, you must include specific HTTP headers to ensure proper authentication and data retrieval. These headers provide necessary information, such as the channel ID, locale, price book, and other optional policies that tailor the API response to your needs.

The following table describes **required** (fixed form) headers:

Header name| Description
--- | ---
`AdobeCommerce-Channel` | The ID for the channel that products will be sold through. For example, in the automotive industry, the channel could be dealers. In the manufacturing industry, the channel could be a manufacturing location for suppliers. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the list of available channels with the channel ID.
`AdobeCommerce-Locale` | The locale (language or geography) scope to filter products for display or update, for example `en_US`.
`AdobeCommerce-PricebookId` | Defines how prices are calculated for a specific channel. Use if the merchant uses price books to calculate pricing. CCDM provides a default price book `main` with currency in US dollars.
`Magento-Environment-Id`| Specify the environment ID for the data space where commerce data is stored. Retrieve the SaaS data space ID from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command. <!--If no Commerce backend, how do you get the data space environment ID?-->
`X-Api-Key` | Production public API key.

The storefront API also accepts some optional headers prefixed with `AdobeCommerce-`. These headers can have different purposes, like triggering a specific policy. The following table describes **optional** (flexible form) headers:

Header name| Description
--- | ---
`AdobeCommerce-Policy-{PolicyID}` | The ID for a policy that defines data access filters to restrict product access based on attributes and context of the request. Examples include POS physical stores, marketplaces, or advertisement pipelines like Google, Meta, or Instagram. Use the [policies query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-policies) to retrieve the list of available policies with the policy id. You can specify multiple policy headers per request.
`AdobeCommerce-trigger` | Trigger a specific policy.
