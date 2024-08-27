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

The `variants` query is useful for showing variant images on product detail (PDP) or product listing (PLP) pages without submitting multiple API requests. It's also useful for building SEO snippets that include the full list of offers (variants) for a product.

## Pagination

Query results are paginated with a default (and maximum) pagination size of 100. Products are returned in ascending order by SKU value.

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

The `variants` query requires one or more SKU values. Optionally, you can specify `optionIDs` to retrieve product options that the shopper has selected, and parameters to control pagination. See [Input fields](#input-fields).

### Return all variants for a product

The following query returns details about all product variants for the specified SKU. This request returns the product sku and product name for each variant.

This query uses the default pagination size (100).
**Request:**

```graphql
query {
  variants(sku: "MH07") {
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
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-L-Gray",
            "name": "Hero Hoodie-L-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-L-Green",
            "name": "Hero Hoodie-L-Green"
          }
        },
        {
          "product": {
            "sku": "MH07-M-Black",
            "name": "Hero Hoodie-M-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-M-Gray",
            "name": "Hero Hoodie-M-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-M-Green",
            "name": "Hero Hoodie-M-Green"
          }
        },
        {
          "product": {
            "sku": "MH07-S-Black",
            "name": "Hero Hoodie-S-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-S-Gray",
            "name": "Hero Hoodie-S-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-S-Green",
            "name": "Hero Hoodie-S-Green"
          }
        },
        {
          "product": {
            "sku": "MH07-XL-Black",
            "name": "Hero Hoodie-XL-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-XL-Gray",
            "name": "Hero Hoodie-XL-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-XL-Green",
            "name": "Hero Hoodie-XL-Green"
          }
        },
        {
          "product": {
            "sku": "MH07-XS-Black",
            "name": "Hero Hoodie-XS-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-XS-Gray",
            "name": "Hero Hoodie-XS-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-XS-Green",
            "name": "Hero Hoodie-XS-Green"
          }
        }
      ],
      "cursor": null
    }
  }
}
```

### Paginate product variant results

The following query returns the first three variants available for product sku `MH07`.

**Request:**

```graphql
query {
  variants(sku: "MH07" pageSize: 3) {
    variants {
      product {
        sku
        name
      }
    }
    cursor
  }
}

**Response:**

```json
{
  "data": {
    "variants": {
      "variants": [
        {
          "product": {
            "sku": "MH07-L-Black",
            "name": "Hero Hoodie-L-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-L-Gray",
            "name": "Hero Hoodie-L-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-L-Green",
            "name": "Hero Hoodie-L-Green"
          }
        }
      ],
      "cursor": "TUgwNy1MLUdyZWVuOjo6Ojo6Mw=="
    }
  }
}
```

Return the next set of results by running the same query using the `cursor` value returned in the previous query results. When there are no more results to return, the `cursor` returns the `null` value.

**Request**

```graphql

query {
  variants(sku: "MH07" pageSize: 3 cursor: "TUgwNy1MLUdyZWVuOjo6Ojo6Mw==") {
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
            "sku": "MH07-M-Black",
            "name": "Hero Hoodie-M-Black"
          }
        },
        {
          "product": {
            "sku": "MH07-M-Gray",
            "name": "Hero Hoodie-M-Gray"
          }
        },
        {
          "product": {
            "sku": "MH07-M-Green",
            "name": "Hero Hoodie-M-Green"
          }
        }
      ],
      "cursor": "TUgwNy1NLUdyZWVuOjo6Ojo6Mw=="
    }
  }
}
```

## Input fields

You must specify a SKU value for the query.

Field | Data type | Description
--- | --- | ---
`optionIds` | [String!]! | A list of IDs assigned to the product options the shopper has selected, such as specific colors and sizes.
`sku` | String! |  The SKU of a complex product.
`pageSize` | Int | Specifies the maximum number of results to return at once. Default: 100.
`cursor` | String | Represents the cursor from the last item,  is the hash of the query params

## Output fields

### ProductViewVariant

The `ProductViewVariant` type lists the option values that define the product variant.

| **Field**     | **Data Type**          | **Description**                                 |
|---------------|------------------------|-------------------------------------------------|
| `selections`  | `[String!]`            | List of option values that make up the variant. |
| `product`     | [`[ProductView]`](products.md#output-fields)  | Provides information about the product corresponding to the variant.  The query returns product `sku` and `name` data by default. |

### ProductViewVariantResults

`ProductViewVariantResults` returns the list of product variants based on the selection values.

| **Field**     | **Data Type**          | **Description**                                 |
|---------------|------------------------|-------------------------------------------------|
| `variants`    | [`[ProductViewVariant]!`](#productviewvariant)| List of product variants.   |
| `cursor`      | `String`               | Cursor value to manage results pagination. Use this value as an input parameter to retrieve the next set of results. If there are no additional results available, the return value is `null`. |
