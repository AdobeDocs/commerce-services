---
title: Create a composable catalog for your storefront
edition: ee
description: Tutorial to create a composable catalog that supports a single base catalog which can deliver catalog projections based on geographic locations and brand.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the composable catalog with your storefront

Learn how a company with a single base catalog can use the composable catalog data model (CCDM) APIs to add product data, define catalogs using projections, and retrieve the catalog data for display in a headless storefront.

This end-to-end use case demonstrates how a company with a single base catalog can use CCDM to:

- Support products across two geographical markets and two distinct brands.
- Support pricing by customer segment
- Enhance operational efficiency by avoiding duplication of product catalogs across multiple websites.
- Control product visibility on websites based on geographical market and brand specifications.

Before you begin, review [set up and manage catalogs](manage-catalogs.md) to understand the channel and policy concepts.

## Let's get started

This use case demonstrates an end-to-end workflow for using CCDM based on the following components:

- One Channel

  A distribution channel for `Zenith Automotive` is linked to a single scope, (locale: `en-US`) and two policies.

  - The **Location** policy (*Policy 1*) that defines the catalog projection for `locations`. This projection can be used to specify a target geographic market for selling specified SKUs. For example: `UK`, `USA`.
  - The **Brand** policy (*Policy 2*) defines the catalog projection for `brands`. This projection can be used to specify one or more brands associated with each product SKU, for example `Aurora`, `Bolt`.

- Two products SKUs
  - `Aurora Prism battery` belongs to `Aurora` and is aimed to be sold in `USA`.
  - `Bolt Atlas battery` belongs to `Bolt` and is aimed to be sold in `UK`.
  - The values for brand and location are product attributes of each SKU.
  - The product specification does not include any `Channel` or `Policy` values. When retrieving products using the Storefront API, Channel and Policy values are passed in using API headers.

- Storefront APIs
  - A catalog service API endpoint is used to represent how data will be retrieved using CCDM concepts.
  - Pay close attention to the API headers. The CCDM concepts for filtering products using channels and policies are implemented through the API headers.
  - Two Storefront API calls are represented:
    - API Call one: Returns a SKU for `Aurora` and `USA` combination.
    - API Call two: Returns a SKU for `Bolt` and `UK` combination.

In the steps below, you use CCDM APIs to add the product, channel, and policy data to the SaaS data space for your project. Then, you use the the [Storefront API](./admin/using-the-api.md) to retrieve the product data based on brand and location attributes.

## Step 1. Add products to your catalog

Add two simple products, "Aurora Prism battery" and "Bolt Atlas battery" and the product attribute metadata to define the search and display characteristics for the brand and country attributes.

### Add product attribute metadata

