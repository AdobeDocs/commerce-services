---
title: variants query
edition: ee
description: "Describes how to construct and use the Catalog Service `variants` query to retrieve details about the variants available for a product."
keywords:
  - GraphQL
  - Services
---

# variants query

The `variants` query returns details about all variations of a product.

The `variants` query is useful for showing variant images on product detail (PDP) or product listing (PLP) pages without submitting multiple API requests.

Query results are paginated with a default, maximum pagination size of 100. The query supports [cursor-based pagination](https://graphql.org/learn/pagination/#pagination-and-edges) as follows:

- The initial query returns a cursor value marking the last item in the current page.
- If all results are returned, the `cursor` value is `null`.
- If more results are available, use the `cursor` value returned in subsequent queries to fetch additional results. For an example, see [Paginate product variant results](#paginate-query-results).

## Syntax

```graphql
variants(sku: String!, optionIds: [String!], pageSize: Int, cursor: String): [ProductViewVariantResults]
```

## Endpoints

- Testing: `https://catalog-service-sandbox.adobe.io/graphql`
- Production: `https://catalog-service.adobe.io/graphql`

## Required headers

You must specify the following HTTP headers to run this query.

import Docs from '/src/_includes/graphql/catalog-service/headers.md'

<Docs />

###  Find the customer group code

import CustomerGroupCode from '/src/_includes/graphql/customer-group-code.md'

<CustomerGroupCode />

## Example usage

The `variants` query requires one or more SKU values as input. Optionally, you can specify `optionIDs` and pagination controls. Specify `optionIDs` to retrieve variants based on product options such as size or color. See [Input fields](#input-fields).

## Return all variants using pagination

The following query returns the SKU, name, and available image information for all variants of the MH07 product. Setting the query pagination to `10` fetches the first ten results.

**Request:**

```graphql
query {
  variants(sku: "MH07", pageSize: 10) {
    variants {
      selections
      product {
        sku
        name
        images(roles: []) {
          url
          label
          roles
        }
      }
    }
    cursor
  }
}
```

**Response:**

```graphql
{
  "data": {
    "variants": {
      "variants": [
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU4",
            "Y29uZmlndXJhYmxlLzE4Ni8xODM="
          ],
          "product": {
            "sku": "MH07-31-Black",
            "name": "Hero Hoodie28-31-Black",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU5",
            "Y29uZmlndXJhYmxlLzE4Ni8xODM="
          ],
          "product": {
            "sku": "MH07-31-Blue",
            "name": "Hero Hoodie28-31-Blue",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xODM=",
            "Y29uZmlndXJhYmxlLzkzLzYx"
          ],
          "product": {
            "sku": "MH07-31-Gray",
            "name": "Hero Hoodie28-31-Gray",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYy",
            "Y29uZmlndXJhYmxlLzE4Ni8xODM="
          ],
          "product": {
            "sku": "MH07-31-Green",
            "name": "Hero Hoodie28-31-Green",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU4",
            "Y29uZmlndXJhYmxlLzE4Ni8xODY="
          ],
          "product": {
            "sku": "MH07-34-Black",
            "name": "Hero Hoodie28-34-Black",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xODY=",
            "Y29uZmlndXJhYmxlLzkzLzU5"
          ],
          "product": {
            "sku": "MH07-34-Blue",
            "name": "Hero Hoodie28-34-Blue",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYx",
            "Y29uZmlndXJhYmxlLzE4Ni8xODY="
          ],
          "product": {
            "sku": "MH07-34-Gray",
            "name": "Hero Hoodie28-34-Gray",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xODY=",
            "Y29uZmlndXJhYmxlLzkzLzYy"
          ],
          "product": {
            "sku": "MH07-34-Green",
            "name": "Hero Hoodie28-34-Green",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU4",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg="
          ],
          "product": {
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-black_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg=",
            "Y29uZmlndXJhYmxlLzkzLzU5"
          ],
          "product": {
            "sku": "MH07-L-Blue",
            "name": "Hero Hoodie28-L-Blue",
            "images": []
          }
        }
      ],
      "cursor": "TUgwNy1MLUJsdWU6Ojo6OjoxMA=="
    }
  }
}
```

#### Return results by `cursor` position

Using the cursor value from the previous response ("TUgwNy1MLUJsdWU6Ojo6OjoxMA==") as input, run the same query to fetch the next set of results. When the last variant item is returned, the cursor value is `null`.

**Request:**

```graphql
query {
  variants(sku: "MH07", pageSize: 10 cursor: "TUgwNy1MLUJsdWU6Ojo6OjoxMA==") {
    variants {
      selections
      product {
        sku
        name
        images(roles: []) {
          url
          label
          roles
        }
      }
    }
    cursor
  }
}
```

**Response:**

```json
{
  "data": {
    "variants": {
      "variants": [
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYx",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg="
          ],
          "product": {
            "sku": "MH07-L-Gray",
            "name": "Hero Hoodie-L-Gray",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_alt1_2.jpg",
                "label": "",
                "roles": []
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_back_2.jpg",
                "label": "",
                "roles": []
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYy",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg="
          ],
          "product": {
            "sku": "MH07-L-Green",
            "name": "Hero Hoodie-L-Green",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-green_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU4",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzc="
          ],
          "product": {
            "sku": "MH07-M-Black",
            "name": "Hero Hoodie-M-Black",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-black_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU5",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzc="
          ],
          "product": {
            "sku": "MH07-M-Blue",
            "name": "Hero Hoodie28-M-Blue",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYx",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzc="
          ],
          "product": {
            "sku": "MH07-M-Gray",
            "name": "Hero Hoodie-M-Gray",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_alt1_2.jpg",
                "label": "",
                "roles": []
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_back_2.jpg",
                "label": "",
                "roles": []
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYy",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzc="
          ],
          "product": {
            "sku": "MH07-M-Green",
            "name": "Hero Hoodie-M-Green",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-green_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU4",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzY="
          ],
          "product": {
            "sku": "MH07-S-Black",
            "name": "Hero Hoodie-S-Black",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-black_main_1.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzU5",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzY="
          ],
          "product": {
            "sku": "MH07-S-Blue",
            "name": "Hero Hoodie28-S-Blue",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYx",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzY=",
            "Y29uZmlndXJhYmxlLzkzLzUwOA=="
          ],
          "product": {
            "sku": "MH07-S-Gray",
            "name": "Hero Hoodie-S-Gray",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_alt1_2.jpg",
                "label": "",
                "roles": []
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_back_2.jpg",
                "label": "",
                "roles": []
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xNzY=",
            "Y29uZmlndXJhYmxlLzkzLzYy"
          ],
          "product": {
            "sku": "MH07-S-Green",
            "name": "Hero Hoodie-S-Green",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-green_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        }
      ],
      "cursor": "TUgwNy1TLUdyZWVuOjo6Ojo6MTA="
    }
  }
}
```

## Return variants by `optionId`

This query returns the SKU, name, and images for all size large variants of product MH07. The `optionIDs` input parameter value is sourced from the [Return details about a complex product](products.md#return-details-about-a-complex-product) example in the products query.

**Request:**

```graphql
query {
  variants(sku: "MH07", optionIds: "Y29uZmlndXJhYmxlLzE4Ni8xNzg=") {
    variants {
      selections
      product {
        sku
        name
        images(roles: []) {
          url
          label
          roles
        }
      }
    }
    cursor
  }
}

```

**Response**

{
  "data": {
    "variants": {
      "variants": [
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg=",
            "Y29uZmlndXJhYmxlLzkzLzU4"
          ],
          "product": {
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-black_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg=",
            "Y29uZmlndXJhYmxlLzkzLzU5"
          ],
          "product": {
            "sku": "MH07-L-Blue",
            "name": "Hero Hoodie28-L-Blue",
            "images": []
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg=",
            "Y29uZmlndXJhYmxlLzkzLzYx"
          ],
          "product": {
            "sku": "MH07-L-Gray",
            "name": "Hero Hoodie-L-Gray",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_alt1_2.jpg",
                "label": "",
                "roles": []
              },
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-gray_back_2.jpg",
                "label": "",
                "roles": []
              }
            ]
          }
        },
        {
          "selections": [
            "Y29uZmlndXJhYmxlLzkzLzYy",
            "Y29uZmlndXJhYmxlLzE4Ni8xNzg="
          ],
          "product": {
            "sku": "MH07-L-Green",
            "name": "Hero Hoodie-L-Green",
            "images": [
              {
                "url": "http://example.com/media/catalog/product/m/h/mh07-green_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              }
            ]
          }
        }
      ],
      "cursor": null
    }
  }
}

