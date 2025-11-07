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

# Manage categories with Categories API V2

The Categories API V2 is a modernized solution for category management to support the [Commerce Merchandising Services](../index.md) composable catalog data model. It introduces a new `CategoryViewV2` interface along with two implementing types: `CategoryNavigationView` and `CategoryTreeView`. These types are designed to provide efficient and optimized access to category data for storefront navigation and hierarchical category management, respectively.

## CategoryViewV2 Interface

The `CategoryViewV2` interface provides a minimal, streamlined set of category fields—`slug` and `name`—optimized for typical storefront display and navigation scenarios.

### Interface Definition

```graphql
interface CategoryViewV2 {
    slug: String!
    name: String!
}
```

### Key Benefits

- **Lightweight Design**: Contains only essential fields (slug and name) for optimal performance
- **Fresh Start**: Not bound by backward compatibility with the legacy CategoryView interface available with Commerce Services GraphQL APIs for Live Search and Catalog Service
- **Storefront Optimized**: Designed specifically for storefront APIs without search facet coupling
- **Extensible**: Serves as a base interface for specialized category types

## Implementing Types

The `CategoryViewV2` interface is implemented by two specialized types:

1. **CategoryNavigationView** - For menu rendering and navigation
2. **CategoryTreeView** - For hierarchical category management (primarily RetailCMS)

### Comparison with Legacy CategoryView

The original `CategoryView` type was coupled with search facets and contained many fields that were not needed for basic category display:

**Legacy CategoryView** (deprecated):

- `availableSortBy`, `defaultSortBy` - Search-related fields
- `id`, `parentId` - Internal identifiers
- `path`, `urlKey`, `urlPath` - Multiple URL representations
- `roles` - SEO-specific fields
- `level` - Hierarchy information

**New CategoryViewV2**:

- `slug` - Single URL identifier
- `name` - Display name only

This streamlined approach reduces payload size and improves performance for common storefront use cases.

## CategoryNavigationView Type

The `CategoryNavigationView` type implements `CategoryViewV2` and is specifically designed for building storefront navigation menus with built-in performance optimizations.

### Type Definition

```graphql
type CategoryNavigationView implements CategoryViewV2 {
    slug: String!
    name: String!
    children: [CategoryNavigationView]
}
```

### Performance Safeguards

- **Depth Limitation**: Menu depth is limited to 4 levels maximum
- **Lightweight Attributes**: Excludes heavyweight category attributes redundant for menu rendering
- **Single Query**: Retrieves entire family in one database query
- **Heavy Caching**: Query responses are heavily cached for optimal performance

### Navigation Query

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

## CategoryTreeView Type

The `CategoryTreeView` type implements `CategoryViewV2` and provides comprehensive hierarchical category data, primarily designed for RetailCMS applications.

### Type Definition

```graphql
type CategoryTreeView implements CategoryViewV2 {
    slug: String!
    name: String!
    level: Int
    parentSlug: String
    childrenSlugs: [String]
}
```

### CategoryTree Query

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
