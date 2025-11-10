---
title: Implement Categories on the Storefront
edition: saas
description: Use the GraphQL category queries to build storefront menus and fetch hierarchical category data with parent-child and level details.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Implement Categories on the Storefront

Managing categories with Commerce projects that use Merchandising Services for Adobe Commerce Optimizer requires managing two types of operations:

- Create category data using the `categories` operations available in the [Data Ingestion API](https://developer.adobe.com/commerce/services/reference/rest/#tag/Categories), and using the `products` operations to manage product category assignments.

- Retrieve category data for storefront display and navigation using the `navigation` and `categoryTree` queries available in the [Merchandising Services GraphQL API](https://developer.adobe.com/commerce/webapi/graphql/merchandising/).

<InlineAlert variant="warning" slots="text" />

For Commerce sites with an Adobe Commerce as a Cloud Service or Adobe Commerce on Cloud infrastructure backend, use the [Commerce REST API](https://developer.adobe.com/commerce/webapi/rest/) and the [Catalog Service GraphQL API](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/) to manage categories.

## CategoryView2 interface

The `CategoryView2` interface provides a minimal, streamlined set of category fields—`slug` and `name`—optimized for typical storefront display and navigation scenarios.

### Interface definition

```graphql
interface CategoryViewV2 {
    slug: String!
    name: String!
}
```

### Fields

Field | Data type | Description
--- | --- | ---
`slug` | String! | The unique URL-friendly identifier for the category, used in routing and navigation
`name` | String! | The display name of the category as shown to customers

### Key benefits

- **Lightweight Design**: Contains essential fields (slug and name) for optimal performance
- **Extensible**: Serves as a base interface for specialized category types

## Category types

The `CategoryViewV2` interface is implemented by two specialized types:

1. **CategoryNavigationView** - For menu rendering and navigation
2. **CategoryTreeView** - For hierarchical category management (primarily RetailCMS)

### CategoryNavigationView

The `CategoryNavigationView` type implements `CategoryViewV2` and is specifically designed for building storefront navigation menus with built-in performance optimizations.

#### Type definition

```graphql
type CategoryNavigationView implements CategoryViewV2 {
    slug: String!
    name: String!
    children: [CategoryNavigationView]
}
```

#### Performance safeguards

- **Depth Limitation**: Menu depth is limited to 4 levels maximum
- **Lightweight Attributes**: Excludes heavyweight category attributes redundant for menu rendering
- **Single Query**: Retrieves entire family in one database query
- **Heavy Caching**: Query responses are heavily cached for optimal performance

### CategoryTreeView type

The `CategoryTreeView` type implements `CategoryViewV2` and provides comprehensive hierarchical category data, primarily designed for RetailCMS applications.

#### Type definition

```graphql
type CategoryTreeView implements CategoryViewV2 {
    slug: String!
    name: String!
    level: Int
    parentSlug: String
    childrenSlugs: [String]
}
```

## Navigation query

Retrieve category navigation data optimized for storefront menu rendering with built-in performance safeguards.

```graphql
type Query {
    navigation(family: String!): [CategoryNavigationView]
}
```

### Example: Retrieve basic top menu navigation

**Query:**

```graphql
query GetTopMenuNavigation {
    navigation(family: "Top-menu") {
        slug
        name
        children {
            slug
            name
            children {
                slug
                name
            }
        }
    }
}
```

**Response:**

```json
{
    "data": {
        "navigation": [
            {
                "slug": "men",
                "name": "Men clothing",
                "children": []
            }
        ]
    }
}
```

### Example: Retrieve multi-Level menu navigation

**Query:**

```graphql
query GetFullMenuNavigation {
    navigation(family: "menu") {
        slug
        name
        children {
            slug
            name
            children {
                slug
                name
                children {
                    slug
                    name
                }
            }
        }
    }
}
```

**Response:**

```json
{
    "data": {
        "navigation": [
            {
                "slug": "men",
                "name": "Men clothing",
                "children": [
                    {
                        "slug": "men/tops",
                        "name": "Men tops",
                        "children": [
                            {
                                "slug": "men/tops/jackets",
                                "name": "Jackets",
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

## CategoryTree query

Retrieve hierarchical category data in a tree structure with parent-child relationships and level information.

```graphql
type Query {
    categoryTree(family: String, slugs: [String], depth: Int): [CategoryTreeView]
}
```

### Example: Retrieve full category tree

**Query:**

```graphql
query GetFullCategoryTree {
    categoryTree(family: "main-catalog") {
        slug
        name
        level
        parentSlug
        childrenSlugs
    }
}
```

**Response:**

```json
{
    "data": {
        "categoryTree": [
            {
                "slug": "men",
                "name": "Men's Clothing",
                "level": 0,
                "parentSlug": null,
                "childrenSlugs": ["men/tops", "men/bottoms"]
            },
            {
                "slug": "men/tops",
                "name": "Men's Tops",
                "level": 1,
                "parentSlug": "men",
                "childrenSlugs": ["men/tops/shirts", "men/tops/jackets"]
            },
            {
                "slug": "men/tops/shirts",
                "name": "Shirts",
                "level": 2,
                "parentSlug": "men/tops",
                "childrenSlugs": []
            }
        ]
    }
}
```

### Example: Retrieve specific category subtree

**Query:**

```graphql
query GetSpecificCategorySubtree {
    categoryTree(
        family: "main-catalog"
        slugs: ["men/tops", "men/bottoms"]
        depth: 2
    ) {
        slug
        name
        level
        parentSlug
        childrenSlugs
    }
}
```

**Response:**

```json
{
    "data": {
        "categoryTree": [
            {
                "slug": "men/tops",
                "name": "Men's Tops",
                "level": 1,
                "parentSlug": "men",
                "childrenSlugs": ["men/tops/shirts", "men/tops/jackets"]
            },
            {
                "slug": "men/tops/shirts",
                "name": "Shirts",
                "level": 2,
                "parentSlug": "men/tops",
                "childrenSlugs": []
            },
            {
                "slug": "men/bottoms",
                "name": "Men's Bottoms",
                "level": 1,
                "parentSlug": "men",
                "childrenSlugs": ["men/bottoms/pants", "men/bottoms/shorts"]
            }
        ]
    }
}
```

### Example: Retrieve root categories only

**Query:**

```graphql
query GetRootCategories {
    categoryTree(family: "main-catalog", depth: 0) {
        slug
        name
        level
        parentSlug
        childrenSlugs
    }
}
```

**Response:**

```json
{
    "data": {
        "categoryTree": [
            {
                "slug": "men",
                "name": "Men's Clothing",
                "level": 0,
                "parentSlug": null,
                "childrenSlugs": ["men/tops", "men/bottoms"]
            },
            {
                "slug": "women",
                "name": "Women's Clothing",
                "level": 0,
                "parentSlug": null,
                "childrenSlugs": ["women/tops", "women/bottoms"]
            }
        ]
    }
}
```

## Use Case Scenarios

### Storefront Navigation Menu

Use `navigation` query with `CategoryNavigationView` for:

- Building responsive navigation components
- Creating dropdown menus
- Implementing breadcrumb navigation
- Mobile menu rendering

**Benefits**: Optimized performance with caching, depth limits, and lightweight data.

### RetailCMS Category Management

Use `categoryTree` query with `CategoryTreeView` for:

- Category hierarchy management
- Building category administration interfaces
- Implementing category tree editors
- Managing parent-child relationships

**Benefits**: Complete hierarchy metadata, flexible querying, and detailed relationship information.

### Performance Considerations

1. **Navigation Query**:
   - Heavily cached responses.
   - Single database query per family.
   - Limited to four levels for performance.
   - Excludes heavyweight attributes.

2. **CategoryTree Query**:
   - Use `depth` parameter to limit tree traversal.
   - Use `slugs` parameter for targeted queries.
   - Ideal for administrative interfaces.
   - Provides complete hierarchy metadata.
