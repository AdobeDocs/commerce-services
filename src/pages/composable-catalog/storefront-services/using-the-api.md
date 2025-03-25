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

Send all Storefront API requests to this endpoint: https://catalog-service.adobe.io/graphql.

<InlineAlert variant="info" slots="text"/>

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](../ccdm-use-case.md).

## Authentication

To interact with the Storefront Services API, you need the production, public API key generated from your Commerce account at https://account.magento.com.

For instructions on creating keys, see [Generate production and sandbox keys](https://experienceleague.adobe.com/en/docs/commerce/user-guides/integration-services/saas#genapikey).

## Headers

When making requests to the storefront API, you must include specific HTTP headers to ensure proper authentication and data retrieval. These headers provide necessary information, such as the channel ID, locale, and optional policy and price book headers that tailor the API response to your needs.

Include the following headers in GraphQL requests as needed.

Header name| Description
--- | ---
`AC-Channel-ID` | Required. The id for the channel that products will be sold through. For example, in the automotive industry, the channel could be dealers. In the manufacturing industry, the channel could be a manufacturing location for suppliers. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the list of available channels with the channel id.
`AC-Environment-ID`| Required. Specify the environment ID for the data space where commerce data is stored. Retrieve the [SaaS data space ID] from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command.
`AC-Policy-{*}` | Optional. The trigger name configured for a policy that sets data access filters to restrict product access based on request attributes and context. Examples include POS physical stores, marketplaces, or advertisement pipelines like Google, Meta, or Instagram. Use the [policies query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-policies) to retrieve the [policy trigger names](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#definition-TriggerResponse) available for each policy. You can specify multiple policy headers per request. Example: `AC-Policy-Country`.
`AC-Price-Book-ID` | Optional. Defines how prices are calculated for a specific channel. Use if the merchant uses price books to calculate pricing. Merchandising Services provides a default price book `main` with currency in US dollars.
`AC-Scope-Locale`: | Required. The locale (language or geography) scope to filter products for display or update, for example `en_US`. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve the locale IDs available for each channel.
`X-Api-Key` | Use the [Public API Key](https://experienceleague.adobe.com/en/docs/commerce/user-guides/integration-services/saas#genapikey) for your production environment when submitting Storefront API requests. |

## Request template

Use the following template for GraphQL requests using [cURL](https://curl.se/). Use required and optional headers as needed. Replace placeholders with required values.

```shell
curl --request POST \
-- url https://catalog-service.adobe.io/graphql \
--header 'AC-Channel-ID:  <CHANNEL_ID>'  \
--header 'AC-Environment-ID: <DATA_SPACE_ID>' \
--header 'AC-Policy-<POLICY_NAME>: <POLICY_VALUE>' \
--header 'AC-Price-Book-ID-<PRICEBOOK_ID>' \
--header 'AC-Scope-Locale: <LOCALE_VALUE>' \
--header 'x-api-key: <API_KEY>' \
--data '<API_PAYLOAD>'
```

| Placeholder name | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| CHANNEL_ID     | The ID for the channel products will be sold through. Use the [channels query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-channels) to retrieve available IDs.|
| DATA_SPACE_ID    | [SaaS Data Space ID](https://experienceleague.adobe.com/en/docs/commerce/user-guides/integration-services/saas#saas-data-space-provisioning) where your catalog data is stored.                                               |
| POLICY_NAME: POLICY_VALUE | When used, the policy trigger name and value that sets data access filters to restrict product access based on request attributes. Use the [policies query](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#query-policies) to retrieve available policies.                    |
| PRICE_BOOK_ID    | When used, the price book ID used to retrieve the pricing schedule for a SKU. |
| LOCALE_VALUE | The locale (language or geography) scope to filter products for display or update. |
| API_KEY          | Adobe Commerce [API_KEY](#authentication). Use the value for the production public key.                              |
| API_PAYLOAD      | API payload. See examples in the [tutorial](../ccdm-use-case.md)

For sample requests, see the [tutorial](../ccdm-use-case.md).
