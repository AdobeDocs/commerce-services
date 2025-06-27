---
title: Create a composable catalog for your storefront
description: Tutorial to create a composable catalog that supports a single base catalog which can deliver catalog projections based on geographic locations and brand.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Create a composable catalog for your storefront

Learn how a company with a single base catalog can use Merchandising Services powered by catalog views and policies to add product data, and retrieve the catalog data for display in a headless storefront.

This end-to-end use case demonstrates how a company with a single base catalog can use Merchandising Services to:

- Support products across two geographical markets and two distinct brands
- Support pricing by customer segment
- Enhance operational efficiency by avoiding duplication of product catalogs across multiple websites
- Control product visibility on websites based on geographical market and brand specifications

Before you begin, review [set up and manage catalogs](manage-catalogs.md) to understand the catalog view and policy concepts.

## Let's get started

This use case demonstrates an end-to-end workflow for using Merchandising Services based on the following components:

- One Catalog View

  One catalog view for `Zenith Automotive` that is linked to a single catalog source, (locale: `en-US`) and two policies.

  - The **Location** policy (*Policy 1*) that defines the catalog projection for `locations`. This projection can be used to specify a target geographic market for selling specified SKUs. For example: `UK`, `USA`.
  - The **Brand** policy (*Policy 2*) defines the catalog projection for `brands`. This projection can be used to specify one or more brands associated with each product SKU, for example `Aurora`, `Bolt`.

- Two products SKUs
  - `Aurora Prism battery` belongs to `Aurora` and is aimed to be sold in `USA`.
  - `Bolt Atlas battery` belongs to `Bolt` and is aimed to be sold in `UK`.
  - The values for brand and location are product attributes of each SKU.
  - The product specification does not include any `View` or `Policy` values. When retrieving products using Merchandising API, View and Policy values are passed in using API headers.

- Merchandising APIs
  - A catalog service API endpoint is used to represent how data will be retrieved using Merchandising Services concepts.
  - Pay close attention to the API headers. The Merchandising Services concepts for filtering products using catalog views and policies are implemented through the API headers.
  - Two Merchandising API calls are represented:
    - API Call one: Returns a SKU for `Aurora` and `USA` combination.
    - API Call two: Returns a SKU for `Bolt` and `UK` combination.

In the steps below, you use Merchandising Services APIs to add the product, catalog view, and policy data to the SaaS data space for your project. Then, you use the the [Merchandising APIs](merchandising-services/using-the-api.md) to retrieve the product data based on brand and location attributes.

## Step 1. Add products to your catalog

Add two simple products, "Aurora Prism battery" and "Bolt Atlas battery" and the product attribute metadata to define the search and display characteristics for the brand and country attributes.

### Add product attribute metadata

