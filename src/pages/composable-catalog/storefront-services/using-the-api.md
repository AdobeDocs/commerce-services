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

Send all Storefront API requests to the following endpoints:

Environment | URL
----------- | ---
Sandbox    | https://catalog-service-sandbox.adobe.io/graphql
Production | https://catalog-service.adobe.io/graphql

You must also specify multiple HTTP headers, including an API key, with each request.

### Headers

When making requests to the storefront API, you must include specific HTTP headers to ensure proper authentication and data retrieval. These headers provide necessary information, such as the channel ID, locale, price book, and optional price book and policy headers that tailor the API response to your needs.

The following table describes **required** (fixed form) headers:

Header name| Description
--- | ---
`AC-Channel-ID` | Required. The id for the channel that products will be sold through. For example, in the automotive industry, the channel could be dealers. In the manufacturing industry, the channel could be a manufacturing location for suppliers. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the list of available channels with the channel id.
`AC-Scope-Locale`: | Required. The locale (language or geography) scope to filter products for display or update, for example `en_US`. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the locale IDs available for each channel.
`AC-Price-Book-ID` | Optional. Defines how prices are calculated for a specific channel. Use if the merchant uses price books to calculate pricing. CCDM provides a default price book `main` with currency in US dollars.
`AC-Policy-{*}` | Optional. The trigger name configured for a policy that sets data access filters to restrict product access based on request attributes and context. Examples include POS physical stores, marketplaces, or advertisement pipelines like Google, Meta, or Instagram. Use the [policies query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-policies) to retrieve the [policy trigger names](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#definition-TriggerResponse) available for each policy. You can specify multiple policy headers per request. Example: `AC-Policy-Country`.
`AC-Environment-ID`| Required. Specify the environment id for the data space where commerce data is stored. Retrieve the SaaS data space id from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command. <!--If no Commerce backend, how do you get the data space environment ID?-->
`X-Api-Key` | Production [Public API Key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey)|
