---
title: Get Started with the Data Ingestion API
edition: saas
description: Get information about using the data ingestion API to create and manage product, price book, and price data for you commerce catalog.
keywords:
  - REST
  - Services
  - Backend Development
  - Performance
---

# Get started with the data ingestion API

Use the data ingestion API to create and manage product data for your ecommerce catalog. Data includes products, product attribute metadata, prices books, and prices.

## Data Ingestion API overview

The Data Ingestion API is a RESTful API that allows you to manage product and price data for commerce applications using Adobe Commerce Optimizer. It is designed for backend applications to send data directly to Commerce Optimizer for use with storefront services. All product and price data is stored in a single base catalog that can be filtered and configured to create custom catalogs using Adobe Commerce Optimizer. This approach reduces processing time and improves catalog performance, especially for merchants with large or complex product assortments.

## Base URL

Send all Data Ingestion API requests to the following base URL:

```text
https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}
```

The URL structure is:

`https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}`

- `region` is the cloud region where your instance is deployed.
- `environment-type` identifies non-production environments, for example, `sandbox` or `staging`.
- `tenantId` is the unique identifier for your organization's specific instance within the Adobe Experience Cloud.

&NewLine; <!--Add space between the collapsible section and the previous paragraph-->

<details>
      <summary><b>Get your tenant ID</b></summary>

import GetTenantId from '/src/_includes/authentication/get-tenant-id.md'

<GetTenantId />

</details>

## Header parameters

Include the following headers in REST API requests.

| Header name  | Required | Description |
|--------------|----------|-------------|
| `Content-Encoding` | No  | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`.                                                                           |
| `Content-Type`  | Yes   | Media type of the resource. Accepted value: `application/json`. |
| `Authorization: Bearer {access token}`  | Yes  | Bearer access token generated using credentials from the Adobe developer project for the API integration.  See [Authentication](authentication.md).                          |

## Request template

Use the following template to submit requests using [curl](https://curl.se/) replacing the placeholders as required.

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/{{endpoint}} \
  --header "Content-Type:  application/json" \
  --header "Authorization: Bearer {access token}" \
  --data "{apiPayload}"
```

| Placeholder name | Description                                                                                                    |
|------------------|----------------------------------------------------------------------------------------------------------------|
| `endpoint`       | Endpoint for specific Data Ingestion API, for example: `/v1/catalog/products/prices`  |
| `access token`   | Bearer token generated from IMS credentials. See [Authentication](authentication.md).                                   |
| `apiPayload`     | API payload see examples in the [tutorial](../ccdm-use-case.md)                                                                             |

For sample requests, see the [tutorial](../ccdm-use-case.md).

## Make your first request

To get started with the Data Ingestion API, follow these steps to make your first request.

1. Generate an access token for the `Authorization: Bearer {access-token}` header.

2. Submit your first request
   - Use the [curl](https://curl.se/) command line tool to submit a request to the Data Ingestion API.
   - Use the following endpoint to create the required product metadata for a catalog source (`locale`):

  ```shell
  curl -X POST \
    'https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/v1/catalog/attributes/metadata' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer {access token}' \
    -d '[
      {
        "code": "sku",
        "source": {
          "locale": "en"
        },
        "label": "Product Name",
        "dataType": "TEXT",
        "visibleIn": [
          "PRODUCT_DETAIL",
          "PRODUCT_LISTING",
          "SEARCH_RESULTS",
          "PRODUCT_COMPARE"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
          "AUTOCOMPLETE"
        ]
      },
      {
        "code": "name",
        "source": {
          "locale": "en"
        },
        "label": "Product Name",
        "dataType": "TEXT",
        "visibleIn": [
          "PRODUCT_DETAIL",
          "PRODUCT_LISTING",
          "SEARCH_RESULTS",
          "PRODUCT_COMPARE"
        ],
        "filterable": false,
        "sortable": true,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
          "AUTOCOMPLETE"
        ]
      },
      {
        "code": "description",
        "source": {
          "locale": "en"
        },
        "label": "Product Description",
        "dataType": "TEXT",
        "visibleIn": [
          "PRODUCT_DETAIL"
        ],
        "filterable": false,
        "sortable": false,
        "searchable": false,
        "searchWeight": 1,
        "searchTypes": [
          "AUTOCOMPLETE"
        ]
      },
      {
        "code": "shortDescription",
        "source": {
          "locale": "en"
        },
        "label": "Product Short Description",
        "dataType": "TEXT",
        "visibleIn": [
          "PRODUCT_DETAIL"
        ],
        "filterable": false,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
          "AUTOCOMPLETE"
        ]
      },
      {
        "code": "price",
        "source": {
          "locale": "en"
        },
        "label": "Price",
        "dataType": "DECIMAL",
        "visibleIn": [
          "PRODUCT_DETAIL",
          "PRODUCT_LISTING",
          "SEARCH_RESULTS",
          "PRODUCT_COMPARE"
        ],
        "filterable": true,
        "sortable": true,
        "searchable": false,
        "searchWeight": 1,
        "searchTypes": []
      }
    ]'
  ```

3. Verify the response
   - If the request is successful, you receive a `200 Created` response with the metadata for the product attributes.
   - If the request fails, you receive an error message with details about the issue.

### Next steps

After you successfully make your first request, you can continue to use the Data Ingestion API to manage product and price data for your commerce catalog. The next steps include:

- Create product metadata to define the attributes and behavior of your products.
- Create products to add items to your catalog.
- Create price books to manage pricing for different customer segments, regions, or sales channels.
- Create prices to set the monetary values for your products within the price books.

You can also explore the [API reference](https://developer.adobe.com/commerce/services/reference/rest/) for detailed information about each endpoint and its parameters.

## Create integrations with SDK

The Adobe Commerce Optimizer (ACO) SDK simplifies integration with the Data Ingestion API by providing pre-built methods for catalog ingestion and IMS authentication. The SDK handles the complexity of API interactions, allowing you to focus on your business logic.

There are currently two SDKs available:

[TypeScript SDK](https://github.com/adobe-commerce/aco-ts-sdk) – for JavaScript/TypeScript integrations

[Java SDK](https://github.com/adobe-commerce/aco-java-sdk) – for Java-based integrations

To download either SDK and learn how to use it, see the corresponding GitHub repository linked above.

## Limitations

The Data Ingestion API has a rate limit of 300 requests per minute.

For additional information about limits and boundaries, see the [Limits and boundaries](https://experienceleague.adobe.com/docs/commerce-optimizer/boundaries-limits.html) section in the *Adobe Commerce Optimizer Guide*.

<InlineAlert variant="info" slots="text" />

>This guide covers direct API access using bearer tokens. For user authentication workflows, see the [User Authentication Guide](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation/).