Create the metadata to define the search characteristics and filters for displaying product attributes on the storefront by submitting a [Create product attribute metadata](https://developer.adobe.com/commerce/services/reference/rest/#operation/createProductMetadata) POST request.

You must specify the product attribute metadata for each locale you want to support.

For the Zenith Automotive catalog, each product has the following attributes.

- `sku` is unique identifier for a product
- `name`is unique name for a product
- `description` provides detailed product information, typically used in product detail pages
- `shortDescription` provides a concise overview of a product, typically used in product listings
- `brand` is a string attribute that indicates the brand of the product.
- `price`
- `country` is a string attribute that indicates the country where the product is sold.
- `is_vehicle` is a boolean attribute that indicates whether the product is a vehicle or a battery.
- `part_category` is a string attribute that indicates the category of the product.

Create the metadata to define the search characteristics and filters for displaying product attributes on the storefront by submitting a [Create product attribute metadata](https://developer.adobe.com/commerce/services/reference/rest/#operation/createProductMetadata) POST request.

#### Request to add metadata for the `en-US` catalog source

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/v1/catalog/products/metadata \
  --header "Authorization: Bearer {access token}" \
  --data "[
[
    {
        "code": "sku",
        "source": {
            "locale": "en-US"
        },
        "label": "SKU",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH",
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
            "locale": "en-US"
        },
        "label": "Name",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
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
            "locale": "en-US"
        },
        "label": "Description",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
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
            "locale": "en-US"
        },
        "label": "Short description",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": false,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
        ]
    },
    {
        "label": "Price",
        "dataType": "DECIMAL",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": true,
        "searchable": false,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE"
        ]
    },
        {
        "code": "brand",
        "source": {
            "locale": "en-US"
        },
        "label": "Brand",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
        {
        "code": "country",
        "source": {
            "locale": "en-US"
        },
        "label": "Country",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
    {
        "code": "part_category",
        "source": {
            "locale": "en-US"
        },
        "label": "Part Category",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
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
        "code": "is_vehicle",
        "source": {
            "locale": "en-US"
        },
        "label": "Is Vehicle?",
        "dataType": "BOOLEAN",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
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
]"
```

**Response**

```shell
{
    "status": "ACCEPTED",
    "acceptedCount": 8
}
```

**Request to add metadata for the `en-GB` catalog source**

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/v1/catalog/products/metadata \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {access token}" \
  --data "[
    {
        "code": "sku",
        "source": {
            "locale": "en-GB"
        },
        "label": "SKU",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": true,
        "searchable": true,
        "searchWeight": 55,
        "searchTypes": [
            "AUTOCOMPLETE"
        ]
    },
    {
        "code": "name",
        "source": {
            "locale": "en-GB"
        },
        "label": "Name",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": true,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
    {
        "code": "description",
        "source": {
            "locale": "en-GB"
        },
        "label": "Description",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
    {
        "code": "shortDescription",
        "source": {
            "locale": "en-GB"
        },
        "label": "Short description",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
        {
        "code": "brand",
        "source": {
            "locale": "en-GB"
        },
        "label": "Brand",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
        {
        "code": "country",
        "source": {
            "locale": "en-GB"
        },
        "label": "Country",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
        ],
        "filterable": true,
        "sortable": false,
        "searchable": true,
        "searchWeight": 1,
        "searchTypes": [
            "AUTOCOMPLETE",
            "CONTAINS",
            "STARTS_WITH"
        ]
    },
    {
        "code": "part_category",
        "source": {
            "locale": "en-GB"
        },
        "label": "Part Category",
        "dataType": "TEXT",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
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
        "code": "is_vehicle",
        "source": {
            "locale": "en-GB"
        },
        "label": "Is Vehicle?",
        "dataType": "BOOLEAN",
        "visibleIn": [
            "CATALOG",
            "SEARCH"
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
]"

**Response**

```shell
{
    "status": "ACCEPTED",
    "acceptedCount": 8
}
```

### Add products

Add products by submitting a [createProducts](https://developer.adobe.com/commerce/services/reference/rest/#operation/createProducts) POST request using the Data Ingestion API.

#### Create Aurora product

Add the simple product *Aurora Prism Battery* with two attribute codes, `Brand` set to *Aurora*, and `Country` set to *USA* by sending the following payload in the Create products request.

**Create product request**

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/api/v1/catalog/products \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {access token}" \

  --data "[
        {
        "sku": "aurora_prism_battery",
        "source": {
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
]"
```

#### Create Bolt product

Add the product *Bolt Atlas Battery* with two attribute codes, `Brand` set to *Bolt*, and `Country` set to *UK* by sending the following payload in the [createProducts](https://developer.adobe.com/commerce/services/reference/rest/#operation/createProductMetadata) request.

**Create product request**

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/api/v1/catalog/products \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {access token}" \

  --data "[
        {
        "sku": "bolt_atlas_battery",
        "source": {
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
]"
```

## Step 2. Define the catalog views and policies

<InlineAlert variant="info" slots="text"/>

Catalog views and policies must be created from the [Adobe Commerce Optimizer user interface](https://experienceleague.adobe.com/en/docs/commerce/optimizer/catalog/overview).

In this step, create the following policies and catalog view for Zenith Automotive:

- **[Create Policies](https://experienceleague.adobe.com/en/docs/commerce/optimizer/catalog/channels)**:

  - `Location Policy` with "USA" and "UK" as locations.
  - `Brand Policy` with "Aurora" and "Bolt".

- **[Create the Catalog View](https://experienceleague.adobe.com/en/docs/commerce/optimizer/catalog/channels)**:

  - `Zenith Automotive` with a single catalog source, `en-US`, and assign the Location and Brand policies to the catalog view.

## Step 3. Retrieve SKUs

Use the Merchandising GraphQL API [productSearch](https://developer.adobe.com/commerce/services/graphql-api/storefront-api/index.html#query-productSearch) query to retrieve the SKUs you created.

Send GraphQL requests for Merchandising APIs to the following base URL:

`https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/graphql`

### Retrieve SKU for the `Aurora` brand

Retrieve the SKU you created for `Aurora` where location is `USA`. Use the search phrase `Zenith Automotive Vehicles and Parts`, and specify a page size to limit results.

The brand and location (`AC-Policy-Brand` and `AC-Policy-Country`) are passed in using the [Merchandising API headers](merchandising-services/using-the-api.md#headers).

Use the following headers in the request:

```text
AC-View-Id: "b726c1e9-2842-4ab5-9b19-ca65c23bbb3b"
AC-Policy-Brand: "Aurora"
AC-Policy-Country: "US"
AC-Price-Book-Id: "base"
AC-source-Locale: "en-US"
Content-Type: "application/json"
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

Here are the variable values for the request:

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

The brand and location (`AC-Policy-Brand` and `AC-Policy-Country`) are passed in using the [Merchandising API headers](merchandising-services/using-the-api.md#headers).

Use the following headers in the request:

```text
AC-View-Id: "b726c1e9-2842-4ab5-9b19-ca65c23bbb3b"
AC-Policy-Brand: "Bolt"
AC-Policy-Country: "UK"
AC-Price-Book-Id: "base"
AC-Source-Locale: "en-US"
Content-Type: 'application/json'
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

Here are the variables for the request:

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
