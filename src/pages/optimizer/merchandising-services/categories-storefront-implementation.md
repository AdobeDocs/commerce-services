---
title: Implement Categories on the Storefront
description: Learn to ingest categories, build storefront menus (navigation, categoryTree), search with searchCategory, and get category context from the products query.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

<Edition slots="text" backgroundColor="green"/>
[SaaS only](https://experienceleague.adobe.com/en/docs/commerce/user-guides/product-solutions)

# Implement categories on the storefront

Use the following API operations to manage categories for Commerce projects that use the Merchandising Services composable catalog data model:

- Create category data using the `categories` operations available in the [Data Ingestion REST API](../../reference/rest/index.md#tag/Categories), and using the `products` operations to manage product category assignments.

- Retrieve category navigation and hierarchy data using the [`navigation`](../../reference/graphql/index.md#navigation) and [`categoryTree`](../../reference/graphql/index.md#categorytree) queries. Both queries take a `family` argument where applicable; on `categoryTree`, `family` is optional—pass it to scope results when your catalog uses multiple category families.

- Search categories by name with optional family filtering and pagination using the [`searchCategory`](../../reference/graphql/index.md#searchcategory) query.

- Retrieve category context for products — such as breadcrumbs — using the `categories` field on [product queries](../../reference/graphql/index.md#products).

<InlineAlert variant="warning" slots="text" />

For Commerce sites with an Adobe Commerce as a Cloud Service or an Adobe Commerce on Cloud infrastructure or on-premises backend, manage [categories configuration](https://experienceleague.adobe.com/en/docs/commerce-admin/catalog/categories/categories) from the Commerce Admin, and use the [categories query](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/queries/categories/) available in the [Catalog Service GraphQL API](https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/) to manage categories.

## Category types

The `navigation` query, `categoryTree` query, `searchCategory` query, and `categories` field on product queries each return data shaped for a specific use case. Navigation, tree, and search results use types that implement the `CategoryViewV2` interface, which defines the two required fields shared by every category: `slug` and `name`. For complete field details, see [`CategoryViewV2`](../../reference/graphql/index.md#categoryviewv2) in the Merchandising Services GraphQL API reference.

1. **[CategoryNavigationView](#categorynavigationview-type)** — For menu rendering and navigation
1. **[CategoryProductView](#categoryproductview-type)** — For category data returned with product queries
1. **[CategoryTreeView](#categorytreeview-type)** — For hierarchical category management, rich category pages, and each matching category from the [`searchCategory`](#searchcategory-query-examples) query

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

For complete field details, see [`CategoryNavigationView`](../../reference/graphql/index.md#categorynavigationview)
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

For complete field details, see [`CategoryProductView`](../../reference/graphql/index.md#categoryproductview) in the Merchandising Services GraphQL API reference.

See the [Products query with categories examples](#products-query-with-categories-examples) section for example queries and responses using this type.

### CategoryTreeView type

The `CategoryTreeView` type implements `CategoryViewV2` and provides the richest category data. The [`categoryTree`](../../reference/graphql/index.md#categorytree) query returns this type directly. The [`searchCategory`](../../reference/graphql/index.md#searchcategory) query returns the same type inside [`SearchCategoryResultPage.items`](../../reference/graphql/index.md#searchcategoryresultpage), so search hits can use the same fields as tree results.

It contains:

- **name** and **slug** — Category identity
- **level** and **parentSlug** / **childrenSlugs** — Hierarchy and relationships
- **description** — Category descriptive content
- **metaTags** — SEO metadata (title, description, keywords)
- **images** — Category images

Use this type for rich category landing pages, SEO-driven content, CMS administration, and displaying full category details for [`searchCategory`](#searchcategory-query-examples) matches (for example, typeahead previews or picker dialogs).

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

For complete field details, including the `CategoryMetaTags` and `CategoryImage` types, see [`CategoryTreeView`](../../reference/graphql/index.md#categorytreeview) in the Merchandising Services GraphQL API reference.

See the [CategoryTree query examples](#categorytree-query-examples) and [searchCategory query examples](#searchcategory-query-examples) sections for example queries and responses using this type.

## Limitations and considerations

### Choose the right query for the use case

- Use the `navigation` query for storefront menus. It is heavily cached, limited to four levels, and returns only the lightweight fields needed for rendering.
- Use the `categoryTree` query when you need full hierarchy metadata, descriptions, images, or SEO fields.
- Use the `searchCategory` query when the shopper or CMS workflow needs to find categories by name (for example, search-as-you-type or admin pickers), with optional `family` scoping and pagination. Results are sorted alphabetically by `name` (case-insensitive); see [searchCategory result ordering](#searchcategory-result-ordering).
- Use the `categories` field on product queries only when category context (such as breadcrumbs) is needed on a product page. Omit it when it is not needed to avoid unnecessary overhead.

### Navigation query depth limit

The `navigation` query returns a maximum of four levels of nested categories. Nesting `children` beyond four levels in your query returns no additional data. Design your category hierarchy and query depth accordingly.

### `categoryTree` depth and discovery behavior

The `depth` argument behaves differently depending on whether you pass starting `slugs`:

- **Without starting `slugs`:** `depth` sets the **maximum category level** included in the result for the requested scope (for example, your `family` filter). Use this to discover entry points and shallow slices of the tree without naming a subtree root first.
- **With starting `slugs`:** `depth` is measured **from each starting slug**, counting that slug as **level 1** of the window. Deeper descendants extend until the depth limit is reached.

Pass `slugs` when you need a specific branch rather than a level-capped slice from the top of the tree. The `family` argument is optional on `categoryTree`; supply it when you must limit results to one category family.

### Optional fields add overhead

The `description`, `metaTags`, and `images` fields on `categoryTree` are optional. Exclude them when building navigation or hierarchy views that do not need descriptive content or SEO metadata.

### Limit `categoryTree` depth

Pass the `depth` parameter to `categoryTree` to avoid fetching deeper levels than you need. Remember that its meaning depends on whether `slugs` are present; see [`categoryTree` depth and discovery behavior](#categorytree-depth-and-discovery-behavior).

### Target specific subtrees

Pass the `slugs` parameter to `categoryTree` to fetch only the branches you need rather than the entire tree.

### searchCategory result ordering

`searchCategory` returns matching categories sorted alphabetically (A–Z, case-insensitive) by `name`. There is no sort argument; this is the default behavior.

Categories with shorter names usually sort before longer names that share the same prefix. For example, `Food` appears before `Food - Baby Food`. In typeahead and category pickers that show only the first page of results, parent categories are more likely to appear before longer, nested paths.

## Navigation query examples

The `navigation` query signature:

```graphql
type Query {
    navigation(family: String!): [CategoryNavigationView]
}
```

The `family` parameter is required and specifies which category family to retrieve. The query returns the full hierarchy for that family in a single request.

### Retrieve basic top menu navigation

When you only need identity fields for the root of a category family—for example, a simple top bar or a single entry point before loading deeper levels—you can query `navigation` with `slug` and `name` only. The following example requests the `sports` family and returns that root node without selecting `children`, so the response stays small and easy to cache.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query TopLevelNavigation {
  navigation(family: "sports") {
    slug
    name
  }
}
```

**Response:**

```json
{
  "data": {
    "navigation": [
      {
        "slug": "sports",
        "name": "Category of sports"
      }
    ]
  },
}
```

The response returns a single root node with no children.

```text
Sports
```

### Retrieve multi-level menu navigation

Storefront menus that expand into submenus or mega panels need nested `children` on each `CategoryNavigationView`. The following example nests `children` selection sets through three levels (within the `navigation` query's four-level cap). The response illustrates how indoor and outdoor branches attach under the same root so you can render a full hierarchy in one round trip.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query GetFullMenuNavigation {
    navigation(family: "sports") {
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
        "slug": "sports",
        "name": "Category of sports",
        "children": [
          {
            "slug": "sports/indoors",
            "name": "Sports to be played indoors",
            "children": [
              {
                "slug": "sports/indoors/pilates",
                "name": "Pilates sport",
                "children": []
              }
            ]
          },
          {
            "slug": "sports/outdoors",
            "name": "Sports to be played outdoors",
            "children": [
              {
                "slug": "sports/outdoors/golf",
                "name": "Go sport",
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
Sports
└── Indoors
    └── Pilates
└── Outdoors
    └── Golf
```

## Products query with categories examples

```graphql
type ProductView {
    categories(family: String): [CategoryProductView]
}
```

The `categories` field is available on product types such as `ProductView`. Use the optional `family` parameter to return only categories from a specific category family. When omitted, categories from all families are returned.

### Retrieve product categories with breadcrumb ancestors

Product detail pages often need the category path from the root down to the product. The following example queries `products` by SKU and requests `categories` for the `clothing` family with `name`, `slug`, `level`, and each category's `parents`, so you can order ancestors by `level` and render a breadcrumb trail.

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

A single product can appear in categories from more than one family; returning every family at once is not always what the page needs. The following example uses the same SKU as the breadcrumb sample but passes `family: "seasonal"` on `categories`, so only seasonal taxonomy nodes come back. That pattern fits seasonal campaigns, alternate merchandising trees, or any UI that should show one family's context at a time.

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
    categoryTree(family: String, slugs: [String!], depth: Int): [CategoryTreeView]
}
```

The `family` argument is optional. Include it when you need to restrict the tree to one category family.

### Retrieve root-level categories

When you call `categoryTree` without `slugs`, `depth` (when set) limits how deep the result goes by **category level** across the scoped tree; see [`categoryTree` depth and discovery behavior](#categorytree-depth-and-discovery-behavior). The following example scopes by `family` only, omits `depth`, and asks for `slug`, `name`, `level`, `parentSlug`, and `childrenSlugs`. Use this shape to discover top-level categories and their immediate child references before requesting heavier subtrees.

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

When you already know which branches matter—such as men's and women's clothing—pass those starting `slugs` so you do not pull the entire catalog. With `slugs` present, `depth` counts **from each starting slug** (that slug is level 1 of the window). The following example requests two clothing subtrees under `main-catalog` with `depth: 2` and returns nodes with hierarchy fields so you can wire category pages or admin trees for just those paths.

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

With starting `slugs`, the `depth` argument counts levels from each starting slug (the slug itself is level 1). The `level` field on each `CategoryTreeView` still reflects that category's absolute position in the full hierarchy for its slug path.

```text
Men's Clothing (level 2)      Women's Clothing (level 2)
├── Men's Tops (level 3)      ├── Women's Tops (level 3)
└── Men's Bottoms (level 3)   └── Women's Bottoms (level 3)
```

### Retrieve category details with metadata and images

Category landing pages usually need more than slugs and labels: copy for the body, `<meta>` fields for search, and imagery for heroes or thumbnails. The following example targets one slug under `clothing` and selects `description`, `metaTags` (title, description, keywords), and `images` with `url`, `label`, and role fields—enough to render a full SEO-aware category template from a single `categoryTree` call.

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

## searchCategory query examples

The `searchCategory` query matches category **names** against a `searchTerm` and returns a paginated [`SearchCategoryResultPage`](../../reference/graphql/index.md#searchcategoryresultpage).

- If the `family` argument is omitted, it returns categories across all families.
- The `searchTerm` argument is case-insensitive and must be a minimum of three characters.
- Matching categories in `items` are sorted alphabetically (A–Z, case-insensitive) by `name`. See [searchCategory result ordering](#searchcategory-result-ordering).

Each `items` entry is a [`CategoryTreeView`](../../reference/graphql/index.md#categorytreeview), so you can reuse the same fields as in `categoryTree` responses (for example, `slug`, `name`, `description`, and `images`).

```graphql
type Query {
    searchCategory(
        searchTerm: String!
        family: String
        pageSize: Int
        currentPage: Int
    ): SearchCategoryResultPage
}

type SearchCategoryResultPage {
    items: [CategoryTreeView!]!
    totalCount: Int!
    pageInfo: PageInfo!
}

type PageInfo {
    currentPage: Int!
    pageSize: Int!
    totalPages: Int!
}
```

`pageSize` defaults to **20** and `currentPage` defaults to **1** (1-based). Use `family` to limit matches to one category family when needed.

### Search categories by name

Shoppers and internal tools often find categories by typing a fragment of the display name rather than browsing the tree. The following example calls `searchCategory` with `searchTerm: "food"` and no `family`, then requests `slug`, `name`, `description`, and `childrenSlugs` on each match plus `totalCount`. Results are returned in alphabetical order by `name`, so the top-level `Food` category appears before longer names such as `Food - Baby Food`.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query {
  searchCategory(searchTerm: "food") {
    items {
      slug
      name
      description
      childrenSlugs
    }
    totalCount
  }
}
```

**Response:**

```json
{
  "data": {
    "searchCategory": {
      "items": [
        {
          "slug": "food",
          "name": "Food",
          "description": "Food and beverages",
          "childrenSlugs": [
            "food/baby-food",
            "food/beverages"
          ]
        },
        {
          "slug": "food/baby-food",
          "name": "Food - Baby Food",
          "description": "Baby and child nutrition",
          "childrenSlugs": [
            "food/baby-food/infant-milk"
          ]
        },
        {
          "slug": "food/baby-food/infant-milk",
          "name": "Food - baby food - infant milk - Growth",
          "description": "Growth milk for children",
          "childrenSlugs": []
        },
        {
          "slug": "food/beverages",
          "name": "food - Beverages - Water",
          "description": "Water and beverages",
          "childrenSlugs": []
        }
      ],
      "totalCount": 4
    }
  }
}
```

### Search within a family and paginate

Large catalogs can return many name matches; narrowing by `family` and paging keeps typeaheads and pickers responsive. The following example searches for `"tops"` inside `main-catalog`, sets `pageSize` and `currentPage`, and returns `parentSlug` and `childrenSlugs` on each hit plus `pageInfo` showing how many pages exist when `totalCount` exceeds the page size.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request:**

```graphql
query SearchCategoriesInFamily {
    searchCategory(
        searchTerm: "tops"
        family: "main-catalog"
        pageSize: 10
        currentPage: 1
    ) {
        totalCount
        items {
            slug
            name
            parentSlug
            childrenSlugs
        }
        pageInfo {
            currentPage
            pageSize
            totalPages
        }
    }
}
```

**Response:**

```json
{
    "data": {
        "searchCategory": {
            "totalCount": 15,
            "items": [
                {
                    "slug": "men/clothing/tops",
                    "name": "Men's Tops",
                    "parentSlug": "men/clothing",
                    "childrenSlugs": []
                }
            ],
            "pageInfo": {
                "currentPage": 1,
                "pageSize": 10,
                "totalPages": 2
            }
        }
    }
}
```

For additional information, see [`searchCategory`](../../reference/graphql/index.md#searchcategory) and [`PageInfo`](../../reference/graphql/index.md#pageinfo) in the Merchandising Services GraphQL API reference.

## Query quick reference

| Use case | Query | Type |
|---|---|---|
| Storefront menus, dropdowns, mobile navigation | `navigation` | `CategoryNavigationView` |
| Category hierarchy management, landing pages with SEO metadata and images | `categoryTree` | `CategoryTreeView` |
| Breadcrumbs and category context on product pages | `products` (`categories` field) | `CategoryProductView` |
| Search or browse categories by name (typeahead, admin pickers) | `searchCategory` | `CategoryTreeView` (in `SearchCategoryResultPage.items`) |
