---
title: Use cases for the Merchandising API
edition: saas
description: Learn about the limitations and considerations when using the Merchandising API to retrieve catalog data from Adobe Commerce Optimizer.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Use cases for the Merchandising API

The Merchandising API supports various e-commerce scenarios. The catalog data delivered by the API is filtered based on the request headers and the catalog view, catalog source, policy, and price book configuration in Adobe Commerce Optimizer. This allows you to create tailored storefront experiences for different customer segments, channels, and regions.

### E-commerce Storefronts

- **Product Catalogs**: Display product listings with filtering and sorting
- **Search Functionality**: Implement product search with autocomplete
- **Product Details**: Show comprehensive product information and variants

### Multi-channel Commerce

- **B2B Portals**: Customize catalogs for business customers
- **Marketplace Integration**: Power third-party marketplace listings
- **Mobile Apps**: Provide consistent data across mobile platforms
- **Headless Commerce**: Support decoupled frontend architectures

### Personalization

- **Customer Segmentation**: Deliver targeted product recommendations
- **Regional Pricing**: Display locale-specific pricing and availability
- **Dynamic Content**: Adapt product displays based on user behavior
- **A/B Testing**: Support experimentation with different product presentations

## Available Queries

The Merchandising API provides several GraphQL queries designed for different use cases.

| Query | Description | Use Case |
|-------|-------------|----------|
| `products` | Retrieve detailed information about specific products by SKU | Product detail pages, product comparison |
| `productSearch` | Search products with filters, sorting, and pagination | Search results, category pages, product listings |
| `refineProduct` | Get variant-specific information for configurable products | Product option selection, variant switching |
| `variants` | Retrieve all variants of a configurable product | Product detail pages, variant galleries |
| `recommendations` | Retrieve personalized product recommendations | Related products, cross-sells, and upsells |

### Query Examples

#### Product Search

```graphql
query ProductSearch($search: String!, $pageSize: Int = 20) {
  productSearch(search: $search, pageSize: $pageSize) {
    items {
      id
      sku
      name
      price {
        regularPrice {
          amount {
            value
            currency
          }
        }
      }
      images {
        url
        label
        roles
      }
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
    }
  }
}
```

#### Product Details

```graphql
query ProductDetails($skus: [String!]!) {
  products(skus: $skus) {
    id
    sku
    name
    description
    price {
      regularPrice {
        amount {
          value
          currency
        }
      }
    }
    attributes {
      code
      value
    }
    images {
      url
      label
      roles
    }
  }
}
```

For detailed examples of each query, see the <a href="https://developer-stage.adobe.com/commerce/services/optimizer/reference/graphql/merchandising-api/)" target="_blank" rel="noopener noreferrer">Merchandising API Reference</a>.
