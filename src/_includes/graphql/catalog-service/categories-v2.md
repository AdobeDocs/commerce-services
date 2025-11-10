---
title: Implement categories on the storefront
edition: saas
description: Use the `navigation` and `categoryTree` queries to render storefront menus and retrieve hierarchical category data in a tree structure with parent-child relationships and level information.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Implement Categories on the Storefront

Categories API V2 is the category management solution for Commerce projects using Merchandising Services for Adobe Commerce Optimizer. Categories are created and managed using the `categories` operations available in the [Data Ingestion API](https://developer.adobe.com/commerce/services/reference/rest/#tag/Categories) for Merchandising Services.

<InlineAlert variant="warning" slots="text" />

If you are using Adobe Commerce as a Cloud Service or Adobe Commerce on Cloud infrastructure, manage categories using the [Commerce Services Catalog Service](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/). For details, see the [Categories](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/queries/categories/) query in the *GraphQL Developer Guide*.

## CategoryViewV2 Interface

The `CategoryViewV2` interface provides a minimal, streamlined set of category fields—`slug` and `name`—optimized for typical storefront display and navigation scenarios.

### Interface Definition

```graphql
interface CategoryViewV2 {
    slug: String!
    name: String!
}
```

### Fields

Field | Data Type | Description
--- | --- | ---
`slug` | String! | The unique URL-friendly identifier for the category, used in routing and navigation
`name` | String! | The display name of the category as shown to customers

### Key Benefits

- **Lightweight Design**: Contains essential fields (slug and name) for optimal performance
- **Extensible**: Serves as a base interface for specialized category types

## Category types

The `CategoryViewV2` interface is implemented by two specialized types:

1. **CategoryNavigationView** - For menu rendering and navigation
2. **CategoryTreeView** - For hierarchical category management (primarily RetailCMS)

### CategoryNavigationView

The `CategoryNavigationView` type implements `CategoryViewV2` and is specifically designed for building storefront navigation menus with built-in performance optimizations.

#### Type Definition

```graphql
type CategoryNavigationView implements CategoryViewV2 {
    slug: String!
    name: String!
    children: [CategoryNavigationView]
}
```

#### Performance Safeguards

- **Depth Limitation**: Menu depth is limited to 4 levels maximum
- **Lightweight Attributes**: Excludes heavyweight category attributes redundant for menu rendering
- **Single Query**: Retrieves entire family in one database query
- **Heavy Caching**: Query responses are heavily cached for optimal performance

### CategoryTreeView Type

The `CategoryTreeView` type implements `CategoryViewV2` and provides comprehensive hierarchical category data, primarily designed for RetailCMS applications.

#### Type Definition

```graphql
type CategoryTreeView implements CategoryViewV2 {
    slug: String!
    name: String!
    level: Int
    parentSlug: String
    childrenSlugs: [String]
}
```

## Navigation Query

Retrieve category navigation data optimized for storefront menu rendering with built-in performance safeguards.

```graphql
type Query {
    navigation(family: String!): [CategoryNavigationView]
}
```

### Practical Examples

#### Example 1: Basic Top Menu Navigation

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

#### Example 2: Multi-Level Menu Navigation

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

## CategoryTree Query

Retrieve hierarchical category data in a tree structure with parent-child relationships and level information.

```graphql
type Query {
    categoryTree(family: String, slugs: [String], depth: Int): [CategoryTreeView]
}
```

### Practical Examples

#### Example 3: Full Category Tree Retrieval

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

#### Example 4: Specific Category Subtree

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

#### Example 5: Root Categories Only

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
   - Heavily cached responses
   - Single database query per family
   - Limited to 4 levels for performance
   - Excludes heavyweight attributes

2. **CategoryTree Query**:
   - Use `depth` parameter to limit tree traversal
   - Use `slugs` parameter for targeted queries
   - Ideal for administrative interfaces
   - Provides complete hierarchy metadata
