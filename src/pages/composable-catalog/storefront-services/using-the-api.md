---
title: Using the storefront API
edition: ee
description: Learn how to use the storefront APIs to manage and deliver product data to commerce storefronts or applications in the context of Merchandising Services.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the storefront API

Use the Storefront API to retrieve product data from your Commerce catalogs and display it in Commerce frontend experiences . Data includes products, product attribute metadata, prices books, and prices.

## Base URL

Send all Storefront API requests to this base URL:

`https://na1-sandbox.api.commerce.adobe.com/<tenantId>/graphql`

## Authentication

Authentication is not required for the Storefront API.

## Headers

When making requests to the storefront API, you must include specific HTTP headers to ensure proper authentication and data retrieval. These headers provide necessary information, such as the channel ID, locale, and optional policy and price book headers that tailor the API response to your needs.

Include the following headers in GraphQL requests as needed.

Header name| Description
--- | ---
`AC-Channel-ID` | Required. The id for the channel that products will be sold through. For example, in the automotive industry, the channel could be dealers. In the manufacturing industry, the channel could be a manufacturing location for suppliers. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the list of available channels with the channel id.
`AC-Policy-{*}` | Optional. The trigger name configured for a policy that sets data access filters to restrict product access based on request attributes and context. Examples include POS physical stores, marketplaces, or advertisement pipelines like Google, Meta, or Instagram. Use the [policies query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-policies) to retrieve the [policy trigger names](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#definition-TriggerResponse) available for each policy. You can specify multiple policy headers per request. Example: `AC-Policy-Country`.
`AC-Price-Book-ID` | Optional. Defines how prices are calculated for a specific channel. Use if the merchant uses price books to calculate pricing. Merchandising Services provides a default price book `main` with currency in US dollars.
`AC-Scope-Locale`: | Required. The locale (language or geography) scope to filter products for display or update, for example `en_US`. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the locale IDs available for each channel.

## Request template

Use the following template for GraphQL requests using [cURL](https://curl.se/). Use required and optional headers as needed. Replace placeholders with required values.

```shell
curl --request POST \
-- url https://na1-sandbox.api.commerce.adobe.com/<tenantId>/graphql \
--header 'AC-Channel-ID:  <channelId>'  \
--header 'AC-Policy-<POLICY_NAME>: <policyValue>' \
--header 'AC-Price-Book-ID-<pricebookId>' \
--header 'AC-Scope-Locale: <localeValue>' \
--header 'x-api-key: <clientID>' \
--data '<apiPayload>'
```

| Placeholder name | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| channelID   | The ID for the channel products will be sold through. Use the <a href="https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels">channels query</a> to retrieve available IDs.|
| policyName: policyValue | When used, the policy trigger name and value that sets data access filters to restrict product access based on request attributes. Use the <a href="https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-policies">policies query</a> to retrieve available policies.                    |
| pricebookID  | When used, the price book ID used to retrieve the pricing schedule for a SKU. |
| localeValue | The locale (language or geography) scope to filter products for display or update. |            |
| apiPayload      | API payload. See examples in the <a href="ccdm-use-cases">tutorial.</a> |

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](../ccdm-use-case.md).

## Limitations

The Storefront API has the following limitations and boundaries:
