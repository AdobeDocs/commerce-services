---
title: Implement Categories on the Storefront
edition: saas
description: Learn to ingest category data, build storefront menus using navigation and categoryTree queries, and retrieve product category context with the products query.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Implement categories on the storefront

Use the following API operations to manage categories for Commerce projects that use the Merchandising Services composable catalog data model:

- Create category data using the `categories` operations available in the [Data Ingestion REST API](https://developer.adobe.com/commerce/services/reference/rest/#tag/Categories), and using the `products` operations to manage product category assignments.

- Retrieve category navigation and hierarchy data using the [`navigation`](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#query-navigation) and [`categoryTree`](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#query-categoryTree) queries.

- Retrieve category context for products — such as breadcrumbs — using the `categories` field on [product queries](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#query-products).

<InlineAlert variant="warning" slots="text" />

For Commerce sites with an Adobe Commerce as a Cloud Service or an Adobe Commerce on Cloud infrastructure or on-premises backend, manage [categories configuration](https://experienceleague.adobe.com/en/docs/commerce-admin/catalog/categories/categories) from the Commerce Amin, and use the [categories query](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/queries/categories/) available in the [Catalog Service GraphQL API](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/) to manage categories.

## Category types

The `navigation` query, `categoryTree` query, and `categories` field on product queries each return a different category type, optimized for its specific use case. All three types implement the `CategoryViewV2` interface, which defines the two required fields shared by every category: `slug` and `name`. For complete field details, see [`CategoryViewV2`](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#definition-CategoryViewV2) in the Merchandising Services GraphQL API reference.

1. **[CategoryNavigationView](#categorynavigationview-type)** — For menu rendering and navigation
2. **[CategoryProductView](#categoryproductview-type)** — For category data returned with product queries
3. **[CategoryTreeView](#categorytreeview-type)** — For hierarchical category management and rich category pages

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

For complete field details, see [`CategoryNavigationView`](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#definition-CategoryTreeView)
 in the Merchandising Services GraphQL API reference.

See the [Navigation query examples](#navigation-query-examples) section for example queries and responses using this type.

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

For complete field details, see [`CategoryProductView`](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#definition-CategoryProductView) in the Merchandising Services GraphQL API reference.

See the [Products query with categories examples](#products-query-with-categories-examples) section for example queries and responses using this type.

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

For complete field details, including the `CategoryMetaTags` and `CategoryImage` types, see [`CategoryTreeView`](https://developer.adobe.com/commerce/services/graphql-api/merchandising-api/index.html#definition-CategoryTreeView) in the Merchandising Services GraphQL API reference.

See the [CategoryTree query examples](#categorytree-query-examples) section for example queries and responses using this type.

## Limitations and considerations

### Choose the right query for the use case

- Use the `navigation` query for storefront menus. It is heavily cached, limited to four levels, and returns only the lightweight fields needed for rendering.
- Use the `categoryTree` query when you need full hierarchy metadata, descriptions, images, or SEO fields.
- Use the `categories` field on product queries only when category context (such as breadcrumbs) is needed on a product page. Omit it when it is not needed to avoid unnecessary overhead.

### Navigation query depth limit

The `navigation` query returns a maximum of four levels of nested categories. Nesting `children` beyond four levels in your query returns no additional data. Design your category hierarchy and query depth accordingly.

### `categoryTree` discovery-first behavior

When `slugs` is omitted from a `categoryTree` query, the `depth` parameter is ignored and only root-level (level 1) categories are returned. This is by design — the query uses a discovery-first pattern that lets clients find category tree entry points before fetching subtrees. To retrieve descendants, always pass `slugs` along with the desired `depth`.

### Optional fields add overhead

The `description`, `metaTags`, and `images` fields on `categoryTree` are optional. Exclude them when building navigation or hierarchy views that do not need descriptive content or SEO metadata.

### Limit `categoryTree` depth

Pass the `depth` parameter to `categoryTree` to avoid fetching deeper levels than you need.

### Target specific subtrees

Pass the `slugs` parameter to `categoryTree` to fetch only the branches you need rather than the entire tree.

## Navigation query examples

The `navigation` query signature:

```graphql
type Query {
    navigation(family: String!): [CategoryNavigationView]
}
```

The `family` parameter is required and specifies which category family to retrieve. The query returns the full hierarchy for that family in a single request.

### Retrieve basic top menu navigation

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query GetTopMenuNavigation {
    navigation(family: "top-menu") {
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

```graphql
type ProductView {
    categories(family: String): [CategoryProductView]
}
```

The `categories` field is available on product types such as `ProductView`. Use the optional `family` parameter to return only categories from a specific category family. When omitted, categories from all families are returned.

### Retrieve product categories with breadcrumb ancestors

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**GraphQL request:**

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
                        "level": 3,
                        "parents": [
                            {
                                "name": "Men",
                                "slug": "men",
                                "level": 1
                            },
                            {
                                "name": "Clothes",
                                "slug": "men/clothes",
                                "level": 2
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

```text
Men (level 1) → Clothes (level 2) → Shorts (level 3)
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
                        "level": 2,
                        "parents": [
                            {
                                "name": "Summer",
                                "slug": "summer",
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

Without the `family` filter, the response would include categories from all families the product belongs to—for example, both "Shorts" from the "clothing" family and "Summer Essentials" from the "seasonal" family. The `family` parameter narrows the result to a single family, which is useful when rendering context-specific navigation or breadcrumbs.

## CategoryTree query examples

The `categoryTree` query signature:

```graphql
type Query {
    categoryTree(family: String!, slugs: [String!], depth: Int): [CategoryTreeView]
}
```

### Retrieve root-level categories

When called without `slugs`, the query returns only root-level categories. See [`categoryTree` discovery-first behavior](#categorytree-discovery-first-behavior) for details.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query GetRootCategories {
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
                "name": "Men's Category",
                "level": 1,
                "parentSlug": "",
                "childrenSlugs": ["men/clothing"]
            },
            {
                "slug": "women",
                "name": "Women's Category",
                "level": 1,
                "parentSlug": "",
                "childrenSlugs": ["women/clothing"]
            }
        ]
    }
}
```

The flat list represents the root-level categories and their immediate children.

```text
Men's Category (level 1)
└── Men's Clothing (level 2)
Women's Category (level 1)
└── Women's Clothing (level 2)
```

### Retrieve specific category subtree

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query GetSpecificCategorySubtree {
    categoryTree(
        family: "main-catalog"
        slugs: ["men/clothing", "women/clothing"]
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
                "slug": "men/clothing",
                "name": "Men's Clothing",
                "level": 2,
                "parentSlug": "men",
                "childrenSlugs": ["men/clothing/tops", "men/clothing/bottoms"]
            },
            {
                "slug": "men/clothing/tops",
                "name": "Men's Tops",
                "level": 3,
                "parentSlug": "men/clothing",
                "childrenSlugs": []
            },
            {
                "slug": "men/clothing/bottoms",
                "name": "Men's Bottoms",
                "level": 3,
                "parentSlug": "men/clothing",
                "childrenSlugs": []
            },
            {
                "slug": "women/clothing",
                "name": "Women's Clothing",
                "level": 2,
                "parentSlug": "women",
                "childrenSlugs": ["women/clothing/tops", "women/clothing/bottoms"]
            },
            {
                "slug": "women/clothing/tops",
                "name": "Women's Tops",
                "level": 3,
                "parentSlug": "women/clothing",
                "childrenSlugs": []
            },
            {
                "slug": "women/clothing/bottoms",
                "name": "Women's Bottoms",
                "level": 3,
                "parentSlug": "women/clothing",
                "childrenSlugs": []
            }
        ]
    }
}
```

The `depth` parameter counts levels relative to the specified starting slugs, while the `level` field reflects each category's absolute position in the hierarchy based on its slug path.

```text
Men's Clothing (level 2)      Women's Clothing (level 2)
├── Men's Tops (level 3)      ├── Women's Tops (level 3)
└── Men's Bottoms (level 3)   └── Women's Bottoms (level 3)
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

## Query quick reference

| Use case | Query | Type |
|---|---|---|
| Storefront menus, dropdowns, mobile navigation | `navigation` | `CategoryNavigationView` |
| Category landing pages with SEO metadata and images | `categoryTree` | `CategoryTreeView` |
| Breadcrumbs and category context on product pages | `products` (`categories` field) | `CategoryProductView` |
| Category hierarchy management and CMS administration | `categoryTree` | `CategoryTreeView` |