## Input fields

You must specify a SKU value for the query.

Field | Data type | Description
--- | --- | ---
`cursor` | String | Manages pagination of variant results. Include the `cursor` value returned in the results from a previous `variants` query to fetch the next set of results. See 
`optionIds` | [String!] | A list of IDs assigned to the product options the shopper has selected, such as specific colors and sizes.
`pageSize` | Int | Specifies the maximum number of results to return. . Default: 100.
`sku` | String! |  The SKU of a complex product.
`variants` | `[ProductViewVariant]` | Specifies the product information to return for each product variant.

### ProductViewVariant

The `ProductViewVariant` type lists the option values that define the product variant.

| Field         | Data Type              | Description                                     |
|---------------|------------------------|-------------------------------------------------|
| `product`     | [`[ProductView]`](products.md#output-fields)  | Provides information about the product corresponding to the variant. The information returned by the `variants` query depends on which `[ProductView]` fields are included as `product` input values.|
| `selections`  | `[String!]`            | List of option values that make up the variant. |

## Output fields

The `variants` query returns a `ProductViewVariantResults` object and a `cursor` value to manage pagination. The results object includes information about variants available for each SKU provided as input. The information returned depends on the `product` input fields included in the query.

### ProductViewVariantResults

`ProductViewVariantResults` returns the list of product variants with the requested information for each variant.

| Field     | Data Type          | Description                                 |
|---------------|------------------------|-------------------------------------------------|
| `cursor`      | `String`               | Returns the cursor for the last item in the current page of results. Use this cursor in the `variants` query to fetch the next set of results. If there are no more results, the cursor value is `null`. |
| `variants`    | [`[ProductViewVariant]!`](#productviewvariant)| List of product variants. |

import Docs2 from '/src/_includes/graphql/catalog-service/product-view.md'