Create the metadata to define the search characteristics and filters for displaying *location* and *brand* attributes on the storefront by submitting a [Create product attribute metadata](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/#operation/ProductMetadataPut) POST request.

**Request**

```shell
curl --request POST \
  --url https://commerce.adobe.io/api/v1/catalog/products/metadata/<DATA_SPACE_ID> \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '[
    {
        "code": "brand",
        "scope": {
            "locale": "en-US"
        },
        "label": "Brand",
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
        "searchWeight": 55,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
    {
        "code": "country",
        "scope": {
            "locale": "en-US"
        },
        "label": "Country",
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
        "searchWeight": 55,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    }
]'
```

### Add products

Add products by submitting a [createProducts](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/#operation/ProductsPost) POST request using the Data Ingestion API.

#### Create Aurora product

Add the simple product *Aurora Prism Battery* with two attribute codes, `Brand` set to *Aurora*, and `Country` set to *USA* by sending the following payload in the Create products request.

**Create product request**

```shell
curl --request POST \
  --url https://commerce.adobe.io/api/v1/catalog/products/<DATA_SPACE_ID> \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '[
        {
        "sku": "aurora_prism_battery",
        "scope": {
            "locale": "en-US"
        },
        "name": "Aurora prism battery",
        "slug": "vehicle-battery",
        "status": "ENABLED",
        "description": "Vehicle battery sold only in USA",
        "shortDescription": "battery",
        "roles": [
            "SEARCH",
            "CATALOG"
        ],
        "metaTags": {
            "title": " ",
            "description": "Zenith Automotive Vehicles and Parts",
            "keywords": [
                "battery",
                "part"
            ]
        },
        "attributes": [
            {
                "code": "Brand",
                "type": "STRING",
                "values": [
                    "Aurora"
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
                "url": "https://picsum.photos/300/200",
                "label": "aurora prism battery photo",
                "roles": [
                    "PDP",
                    "PLP"
                ]
            }
        ],
        "links": [
            {
                "sku": "aurora-prism-2025",
                "type": "related"
            }
        ],
        "routes": [
            {
                "path": "aurora-prism-battery"
            },
            {
                "path": "vehicles/aurora-prism/parts",
                "position": 1
            }
        ]
        }
]'
```

#### Create Bolt product

Add the product *Bolt Atlas Battery* with two attribute codes, `Brand` set to *Bolt*, and `Country` set to *UK* by sending the following payload in the [createProducts](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/#operation/ProductsPost) request.

**Create product request**

```shell
curl --request POST \
  --url https://commerce.adobe.io/api/v1/catalog/products/<DATA_SPACE_ID> \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '[
        {
        "sku": "bolt_atlas_battery",
        "scope": {
            "locale": "en-US"
        },
        "name": "Bolt Atlas battery",
        "slug": "vehicle-battery",
        "status": "ENABLED",
        "description": "Vehicle battery sold only in UK",
        "shortDescription": "battery",
        "roles": [
            "SEARCH",
            "CATALOG"
        ],
        "metaTags": {
            "title": " ",
            "description": "Zenith Automotive Vehicles and Parts",
            "keywords": [
                "battery",
                "part"
            ]
        },
        "attributes": [
            {
                "code": "Brand",
                "type": "STRING",
                "values": [
                    "Bolt"
                ]
            },
            {
                "code": "Country",
                "type": "ARRAY",
                "values": [
                    "UK"
                ]
            }
        ],
        "images": [
            {
                "url": "https://picsum.photos/300/200",
                "label": "bolt atlas battery photo",
                "roles": [
                    "PDP",
                    "PLP"
                ]
            }
        ],
        "links": [
            {
                "sku": "bolt-atlas-2025",
                "type": "related"
            }
        ],
        "routes": [
            {
                "path": "bolt-atlas-battery"
            },
            {
                "path": "vehicles/bolt-atlas/parts",
                "position": 1
            }
        ]
        }
]'
```

## Step 2. Define the channel and policies

In this step, create a channel for `Zenith Automotive` using the [Create channel](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#mutation-createChannel) GraphQL mutation from the Catalog Management API.

Assign two policies to the channel: a `Location Policy` with "USA" and "UK" as locations, and a `Brand Policy` with "Aurora" and "Bolt".

### Create policies

Use the [createPolicy](https://developer-stage.adobe.com/commerce/services/graphql-api/admin-api/index.html#definition-CreatePolicyRequest) GraphQL mutation from the Catalog Management API to define the location and brand policies.

The query response returns a `PolicyId` value that is required when you assign the policy to a channel.

#### Location policy

**cURL Request**

```shell
curl --request POST \
  --url http://commerce.adobe.io/admin/graphql \
  --header 'Content-Type: application/json' \
  --header 'AC-Environment-Id: <DATA_SPACE_ID>' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '{"query":"mutation createPolicy {\n\tcreatePolicy(\n\t\tpolicyRequest: {\n\t\t\tname: \"Location Policy\"\n\t\t\tmandatory: true\n\t\t\tactions: [\n\t\t\t\t{\n\t\t\t\t\ttriggers: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tname: \"AC-Policy-Country\",\n\t\t\t\t\t\t\ttransportType: HTTP_HEADER\n\t\t\t\t\t\t}\n\t\t\t\t\t]\n\t\t\t\t\tfilters: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tattribute: \"country\",\n\t\t\t\t\t\t\tvalueSource: TRIGGER,\n\t\t\t\t\t\t\tvalue: \"AC-Policy-Country\"\n\t\t\t\t\t\t\tactionFilterOperator: EQUALS,\n\t\t\t\t\t\t\tenabled: true\n\t\t\t\t\t\t}\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t) {\n\t\tname\n\t\tpolicyId\n\t\tmandatory\n\t\tactions {\n\t\t\ttriggers {\n\t\t\t\tname\n\t\t\t\ttransportType\n\t\t\t}\n\t\t\tfilters {\n\t\t\t\tattribute\n\t\t\t\tvalueSource\n\t\t\t\tvalue\n\t\t\t\tactionFilterOperator\n\t\t\t\tenabled\n\t\t\t}\n\t\t}\n\t\tcreatedAt\n\t\tupdatedAt\n\t}\n}\n","operationName":"createPolicy"}'
```

**Payload**

```graphl
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
          "policyId": "56a6908f-eyx3-59c3-sye8-574509e6y45",
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

**cURL Request**

```shell
curl --request POST \
  --url http://commerce.adobe.io/admin/graphql \
  --header 'Content-Type: application/json' \
  --header 'AC-Environment-Id: <DATA_SPACE_ID>' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '{"query":"mutation createPolicy {\n\tcreatePolicy(\n\t\tpolicyRequest: {\n\t\t\tname: \"Brand Policy\"\n\t\t\tmandatory: true\n\t\t\tactions: [\n\t\t\t\t{\n\t\t\t\t\ttriggers: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tname: \"AC-Policy-Brand\",\n\t\t\t\t\t\t\ttransportType: HTTP_HEADER\n\t\t\t\t\t\t}\n\t\t\t\t\t]\n\t\t\t\t\tfilters: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tattribute: \"brand\",\n\t\t\t\t\t\t\tvalueSource: TRIGGER,\n\t\t\t\t\t\t\tvalue: \"AC-Policy-Brand\"\n\t\t\t\t\t\t\tactionFilterOperator: EQUALS,\n\t\t\t\t\t\t\tenabled: true\n\t\t\t\t\t\t}\n\t\t\t\t\t]\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t) {\n\t\tname\n\t\tpolicyId\n\t\tmandatory\n\t\tactions {\n\t\t\ttriggers {\n\t\t\t\tname\n\t\t\t\ttransportType\n\t\t\t}\n\t\t\tfilters {\n\t\t\t\tattribute\n\t\t\t\tvalueSource\n\t\t\t\tvalue\n\t\t\t\tactionFilterOperator\n\t\t\t\tenabled\n\t\t\t}\n\t\t}\n\t\tcreatedAt\n\t\tupdatedAt\n\t}\n}\n","operationName":"createPolicy"}'
```

**Payload**

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

**cURL Request**

```shell
curl --request POST \
  --url http://commerce.adobe.io/admin/graphql \
  --header 'Content-Type: application/json'  \
  --header 'AC-Environment-Id: <DATA_SPACE_ID>' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '{"query":"mutation {\n    createChannel(\n        channelRequest: {\n            name: \"Zenith Automotive\",\n            scopes: [\n                { locale: \"en-US\" }\n            ]\n            policyIds : [\n                \"56a6908f-eyx3-59c3-sye8-574509e6y45\",\n                \"39c8106d-aab2-49b2-aac3-177608d4e567\",\n            ]\n        }\n    ) {\n        channelId\n        name\n        scopes {\n          locale\n        }\n        policyIds\n        createdAt\n        updatedAt\n    }\n}"}'
```

**Payload**

```graphql
mutation {
    createChannel(
        channelRequest: {
            name: "Zenith Automotive",
            scopes: [
                { locale: "en-US" }
            ]
            policyIds : [
                "56a6908f-eyx3-59c3-sye8-574509e6y45",
                "39c8106d-aab2-49b2-aac3-177608d4e567",
            ]
        }
    ) {
        channelId
        name
        scopes {
          locale
        }
        policyIds
        createdAt
        updatedAt
    }
}
```

**Response**

```json
{
    "data": {
        "channels": [
            {
                "name": "Zenith Automotive",
                "channelId": "b726c1e9-2842-4ab5-9b19-ca65c23bbb3b",
                "scopes": [
                    {
                        "locale": "en-US"
                    }
                ],
                "policyIds": [
                    "56a6908f-eyx3-59c3-sye8-574509e6y45",
                    "39c8106d-aab2-49b2-aac3-177608d4e567",
                ],
                "createdAt": "2024-12-04T19:18:46.075",
                "updatedAt": "2024-12-16T21:17:00.793"
            }
        ]
    }
}
```


## Step 3. Retrieve SKUs

Use the Storefront GraphQL API [productSearch](https://developer-stage.adobe.com/commerce/services/graphql-api/storefront-api/index.html#query-productSearch) query to retrieve the SKUs you created.

Send GraphQL requests for Storefront APIs to the following endpoints:

- Sandbox: `https://catalog-service-sandbox.adobe.io/graphql`
- Production: `https://catalog-service.adobe.io/graphql`

<InlineAlert variant="info" slots="text"/>

When you submit requests using Storefront API, use the Adobe Commerce API key for your production environment to authenticate to both sandbox and production endpoints.

### Retrieve SKU for the `Aurora` brand

Retrieve the SKU you created for `Aurora` where location is `USA`. Use the search phrase `Zenith Automotive Vehicles and Parts`, and specify a page size to limit results.

The brand and location (`AC-Policy-Brand` and `AC-Policy-Country`) are passed in using [Storefront API headers](https://developer-stage.adobe.com/commerce/services/composable-catalog/storefront-services/using-the-api/#header).

Use the following headers in the request:

```text
AC-Channel-Id: 'b726c1e9-2842-4ab5-9b19-ca65c23bbb3b'
AC-Environment-Id: '<DATA_SPACE_ID>'
AC-Policy-Brand: 'Aurora'
AC-Policy-Country: 'US'
AC-Price-Book-Id: 'base'
AC-Scope-Locale: 'en-US'
Content-Type: 'application/json'
X-Api-Key: '<API-KEY>'
```

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
  "phrase": "Zenith Automotive Vehicles and Parts",
  "filter": [],
  "sort": [],
  "pageSize": 100
}
```

#### Response

The response returns the product details for a single SKU, `Aurora Prism battery`.

```graphql
{
  "errors": [],
  "data": {
    "productSearch": {
      "items": [
        {
          "productView": {
            "sku": "aurora_prism_battery",
            "name": "Aurora Prism battery",
            "images": [
              {
                "url": "https://picsum.photos/300/200",
                "label": "aurora prism battery photo",
                "roles": [
                  "PDP",
                  "PLP"
                ]
              }
            ],
            "links": [
              {
                "sku": "aurora-prism-2025",
                "type": "related"
              }
            ],
            "attributes": [
              {
                "code": "Brand",
                "type": "STRING",
                "values": [
                  "Aurora"
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
            "description": "Zenith Automotive Vehicles and Parts",
            "shortDescription": "battery",
            "routes": [
              {
                "path": "aurora-prism-battery"
              },
              {
                "path": "vehicles/aurora-prism/parts",
                "position": 1
              }
              {
              "path": "aurora-prism-battery"
            },
            ],
            "roles": [
              "SEARCH",
              "CATALOG"
            ],
            "metaTags": {
              "title": " ",
              "description": "Zenith Automotive Vehicles and Parts",
              "keywords": [
                "battery",
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

### Retrieve SKU for the Bolt brand

Retrieve the SKU you created for `Bolt` where location is `UK`. Use the search phrase `Zenith Automotive Vehicles and Parts`, and specify a page size to limit results.

The brand and location (`AC-Policy-Brand` and `AC-Policy-Country`) are passed in using the [Storefront API headers](https://developer-stage.adobe.com/commerce/services/composable-catalog/storefront-services/using-the-api/#header).

Use the following headers in the request:

```text
AC-Channel-Id: 'b726c1e9-2842-4ab5-9b19-ca65c23bbb3b'
AC-Environment-Id: '<DATA_SPACE_ID>'
AC-Policy-Brand: 'Bolt'
AC-Policy-Country: 'UK'
AC-Price-Book-Id: 'base'
AC-Scope-Locale: 'en-US'
Content-Type: 'application/json'
X-Api-Key: '<API-KEY>'
```

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
  "phrase": "Zenith Automotive Vehicles and Parts",
  "filter": [],
  "sort": [],
  "pageSize": 100
}
```

#### Response

The response returns the product details for a single SKU, `Bolt Atlas battery`.

```graphql
{
  "errors": [],
  "data": {
    "productSearch": {
      "items": [
        {
          "productView": {
            "sku": "bolt_atlas_battery",
            "name": "Bolt Atlas battery",
            "images": [
              {
                "url": "https://picsum.photos/400/200",
                "label": "Bolt Atlas Battery photo",
                "roles": [
                  "PDP",
                  "PLP"
                ]
              }
            ],
            "links": [
              {
                "sku": "bolt-atlas-2025",
                "type": "related"
              }
            ],
            "attributes": [
              {
                "code": "Brand",
                "type": "STRING",
                "values": [
                  "Bolt"
                ]
              },
              {
                "code": "Country",
                "type": "ARRAY",
                "values": [
                  "UK"
                ]
              }
            ],
            "description": "Vehicle battery sold only in UK",
            "shortDescription": "battery",

             "images": [
            {
                "url": "https://picsum.photos/300/200",
                "label": "bolt atlas battery photo",
                "roles": [
                    "PDP",
                    "PLP"
                ]
            }
        ],
        "links": [
            {
                "sku": "bolt-atlas-2025",
                "type": "related"
            }
        ],
            "routes": [
              {
                "path": "bolt-atlas-battery"
              },
              {
                "path": "vehicles/bolt-atlas/parts",
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
