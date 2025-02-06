---
title: Use the Composable Catalog Data Model
edition: ee
description: Learn how to use the Composable Catalog Data Model to store and retrieve catalog data more efficiently and deliver more performant storefront experiences.

keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the composable catalog data model with your storefront

Learn how a company with a single base catalog can use the composable catalog data model (CCDM) APIs to add product data, define catalogs using projections, and retrieve the catalog data for display in a headless storefront.

This end-to-end use case demonstrates how a company with a single base catalog can use CCDM to:

- Support products across two geographical markets and two distinct brands.
- Enhance operational efficiency by avoiding duplication of product catalogs across multiple websites.
- Control product visibility on websites based on geographical market and brand specifications.

Before you begin, review [set up and manage catalogs](manage-catalogs.md) to understand the channel and policy concepts.

## Let's get started

This use case demonstrates an end-to-end workflow for using CCDM based on the following components:

- One Channel

  The `Company A` channel is linked to a single scope (locale: `en`) and two policies.

- Two Policies
  - The **Location** policy (*Policy 1*) that defines the catalog projection for `locations`. This projection can be used to specify a target geographic market for selling specified SKUs. For example: `UK`, `USA`.
  - The **Brand** policy (*Policy 2*) defines the catalog projection for `brands`. This projection can be used to specify one or more brands associated with each product SKU, for example `Brand A`, `Brand B`.

- Two products SKUs
  - `Motor part 1` belongs to `Brand A` and is aimed to be sold in `USA`.
  - `Motor part 2` belongs to `Brand B` and is aimed to be sold in `UK`.
  - The values for brand and location are product attributes of each SKU.
  - The product specification does not include any `Channel` or `Policy` values. When retrieving products using the Storefront API, Channel and Policy values are passed in using API headers.

- Storefront APIs
  - A catalog service API endpoint is used to represent how data will be retrieved using CCDM concepts.
  - Pay close attention to the API headers. The CCDM concepts for filtering products using channels and policies are implemented through the API headers.
  - Two Storefront API calls are represented:
    - API Call one: Returns a SKU for `Brand A` and `USA` combination.
    - API Call two: Returns a SKU for `Brand B` and `UK` combination.

In the steps below, you use CCDM APIs to add the product, channel, and policy data to the SaaS data space for your project. Then, you use the the [Storefront API](./admin/using-the-api.md) to retrieve the data using the brand, and policy filters.

## Step 1. Add products to your catalog

