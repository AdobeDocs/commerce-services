---
title: Get Started with the Merchandising API
edition: saas
description: Learn how to use the Merchandising GraphQL API to access real-time catalog, product discovery, and recommendations data from Adobe Commerce Optimizer.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Get started with the Merchandising API

Use the Merchandising API to retrieve product data from your Commerce catalogs and display it in Commerce frontend experiences. Data includes products, product attribute metadata, prices books, and prices.

## Prerequisites

Before using the Merchandising API, ensure you have:

- **Adobe Commerce Optimizer Access**: Active subscription and the instance ID associated with your Adobe Commerce Optimizer instance
- **Catalog Data**: Products and pricing data ingested via the [Data Ingestion API](../data-ingestion/index.md)
- **Catalog Views**: Configured views and policies in Adobe Commerce Optimizer
- **Authentication Setup**: Proper headers configured for API requests
- **GraphQL Client**: A tool or library to make GraphQL requests (e.g., Postman, Apollo Client, or cURL)
- **Familiarity with GraphQL**: Basic understanding of GraphQL queries and mutations
- **Development Environment**: Set up for testing API requests (e.g., local development server or staging environment)

## Merchandising API overview

The Merchandising API is a GraphQL API that allows you to access real-time catalog, product discovery, and recommendations data from Adobe Commerce Optimizer. It is designed for backend applications to retrieve product data for use in frontend experiences. All product and price data is stored in a single base catalog that can be filtered and configured to create custom catalogs using Adobe Commerce Optimizer. This approach reduces processing time and improves catalog performance, especially for merchants with large or complex product assortments.

### Base URL

Send all Merchandising API requests to this base URL:

```text
https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/graphql
```

The URL structure is:

```https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}```

- `region` is the cloud region where your instance is deployed.
- `environment-type` is present only for non-production,`sandbox` environments.
- `tenantId` is the unique identifier for your organization's specific instance within the Adobe Experience Cloud.

<InlineAlert variant="info" slots="text" />

Sandbox instances are available only in the North America region.

&NewLine; <!--Add space between the collapsible section and the previous paragraph-->

<details>
      <summary><b>Get your endpoint URL and tenant ID</b></summary>

import GetTenantId from '/src/_includes/authentication/get-tenant-id.md'

<GetTenantId />

</details>

### Authentication

Authentication is not required for the Merchandising API.

### Headers

When making requests to the storefront API, you must include required HTTP headers that provide necessary information, such as the catalog view ID, catalog source locale. Additionally, you can include optional policy and price book headers that tailor the API response to your needs.

