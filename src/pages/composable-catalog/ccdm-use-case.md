---
title: Use the [!DNL Composable Catalog Data Model] to provides a more efficient way to store data in the SaaS Catalog Service. 
edition: ee
description: Learn how to implement the [!DNL Composable Catalog Data Model] in your storefront by following an end-to-end example.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Learn how to implement the [!DNL Composable Catalog Data Model] in your storefront by following an end-to-end example.

This use-case demonstrates how a company with a single base catalog can use CCDM to:

- Support products across two geographical markets and two different brands.
- Attain operational efficiency by not duplicating their product catalog across different websites.
- Limit product visibility on the websites based on the geographical market and the brand of the product.

Before you begin, see [set up and manage catalogs](manage-catalogs.md) to make sure you are familiar with the concepts of channels and policies.

## Let's get started

To demonstrate an end-to-end workflow using CCDM, this use-case has the following conditions:

- One Channel
  - The channel is linked to a single scope (locale: `en`).
  - The channel is linked to two policies.

- Two Policies
  - Policy one - Location: Defines the catalog projection for `locations`. This projection can be used to specify a target geographic market for selling specified SKUs. For example: `UK`, `USA`.
  - Policy two - Brand: Defines the catalog projection for `brands`. This projection can be used to specify one or more brands associated with each product SKU, for example `Brand A`, `Brand B`.

- SKUs
  - The example uses two SKUs:
    - Motor part one belongs to `Brand A` and is aimed to be sold in `USA`.
    - Motor part two belongs to `Brand B` and is aimed to be sold in `UK`.
  - The values of brands and locations are product attributes of each SKU.
  - The SKUs do not have any knowledge of a Channel or Policy.

- Storefront APIs
  - A catalog service API endpoint is used to represent how data will be retrieved using CCDM concepts.
  - Pay close attention to the API headers. The CCDM concepts are implemented at the API headers.
  - Two API calls are represented
    - API Call one: Returns a SKU for `Brand A` and `USA` combination.
    - API Call two: Returns a SKU for `Brand B` and `UK` combination.

In the code samples below, you define the products, channels, and policies, then make API calls using the [Storefront API](./admin/using-the-api.md).

### SKU one data ingestion: Motor part 1 (Brand A, USA)

The following code sample provides the details of a product called "Motor Part 1".

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
    "description": "SEO opt",
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
      "code": "country",
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
      "path": "pants/motor-part",
      "position": 1
    }
  ]
}
```

### SKU two data ingestion: Motor part 2 (Brand B, UK)

The following code sample provides the details of a product called "Motor Part 2".

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
    "description": "SEO opt",
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
      "path": "pants/motor-part",
      "position": 1
    }
  ]
}
```

### Channel: Definition

Create a channel for `Company A` by using the `createChannel` GraphQL mutation from the Catalog Management API.  This code sample creates the channel with  policy specific details.

```json
{
  "data": {
    "createChannel": {
      "name": "Company A",
      "policyIds": [
        "policyId-1",
        "policyId-2"
      ],
      "scopes": [
        {
          "locale": "en"
        }
      ]
    }
  }
}
```

### Policy one: Location definition

This code sample creates a new policy specific to location.

```json
{
  "data": {
    "createPolicy": {
      "name": "Location Policy",
      "policyId": "policyId-1",
      "mandatory": true,
      "actions": [
        {
          "triggers": [
            {
              "name": "AC-Policy-Country",
              "transportType": "HTTP_HEADER"
            }
          ],
          "filters": [
            {
              "attribute": "country",
              "valueSource": "TRIGGER",
              "value": "AC-Policy-Country",
              "actionFilterOperator": "EQUALS",
              "enabled": true
            }
          ]
        }
      ],
      "createdAt": "2024-11-19T18:37:16.762186664",
      "updatedAt": "2024-11-19T18:37:16.762186664"
    }
  }
}
```

### Policy two: Brand definition

This code sample creates an additional policy specific to the brand.

```json
{
  "data": {
    "createPolicy": {
      "name": "Brand Policy",
      "policyId": "policyId-2",
      "mandatory": true,
      "actions": [
        {
          "triggers": [
            {
              "name": "AC-Policy-Brand",
              "transportType": "HTTP_HEADER"
            }
          ],
          "filters": [
            {
              "attribute": "brand",
              "valueSource": "TRIGGER",
              "value": "AC-Policy-Brand",
              "actionFilterOperator": "EQUALS",
              "enabled": true
            }
          ]
        }
      ],
      "createdAt": "2024-11-19T18:37:46.955184559",
      "updatedAt": "2024-11-19T18:37:46.955184559"
    }
  }
}
```

### Storefront API call – 1: Retrieve SKU for Brand A and location USA

In this API call, you retrieve the SKU for `Brand A` where location is `USA`.

The following lists the sample headers:

- `Content-Type`: `application/json`
- `AC-Environment-Id`: `123`
- `Magento-Store-Code`: `main_website_store`
- `AC-Locale`: `default`
- `AC-Price-Book-Id`: `base`
- **`AC-Channel-Id`: `channelId-1`**
- `AC-Policy-State`: `AC-Policy-Country`
- `X-Api-Key`: `search_gql`
- **`AC-Policy-Country`: `USA`**
- **`AC-Policy-Brand`: `Brand A`**

>[!INFO]
>
>In the above headers, `AC-Channel-Id`, `AC-Policy-Country`, and `AC-Policy-Brand` are concepts unique to CCDM.

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

Here are the variables specified in the request:

```json
{
  "phrase": "Motor parts",
  "filter": [],
  "sort": [],
  "pageSize": 100
}
```

#### Response: A single SKU: Motor Part 1

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

### Storefront API call – 2: Retrieve SKU for Brand B and location UK

In this API call, you retrieve the SKU for `Brand B` where location is `UK`.

The following lists the sample headers:

- `Content-Type`: `application/json`
- `AC-Environment-Id`: `123`
- `Magento-Store-Code`: `main_website_store`
- `AC-Locale`: `default`
- `AC-Price-Book-Id`: `base`
- **`AC-Channel-Id`: `channelId-1`**
- `AC-Policy-State`: `AC-Policy-Brand`
- `X-Api-Key`: `search_gql`
- **`AC-Policy-Brand`: `Brand B`**
- **`AC-Policy-Country`: `UK`**

>[!INFO]
>
>In the above headers, `AC-Channel-Id`, `AC-Policy-Country`, and `AC-Policy-Brand` are concepts unique to CCDM.

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

#### Response: A single SKU: Motor Part 2

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