Add two simple products, "Motor Part 1" and "Motor Part 2", directly to Commerce SaaS data storage by submitting a [createProducts](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingetion/api-reference/#operation/ProductsPost) request using the Data Ingestion API.

Send the product requests to the following endpoint:

`POST commerce.adobe.io/feeds/products/api/v1/catalog/_environment_id`

The `_environment_id` is the [SaaS data space ID](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#saasenv) where catalog services data is stored.

Include the [required headers and path parameters](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/#operation/ProductsPost) in the request.

### Create Motor Part 1 product

Add the simple product *Motor Part 1* with two attribute codes, `Brand` set to *Brand A*, and `Country` set to *USA* by sending the following payload in the Create products request.

**Endpoint**

`POST commerce.adobe.io/api/products/v1/catalog/_environment_id`

**Headers**

Include the [required headers and path parameters](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/#operation/ProductsPost) in the request.

**Payload**

```json
{
  "sku": "simple_product_1",
  "scope": {
    "locale": "en"
  },
  "name": "Motor Part 1",
  "slug": "motor-part",
  "status": "ENABLED",
  "description": "Motor part sold only in USA",
  "shortDescription": "motor part",
  "roles": [
    "SEARCH",
    "CATALOG"
  ],
  "metaTags": {
    "title": " ",
    "description": "SEO optimization",
    "keywords": [
      "motor",
      "part"
    ]
  },
  "attributes": [
    {
      "code": "Brand",
      "type": "STRING",
      "values": [
        "Brand A"
      ]
    },
    {
      "code": "Country",
      "type": "ARRAY",
      "values": [
        "USA"
      ]
    }
  ],
  "images": [
    {
      "url": "https://example.com",
      "label": "photo of my motor",
      "roles": [
        "PDP",
        "PLP"
      ]
    }
  ],
  "links": [
    {
      "sku": "motor-part",
      "type": "related"
    }
  ],
  "routes": [
    {
      "path": "motor-part"
    },
    {
      "path": "auto/motor-part",
      "position": 1
    }
  ]
}
```

### Create Motor Part 2 product

Add the product *Motor Part 2* with two attribute codes, `Brand` set to *Brand B*, and `Country` set to *UK* by sending the following payload in the createProducts request.

**Payload**

```json
{
  "sku": "simple_product_2",
  "scope": {
    "locale": "en"
  },
  "name": "Motor Part 2",
  "slug": "motor-part",
  "status": "ENABLED",
  "description": "Motor part sold only in UK",
  "shortDescription": "motor part",
  "roles": [
    "SEARCH",
    "CATALOG"
  ],
  "metaTags": {
    "title": " ",
    "description": "SEO optimization",
    "keywords": [
      "motor",
      "part"
    ]
  },
  "attributes": [
    {
      "code": "Brand",
      "type": "STRING",
      "values": [
        "Brand B"
      ]
    },
    {
      "code": "country",
      "type": "ARRAY",
      "values": [
        "UK"
      ]
    }
  ],
  "images": [
    {
      "url": "https://example.com",
      "label": "photo of my motor",
      "roles": [
        "PDP",
        "PLP"
      ]
    }
  ],
  "links": [
    {
      "sku": "motor-part",
      "type": "related"
    }
  ],
  "routes": [
    {
      "path": "motor-part"
    },
    {
      "path": "auto/motor-part",
      "position": 1
    }
  ]
}
```

## Step 2. Define the channel and policies

In this step, create a channel for `Company A` using the [CreateChannelRequest](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#definition-CreateChannelRequest) GraphQL mutation from the Catalog Management API.

Assign two policies to the channel: a `Location Policy` with "USA" and "UK" as locations, and a `Brand Policy` with "Brand A" and "Brand B".

Send GraphQL requests for channels and policies to the following endpoint:

`http://commerce.adobe.io/admin/graphql`

You must create the policies before you can assign them to a channel.

### Create policies

Use the [createPolicy](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#definition-CreatePolicyRequest) GraphQL mutation from the Catalog Management API to define the location and brand policies.

The query response returns a `PolicyId` value that is required when you assign the policy to a channel.

#### Location policy

**Request**

```graphql
mutation CreatePolicy {
  createPolicy(policyRequest: {
    name: "Location policy",
    mandatory: true,
    actions: [
      {
        triggers: [
          {
            name: "AC-Policy-Country",
            transportType: HTTP_HEADER
          }
        ],
        filters: [
          {
            attribute: "country",
            valueSource: TRIGGER,
            value: "AC-Policy-Country",
            actionFilterOperator: EQUALS,
            enabled: true
          }
        ]
      }
    ]
  }) {
    name
    policyId
    mandatory
    actions {
      triggers {
        name
        transportType
      }
      filters {
        attribute
        valueSource
        value
        actionFilterOperator
        enabled
      }
    }
    createdAt
    updatedAt
  }
}
```

**Response**

```graphql
{
  "data": {
      "createPolicy": {
          "policyId": "56a6908f-eyx3-59c3-sye8-574509e6y45 39c8106d",
          "name": "Location policy",
          "mandatory": true,
          "actions": [
              {
                  "triggers": [
                      {
                          "transportType": "HTTP_HEADER",
                          "name": "AC-Policy-Country"
                      }
                  ],
                  "filters": [
                      {
                          "attribute": "country",
                          "actionFilterOperator": "EQUALS",
                          "value": "AC-Policy-Country",
                          "enabled": true,
                          "valueSource": "TRIGGER"
                      }
                  ]
              }
          ],
          "createdAt": "2024-11-12T12:00:16.146157",
          "updatedAt": "2024-11-12T12:00:16.146157"
      }
  },
  "extensions": {
      "request-id": "bbcdcbc79b5d873b"
  }
}
```

#### Brand policy

**Request**

```graphql
mutation CreatePolicy {
  createPolicy(policyRequest: {
    name: "Brand policy",
    mandatory: true,
    actions: [
      {
        triggers: [
          {
            name: "AC-Policy-Brand",
            transportType: HTTP_HEADER
          }
        ],
        filters: [
          {
            attribute: "brand",
            valueSource: TRIGGER,
            value: "AC-Policy-Brand",
            actionFilterOperator: EQUALS,
            enabled: true
          }
        ]
      }
    ]
  }) {
    name
    policyId
    mandatory
    actions {
      triggers {
        name
        transportType
      }
      filters {
        attribute
        valueSource
        value
        actionFilterOperator
        enabled
      }
    }
    createdAt
    updatedAt
  }
}
```

**Response**

```graphql
{
  "data": {
      "createPolicy": {
          "policyId": "39c8106d-aab2-49b2-aac3-177608d4e567",
          "name": "Brand policy",
          "mandatory": true,
          "actions": [
              {
                  "triggers": [
                      {
                          "transportType": "HTTP_HEADER",
                          "name": "AC-Policy-Brand"
                      }
                  ],
                  "filters": [
                      {
                          "attribute": "country",
                          "actionFilterOperator": "EQUALS",
                          "value": "AC-Policy-Country",
                          "enabled": true,
                          "valueSource": "TRIGGER"
                      }
                  ]
              }
          ],
          "createdAt": "2024-11-12T12:00:16.146157",
          "updatedAt": "2024-11-12T12:00:16.146157"
      }
  },
  "extensions": {
      "request-id": "bbcdcbc79b5d6788b"
  }
}
```

### Create channel

Create a channel and assign the policies for location filtering and brand filtering. Use the policy IDs returned in the `createPolicy` request to assign the policies.

Pass the [required headers](https://developer-stage.adobe.com/commerce/services/composable-catalog/admin/using-the-api/#headers) for the request.

**Request**

```graphql
mutation CreateChannel {
  createChannel(channelRequest: {
    name: "Company A",
    scopes: [
      {
        locale: "en"
      }
    ],
    policyIds: [
      "56a6908f-eyx3-59c3-sye8-574509e6y45","39c8106d-aab2-49b2-aac3-177608d4e56",
    ]
  }) {
    name
    policyIds
    scopes {
      locale
    }
  }
}
```

## Step 4. Retrieve SKUs

Use the Storefront GraphQL API [productSearch](https://developer-stage.adobe.com/commerce/services/graphql-api/storefront-api/index.html#query-productSearch) query to retrieve the SKUs you created.

Send GraphQL requests for Storefront APIs to the following endpoints:

- Sandbox: `https://catalog-service-sandbox.adobe.io/graphql`
- Production: `https://catalog-service.adobe.io/graphql`

### Retrieve SKU for Brand `A`

Retrieve the SKU you created for `Brand A` where location is `USA`. Use the search phrase `Motor parts`, and specify a page size to limit results.

The brand and location (`AC-Policy-Brand` and `AC-Policy-Country`) are passed in using [Storefront API headers](https://developer-stage.adobe.com/commerce/services/composable-catalog/storefront-services/using-the-api/#header).

The following lists the sample headers:

- `Content-Type`: `application/json`
- `AC-Environment-Id`: `123`
- `Magento-Store-Code`: `main_website_store`
- `AC-Scope-Locale`: `default`
- `AC-Price-Book-Id`: `base`
- `AC-Channel-Id`: `channelId-1`
- `AC-Policy-State`: `AC-Policy-Country`
- `X-Api-Key`: `***************`
- `AC-Policy-Country`: `USA`
- `AC-Policy-Brand`: `Brand A`

#### Request

```graphql
query getProductSearchDetails(
  $filter: [SearchClauseInput!],
  $phrase: String!,
  $sort: [ProductSearchSortInput!],
  $pageSize: Int!
) {
  productSearch(
    phrase: $phrase,
    filter: $filter,
    sort: $sort,
    page_size: $pageSize
  ) {
    items {
      productView {
        sku
        name
        slug
        status
        images
        links
        attributes
        description
        shortDescription
        routes
        roles
        ... on SimpleProductView {
          price {
            final {
              amount {
                value
                currency
              }
            }
            regular {
              amount {
                value
                currency
              }
            }
          }
        }
      }
    }
  }
}
```

Here are the variable values to specify in the request:

```json
{
  "phrase": "Motor parts",
  "filter": [],
  "sort": [],
  "pageSize": 100
}
```

#### Response

The response returns the product details for a single SKU, `Motor Part 1`.

```graphql
{
  "errors": [],
  "data": {
    "productSearch": {
      "items": [
        {
          "productView": {
            "sku": "simple_product_1",
            "name": "Motor Part 1",
            "images": [
              {
                "url": "https://example.com",
                "label": "photo of my motor",
                "roles": [
                  "PDP",
                  "PLP"
                ]
              }
            ],
            "links": [
              {
                "sku": "motor-part",
                "type": "related"
              }
            ],
            "attributes": [
              {
                "code": "Brand",
                "type": "STRING",
                "values": [
                  "Brand A"
                ]
              },
              {
                "code": "country",
                "type": "ARRAY",
                "values": [
                  "USA"
                ]
              }
            ],
            "description": "Motor part sold only in USA",
            "shortDescription": "motor part",
            "routes": [
              {
                "path": "motor-part"
              },
              {
                "path": "pants/motor-part",
                "position": 1
              }
            ],
            "roles": [
              "SEARCH",
              "CATALOG"
            ],
            "metaTags": {
              "title": " ",
              "description": "SEO opt",
              "keywords": [
                "motor",
                "part"
              ]
            },
            "price": {
              "final": {
                "amount": {
                  "value": "2099.00",
                  "currency": "USD"
                }
              },
              "regular": {
                "amount": {
                  "value": "2299.00",
                  "currency": "USD"
                }
              }
            }
          }
        }
      ]
    }
  }
}
```

### Retrieve SKU for Brand B

Retrieve the SKU you created for `Brand B` where location is `UK`. Use the search phrase `Motor parts`, and specify a page size to limit results.

The brand and location (`AC-Policy-Brand` and `AC-Policy-Country`) are passed in using the [Storefront API headers](https://developer-stage.adobe.com/commerce/services/composable-catalog/storefront-services/using-the-api/#header).

The following lists the sample headers:

- `Content-Type`: `application/json`
- `AC-Environment-Id`: `123`
- `Magento-Store-Code`: `main_website_store`
- `AC-Scope-Locale`: `default`
- `AC-Price-Book-Id`: `base`
- `AC-Channel-Id`: `channelId-1`
- `AC-Policy-State`: `AC-Policy-Brand`
- `X-Api-Key`: `search_gql`
- `AC-Policy-Brand`: `Brand B`
- `AC-Policy-Country`: `UK`

#### Request

```graphql
query getProductSearchDetails(
  $filter: [SearchClauseInput!],
  $phrase: String!,
  $sort: [ProductSearchSortInput!],
  $pageSize: Int!
) {
  productSearch(
    phrase: $phrase,
    filter: $filter,
    sort: $sort,
    page_size: $pageSize
  ) {
    items {
      productView {
        sku
        name
        images
        links
        attributes
        description
        shortDescription
        routes
        roles
        ... on SimpleProductView {
          price {
            final {
              amount {
                value
                currency
              }
            }
            regular {
              amount {
                value
                currency
              }
            }
          }
        }
      }
    }
  }
}
```

Here are the variables specified in the request:

```json
{
  "phrase": "Motor parts",
  "filter": [],
  "sort": [],
  "pageSize": 100
}
```

#### Response

The response returns the product details for a single SKU, `Motor Part 2`.

```graphql
{
  "errors": [],
  "data": {
    "productSearch": {
      "items": [
        {
          "productView": {
            "sku": "simple_product_2",
            "name": "Motor Part 2",
            "images": [
              {
                "url": "https://example.com",
                "label": "photo of my motor",
                "roles": [
                  "PDP",
                  "PLP"
                ]
              }
            ],
            "links": [
              {
                "sku": "motor-part",
                "type": "related"
              }
            ],
            "attributes": [
              {
                "code": "Brand",
                "type": "STRING",
                "values": [
                  "Brand B"
                ]
              },
              {
                "code": "country",
                "type": "ARRAY",
                "values": [
                  "UK"
                ]
              }
            ],
            "description": "Motor part sold only in UK",
            "shortDescription": "motor part",
            "routes": [
              {
                "path": "motor-part"
              },
              {
                "path": "pants/motor-part",
                "position": 1
              }
            ],
            "roles": [
              "SEARCH",
              "CATALOG"
            ],
            "price": {
              "final": {
                "amount": {
                  "value": "1769.00",
                  "currency": "GBP"
                }
              },
              "regular": {
                "amount": {
                  "value": "1899.00",
                  "currency": "GBP"
                }
              }
            }
          }
        }
      ]
    }
  }
}
```
