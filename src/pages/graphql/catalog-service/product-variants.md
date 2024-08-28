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

## Return variants by `optionId`

This query returns the SKU, name, and images for all size large variants of product MH07. The `optionIDs` input parameter value is sourced from the [Return details about a complex product](products.md#return-details-about-a-complex-product) example in the products query.

**Request:**

```graphql
query {
  variants(sku: "MH07", optionIds: "Y29uZmlndXJhYmxlLzE4Ni8xNzg=") {
    variants {
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

```graphql
{
  "data": {
    "variants": {
      "variants": [
        {
          "product": {
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black",
            "images": [
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-black_main_2.jpg",
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
          "product": {
            "sku": "MH07-L-Blue",
            "name": "Hero Hoodie28-L-Blue",
            "images": []
          }
        },
        {
          "product": {
            "sku": "MH07-L-Gray",
            "name": "Hero Hoodie-L-Gray",
            "images": [
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-gray_main_2.jpg",
                "label": "",
                "roles": [
                  "image",
                  "small_image",
                  "thumbnail"
                ]
              },
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-gray_alt1_2.jpg",
                "label": "",
                "roles": []
              },
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-gray_back_2.jpg",
                "label": "",
                "roles": []
              }
            ]
          }
        },
        {
          "product": {
            "sku": "MH07-L-Green",
            "name": "Hero Hoodie-L-Green",
            "images": [
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-green_main_2.jpg",
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
```

### Paginate query results

The following query returns the SKU, name, and available images for all variants of the MH07 product. Setting the query pagination to `3` fetches the first three results.

**Request:**

```graphql
query {
  variants(sku: "MH07", pageSize: 3) {
    variants {
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
          "product": {
            "sku": "MH07-34-Gray",
            "name": "Hero Hoodie28-34-Gray",
            "images": []
          }
        },
        {
          "product": {
            "sku": "MH07-34-Green",
            "name": "Hero Hoodie28-34-Green",
            "images": []
          }
        },
        {
          "product": {
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black",
            "images": [
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-black_main_2.jpg",
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
      "cursor": "TUgwNy1MLUJsYWNrOjo6Ojo6Mw=="
    }
  }
}
```

Using the cursor value from the previous response, run the same query to fetch the next set of results. When no more results are available, the cursor value is `null`.

**Request:**

```graphql
query {
  variants(sku: "MH07" pageSize: 3 cursor: "TUgwNy1MLUJsYWNrOjo6Ojo6Mw==") {
    variants {
      product {
        sku
        name
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
          "product": {
            "sku": "MH07-34-Gray",
            "name": "Hero Hoodie28-34-Gray",
            "images": []
          }
        },
        {
          "product": {
            "sku": "MH07-34-Green",
            "name": "Hero Hoodie28-34-Green",
            "images": []
          }
        },
        {
          "product": {
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black",
            "images": [
              {
                "url": "http://master-7rqtwti-ima6q5tyxltfe.eu-4.magentosite.cloud/media/catalog/product/m/h/mh07-black_main_2.jpg",
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
      "cursor": "TUgwNy1MLUJsYWNrOjo6Ojo6Mw=="
    }
  }
}
```

## Input fields

You must specify a SKU value for the query.

Field | Data type | Description
--- | --- | ---
`cursor` | String | Manages pagination of variant results. Include the `cursor` value returned in the results from a previous `variants` query to fetch the next set of results.
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