| Header name| Description
| --- | ---
|`AC-View-ID` | Required. The unique ID assigned to the catalog view that products will be sold through. For example, in the automotive industry, the catalog view could be dealers. In the manufacturing industry, the view could be a manufacturing location for suppliers. You can view the list of available catalog views and find the viewID from the [Adobe Commerce Optimizer UI](https://experienceleague.adobe.com/en/docs/commerce/optimizer/setup/catalog-view).|
`AC-Source-Locale`: | Required. The catalog source locale (language or geography) to filter products for display or update, for example `en_US`. See the catalog view configuration in the [Adobe Commerce Optimizer UI](https://experienceleague.adobe.com/en/docs/commerce/optimizer/catalog/channels) to determine the correct value.|
`AC-Policy-{*}` | Optional. The trigger name configured for a policy that sets data access filters to restrict product access based on request attributes and context. Examples include POS physical stores, marketplaces, or advertisement pipelines like Google, Meta, or Instagram. You can view the list of available policies and associated ids from the [Adobe Commerce Optimizer UI](https://experienceleague.adobe.com/en/docs/commerce/optimizer/catalog/policies). You can specify multiple policy headers per request. Example: `AC-Policy-Brand`.
`AC-Price-Book-ID` | Optional. Defines how prices are calculated for a specific catalog view. Supply this value if the merchant uses price books to calculate product pricing. If you do not include the Price Book ID, Merchandising Services provides a default price book `main` with currency in US dollars. See the Catalog View configuration for a list of price books available for use with the specified Catalog View.

### Request template

Use the following template to submit requests using [curl](https://curl.se/). Use required and optional headers as needed. Replace placeholders with required values.

```shell
curl --request POST \
--url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/graphql \
--header 'AC-View-ID: {{catalogViewId}}'  \
--header 'AC-Price-Book-ID: {{priceBookId}}'  \
--header 'AC-Policy-{{attributeCode}}: {{attributeValue}}'  \

--data '{{apiPayload}}'
```

| Placeholder name | Description                                                                               t                      |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| `catalogViewId`   | Required. The unique identifier assigned to the catalog view to filter the catalog data you want to display on the storefront, for example, `51330428-3090-4650-8394-7a4a12b2c087`.|
| `tenantId` | Required. The unique identifier for your organization's specific instance within the Adobe Experience Cloud, for example `Xyub6kdpvYCmeEdcCX7PTg`.|
| `attributeCode: attributeValue` | Optional. The policy trigger name and value that sets data access filters to restrict product access based on request attributes, for example `Brand:Cruz`.|
| `priceBookId`  | Optional. The price book ID used to retrieve the pricing schedule for a SKU, for example `west_coast_inc`. |
| `apiPayload`      | API payload. See examples in the [tutorial](../ccdm-use-case.md). |

Get the values for catalog view, policy, catalog source locale, and price book data from the [Adobe Commerce Optimizer UI](https://experienceleague.adobe.com/en/docs/commerce/optimizer/overview#quick-tour).

## Make your first request

To get started with the Merchandising API, follow these steps to make your first request:

1. Get values for the instance ID and required headers.

   - `tenantId`: Your unique instance ID for Adobe Commerce Optimizer
   - `AC-View-ID`: Catalog view ID from Adobe Commerce Optimizer

2. Make your first query.

   Use the following example to search for products using the `productSearch` query, replacing the variable with your own values based on the catalog data and the configuration or your Adobe Commerce Optimizer instance This query retrieves a list of products based on a search term, including their IDs, SKUs, names, and prices.

   ```bash
   curl -X POST \
     'https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/graphql' \
     -H 'Content-Type: application/json' \
     -H 'AC-View-ID: {{catalogViewId}}' \
     -d '{"query": "query ProductSearch($search: String!) { productSearch( phrase: $search, page_size: 10) { items { productView { sku name description shortDescription images { url } ... on SimpleProductView { attributes { label name value } price { regular { amount { value currency } } roles } } } } } }", "variables": { "search": "your-string"}}'
   ```

   For sample requests and examples using the API, see the <a href="https://developer.adobe.com/commerce/services/reference/graphql/" target="_blank" rel="noopener noreferrer">Merchandising API Reference</a>.

## Test with the GraphQL Playground

For interactive testing and exploration, use the <a href="https://experienceleague.adobe.com/developer/commerce/storefront/playgrounds/commerce-optimizer/" target="_blank" rel="noopener noreferrer">Adobe Commerce Optimizer API Playground</a>.

## Related documentation

- **[Adobe Commerce Optimizer Guide](https://experienceleague.adobe.com/en/docs/commerce/optimizer/overview)**: Review comprehensive documentation for Adobe Commerce Optimizer.
- **[Adobe Commerce Storefront Guide](https://experienceleague.adobe.com/developer/commerce/storefront/)**: Get help integrating Adobe Commerce Optimizer with an Adobe Commerce storefront on Adobe Edge Delivery Services.
- **[Adobe Developer App Builder for Commerce](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/adobe-developer-app-builder/introduction-to-app-builder)**: Get documentation for building custom applications to integrate with Adobe Commerce solutions.
- **[Adobe Commerce Knowledge Base](https://experienceleague.adobe.com/en/docs/commerce-knowledge-base/kb/overview)**: Search the Adobe Commerce knowledge base for self-service solutions
