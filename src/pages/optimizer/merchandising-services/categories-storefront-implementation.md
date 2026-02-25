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

# Implement categories on the storefront

Managing categories with Commerce projects that use the Merchandising Services composable catalog data model requires two types of API operations:

- Create category data using the `categories` operations available in the [Data Ingestion API](https://developer.adobe.com/commerce/services/reference/rest/#tag/Categories), and using the `products` operations to manage product category assignments.

- Retrieve category data for storefront display and navigation using the `navigation` and `categoryTree` queries available in the [Merchandising Services GraphQL API](https://developer.adobe.com/commerce/webapi/graphql/merchandising/).

<InlineAlert variant="warning" slots="text" />

For Commerce sites with an Adobe Commerce as a Cloud Service or Adobe Commerce on Cloud infrastructure backend, use the [Commerce REST API](https://developer.adobe.com/commerce/webapi/rest/) and the [Catalog Service GraphQL API](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/) to manage categories.

## CategoryViewV2 interface

The `CategoryViewV2` interface provides a minimal, streamlined set of category fields—`slug` and `name`—optimized for typical storefront display and navigation scenarios.

### Interface definition

```graphql
interface CategoryViewV2 {
    slug: String!
    name: String!
}
```

For complete field details, see [`CategoryViewV2`](https://developer.adobe.com/commerce/webapi/graphql/merchandising/#definition-CategoryViewInterface) in the Merchandising Services GraphQL API reference.

### Key benefits

- **Lightweight Design**: Contains essential fields (slug and name) for optimal performance
- **Extensible**: Serves as a base interface for specialized category types

## Category types

The `CategoryViewV2` interface is implemented by three specialized types:

1. **[CategoryNavigationView](#categorynavigationview-type)** - For menu rendering and navigation
2. **[CategoryProductView](#categoryproductview-type)** - For category data returned with product queries
3. **[CategoryTreeView](#categorytreeview-type)** - For hierarchical category management and rich category pages

### CategoryNavigationView type

The `CategoryNavigationView` type implements `CategoryViewV2` and provides category data optimized for storefront navigation. It contains:

- **name** and **slug** — Category identity
- **children** — Nested subcategories for building the full menu hierarchy in a single query

Use this type to render top menus, dropdowns, and mobile navigation.

#### Type definition

```graphql
type CategoryNavigationView implements CategoryViewV2 {
    slug: String!
    name: String!
    children: [CategoryNavigationView]
}
```

For complete field details, see [`CategoryNavigationView`](https://developer.adobe.com/commerce/webapi/graphql/merchandising/#definition-CategoryNavigationView) in the Merchandising Services GraphQL API reference.

See the [Navigation query examples](#navigation-query-examples) section below for example queries and responses using this type.

#### Performance safeguards

- **Depth Limitation**: Menu depth is limited to 4 levels maximum
- **Lightweight Attributes**: Excludes heavyweight category attributes redundant for menu rendering
- **Single Query**: Retrieves entire family in one database query
- **Heavy Caching**: Query responses are heavily cached for optimal performance

### CategoryProductView type

The `CategoryProductView` type implements `CategoryViewV2` and provides category data within product query responses. Each product's `categories` field returns a list of `CategoryProductView` objects containing:

- **name** and **slug** — Category identity
- **level** — Position in the hierarchy
- **parents** — Full chain of ancestor categories

Use this type to render breadcrumbs, filter by category, or display category context on product detail pages.

#### Type definition

```graphql
type CategoryProductView implements CategoryViewV2 {
    name: String!
    slug: String!
    level: Int!
    parents: [CategoryProductView!]
}
```

The `parents` field is self-referencing—each parent entry is itself a `CategoryProductView` with its own `name`, `slug`, `level`, and `parents`. This allows you to reconstruct the full breadcrumb path for any category a product belongs to.

For complete field details, see [`CategoryProductView`](https://developer.adobe.com/commerce/webapi/graphql/merchandising/#definition-CategoryProductView) in the Merchandising Services GraphQL API reference.

See the [Products query with categories examples](#products-query-with-categories-examples) section below for example queries and responses using this type.

#### Performance safeguards

The `categories` field is optional on product types. Omit it when category data is not needed to avoid unnecessary overhead.

### CategoryTreeView type

The `CategoryTreeView` type implements `CategoryViewV2` and provides the richest category data. It contains:

- **name** and **slug** — Category identity
- **level** and **parentSlug** / **childrenSlugs** — Hierarchy and relationships
- **description** — Category descriptive content
- **metaTags** — SEO metadata (title, description, keywords)
- **images** — Category images

Use this type for rich category landing pages, SEO-driven content, and CMS administration.

#### Type definition

```graphql
type CategoryTreeView implements CategoryViewV2 {
    slug: String!
    name: String!
    level: Int
    parentSlug: String
    childrenSlugs: [String]
    description: String
    metaTags: CategoryMetaTags
    images: [CategoryImage]
}

type CategoryMetaTags {
    title: String
    description: String
    keywords: [String]
}

type CategoryImage {
    url: String!
    label: String
    roles: [String]
    customRoles: [String]
}
```

For complete field details, including the [`CategoryMetaTags`](https://developer.adobe.com/commerce/webapi/graphql/merchandising/#definition-CategoryMetaTags) and [`CategoryImage`](https://developer.adobe.com/commerce/webapi/graphql/merchandising/#definition-CategoryImage) types, see [`CategoryTreeView`](https://developer.adobe.com/commerce/webapi/graphql/merchandising/#definition-CategoryTreeView) in the Merchandising Services GraphQL API reference.

See the [CategoryTree query examples](#categorytree-query-examples) section below for example queries and responses using this type.

## Navigation query examples

Retrieve category navigation data optimized for storefront menu rendering with built-in performance safeguards.

```graphql
type Query {
    navigation(family: String!): [CategoryNavigationView]
}
```

The `family` parameter is required and specifies which category family to retrieve. The query returns the full hierarchy for that family in a single request, with a maximum depth of 4 levels.

### Retrieve basic top menu navigation

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

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

The response returns a single root node with no nested children:

```text
Men clothing
└── (no children)
```

### Retrieve multi-level menu navigation

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

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

The response returns a three-level nested hierarchy:

```text
Men clothing
└── Men tops
    └── Jackets
```

## Products query with categories examples

Retrieve category data for products, including breadcrumb ancestors, with optional filtering by category family.

```graphql
type ProductView {
    categories(family: String): [CategoryProductView]
}
```

The `categories` field is available on product types such as `ProductView`. Use the optional `family` parameter to return only categories from a specific category family. When omitted, categories from all families are returned.

### Retrieve product categories with breadcrumb ancestors

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query {
    products(skus: ["shorts-red-m"]) {
        name
        sku
        categories(family: "clothing") {
            name
            slug
            level
            parents {
                name
                slug
                level
            }
        }
    }
}
```

**Response:**

```json
{
    "data": {
        "products": [
            {
                "name": "Red Shorts (M)",
                "sku": "shorts-red-m",
                "categories": [
                    {
                        "name": "Shorts",
                        "slug": "men/clothes/shorts",
                        "level": 2,
                        "parents": [
                            {
                                "name": "Men",
                                "slug": "men",
                                "level": 0
                            },
                            {
                                "name": "Clothes",
                                "slug": "men/clothes",
                                "level": 1
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

The `parents` array provides the full ancestor chain, which you can use to render a breadcrumb path:

```plaintext
Men (level 0) → Clothes (level 1) → Shorts (level 2)
                                      └── product: Red Shorts (M)
```

### Filter product categories by family

A product can belong to categories in multiple families. Use the `family` parameter to return only categories from a specific family. In this example, the product belongs to categories in both the "clothing" and "seasonal" families, but the query filters for "seasonal" only.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query {
    products(skus: ["shorts-red-m"]) {
        name
        sku
        categories(family: "seasonal") {
            name
            slug
            level
            parents {
                name
                slug
                level
            }
        }
    }
}
```

**Response:**

```json
{
    "data": {
        "products": [
            {
                "name": "Red Shorts (M)",
                "sku": "shorts-red-m",
                "categories": [
                    {
                        "name": "Summer Essentials",
                        "slug": "summer/essentials",
                        "level": 1,
                        "parents": [
                            {
                                "name": "Summer",
                                "slug": "summer",
                                "level": 0
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

Without the `family` filter, the response would include categories from all families the product belongs to—for example, both "Shorts" from the "clothing" family and "Summer Essentials" from the "seasonal" family. The `family` parameter narrows the result to a single family, which is useful when rendering context-specific navigation or breadcrumbs.

## CategoryTree query examples

Retrieve hierarchical category data in a tree structure with parent-child relationships and level information.

```graphql
type Query {
    categoryTree(family: String!, slugs: [String!], depth: Int): [CategoryTreeView]
}
```

### Retrieve full category tree

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

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

The flat list represents this tree, reconstructed via `parentSlug` and `childrenSlugs`:

```plaintext
Men's Clothing (level 0)
├── Men's Tops (level 1)
│   ├── Shirts (level 2)
│   └── Jackets
└── Men's Bottoms
```

### Retrieve specific category subtree

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

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
                "slug": "men/tops/jackets",
                "name": "Jackets",
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
            },
            {
                "slug": "men/bottoms/pants",
                "name": "Pants",
                "level": 2,
                "parentSlug": "men/bottoms",
                "childrenSlugs": []
            },
            {
                "slug": "men/bottoms/shorts",
                "name": "Shorts",
                "level": 2,
                "parentSlug": "men/bottoms",
                "childrenSlugs": []
            }
        ]
    }
}
```

The response is a flat list. Each node's `parentSlug` and `childrenSlugs` fields let you reconstruct the tree:

```plaintext
Men's Tops (level 1)          Men's Bottoms (level 1)
├── Shirts (level 2)          ├── Pants (level 2)
└── Jackets (level 2)         └── Shorts (level 2)
```

### Retrieve root categories only

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

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

With `depth: 0`, only the top-level roots are returned:

```plaintext
Men's Clothing (level 0)     Women's Clothing (level 0)
  childrenSlugs:               childrenSlugs:
  ├── men/tops                 ├── women/tops
  └── men/bottoms              └── women/bottoms
  (referenced but not fetched) (referenced but not fetched)
```

### Retrieve category details with metadata and images

Use the `description`, `metaTags`, and `images` fields to build rich category landing pages that include SEO metadata and visual content. This is especially useful when rendering a category page that needs a hero image, descriptive copy, and proper `<meta>` tags for search engines.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query CategoryTree {
    categoryTree(slugs: ["men/clothes/shorts"], family: "clothing") {
        slug
        name
        level
        parentSlug
        childrenSlugs
        description
        metaTags {
            title
            description
            keywords
        }
        images {
            url
            label
            roles
            customRoles
        }
    }
}
```

**Response:**

```json
{
    "data": {
        "categoryTree": [
            {
                "slug": "men/clothes/shorts",
                "name": "Shorts",
                "level": 3,
                "parentSlug": "men/clothes",
                "childrenSlugs": [],
                "description": "Browse our full range of men's shorts, from casual to athletic styles.",
                "metaTags": {
                    "title": "Men's Shorts",
                    "description": "Shop men's shorts for every occasion",
                    "keywords": [
                        "shorts",
                        "men"
                    ]
                },
                "images": [
                    {
                        "url": "https://example.com/images/shorts.jpg",
                        "label": "Men's shorts collection",
                        "roles": [
                            "BASE",
                            "THUMBNAIL"
                        ],
                        "customRoles": [
                            "special-role"
                        ]
                    }
                ]
            }
        ]
    }
}
```

## Use case scenarios

### Storefront navigation menu

Use the `navigation` query with `CategoryNavigationView` for:

- Building responsive navigation components
- Creating dropdown menus
- Mobile menu rendering

**Benefits**: Optimized performance with caching, depth limits, and lightweight data.

### Category landing pages and SEO

Use the `categoryTree` query with `CategoryTreeView` to build rich category pages:

- Render category descriptions and hero images on landing pages
- Populate `<meta>` tags (`title`, `description`, `keywords`) for SEO
- Display category images with appropriate roles (for example, `BASE` for hero, `THUMBNAIL` for previews)
- Assign custom image roles for merchant-specific layouts

**Benefits**: Combines hierarchy data with descriptive content, SEO metadata, and images in a single query.

### Product detail pages and breadcrumbs

Use the `categories` field on product queries with `CategoryProductView` for:

- Rendering breadcrumb navigation on product detail pages
- Displaying category badges or tags on product cards
- Filtering or grouping products by category in search results
- Building "Shop by Category" links from a product context

**Benefits**: The `parents` field provides the full ancestor chain in a single query, eliminating the need for separate category lookups when building breadcrumbs.

### Retail CMS category management

Use the `categoryTree` query with `CategoryTreeView` for:

- Category hierarchy management
- Building category administration interfaces
- Implementing category tree editors
- Managing parent-child relationships

**Benefits**: Complete hierarchy metadata, flexible querying, and detailed relationship information.

## Performance considerations

- **Choose the right query for the use case.** Use `navigation` for storefront menus—it is heavily cached, limited to four levels, and returns only lightweight fields. Use `categoryTree` when you need full hierarchy metadata, descriptions, or images.
- **Limit tree depth.** Pass the `depth` parameter to `categoryTree` to avoid fetching deeper levels than you need.
- **Target specific subtrees.** Pass the `slugs` parameter to `categoryTree` to fetch only the branches you need rather than the entire tree.
- **Omit optional fields.** The `categories` field on product queries and the `description`, `metaTags`, and `images` fields on `categoryTree` are optional. Exclude them when they are not needed to reduce payload size.
