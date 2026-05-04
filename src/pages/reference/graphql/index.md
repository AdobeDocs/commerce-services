---
title: Merchandising API Reference
edition: saas
description: Get information about the merchandising APIs to retrieve product and catalog data to create storefront experiences.
keywords:
  - GraphQL
  - Search
  - Recommendations
  - Services
  - Storefront
  - Merchandising
---

# Merchandising GraphQL API

The Merchandising GraphQL API enables developers to build rich, dynamic storefront experiences by providing efficient access to catalog data from Adobe Commerce Optimizer. This API is designed for frontend applications that need to retrieve product information, pricing, search results, and recommendations in real-time. For more information about the API, see the [developer documentation](../../optimizer/merchandising-services/index.md).

## API endpoint

```text
https://na1-sandbox.api.commerce.adobe.com/{TENANT_ID}/graphql
```

## Headers

```text
# Required. View ID for catalog context.
AC-View-Id: cde0ab4c-1f7b-4e12-91f6-9c7840ab6523
# Required. Content type header.
Content-Type: application/json
# Price book identifier for pricing context.
AC-Price-Book-ID: us
# Trigger name and value that sets data access filters to restrict product access based on request attributes.
AC-Policy-{*}: AC-Policy-Brand
```

## Required headers

All API requests must include the following headers:

- `AC-View-Id`: View ID for catalog context
- `Content-Type`: application/json

These headers ensure proper context for your API requests. See the server configuration above for example values.

## Queries

### attributeMetadata

Return a list of product attribute codes that can be used for sorting or filtering in a `productSearch` query.

**Response:** [`AttributeMetadataResponse!`](#attributemetadataresponse)

#### Example

##### Query

```graphql
query attributeMetadata {
  attributeMetadata {
    filterableInSearch {
      ...FilterableInSearchAttributeFragment
    }
    sortable {
      ...SortableAttributeFragment
    }
  }
}
```

##### Response

```json
{
  "data": {
    "attributeMetadata": {
      "filterableInSearch": [FilterableInSearchAttribute],
      "sortable": [SortableAttribute]
    }
  }
}
```

### categoryTree

Retrieves category tree nodes, optionally filtered by family, slugs and limited by depth.

**Response:** [`[CategoryTreeView]`](#categorytreeview)

**Arguments:**

| Name | Description |
| --- | --- |
| `family` - [`String`](#string) | The product family to retrieve the category tree for. Ex: clothing, electronics, books |
| `slugs` - [`[String!]`](#string) | The slugs of the categories to retrieve the category tree for. Ex: men/clothing/shorts |
| `depth` - [`Int`](#int) | The depth of the category tree to retrieve. When used without an initial slug, it will specify the maximum level allowed for a category. When used with a starting slug, it specifies depth from that slug, counting the slug itself as level 1. |

#### Example

##### Query

```graphql
query categoryTree(
  $family: String,
  $slugs: [String!],
  $depth: Int
) {
  categoryTree(
    family: $family,
    slugs: $slugs,
    depth: $depth
  ) {
    slug
    name
    description
    metaTags {
      ...CategoryMetaTagsFragment
    }
    images {
      ...CategoryImageFragment
    }
    level
    parentSlug
    childrenSlugs
  }
}
```

##### Variables

```json
{
  "family": "xyz789",
  "slugs": ["xyz789"],
  "depth": 123
}
```

##### Response

```json
{
  "data": {
    "categoryTree": [
      {
        "slug": "abc123",
        "name": "xyz789",
        "description": "xyz789",
        "metaTags": CategoryMetaTags,
        "images": [CategoryImage],
        "level": 987,
        "parentSlug": "xyz789",
        "childrenSlugs": ["xyz789"]
      }
    ]
  }
}
```

### navigation

Retrieves the navigation tree for a given product family.

**Response:** [`[CategoryNavigationView]`](#categorynavigationview)

**Arguments:**

| Name | Description |
| --- | --- |
| `family` - [`String!`](#string) | The product family to retrieve the navigation tree for. For example, clothing, electronics or books |

#### Example

##### Query

```graphql
query navigation($family: String!) {
  navigation(family: $family) {
    slug
    name
    children {
      ...CategoryNavigationViewFragment
    }
  }
}
```

##### Variables

```json
{"family": "abc123"}
```

##### Response

```json
{
  "data": {
    "navigation": [
      {
        "slug": "xyz789",
        "name": "xyz789",
        "children": [CategoryNavigationView]
      }
    ]
  }
}
```

### productSearch

Runs a search or browse request against an Adobe Commerce Optimizer catalog view based on a query phrase, filters, and sort options. It applies Product Discovery configuration (merchandising rules, intelligent ranking, and facets) and returns matching products, facet buckets with counts, and pagination metadata for use by headless storefronts (AEM, Edge Delivery Services, custom SPAs).

**Response:** [`ProductSearchResponse!`](#productsearchresponse)

**Arguments:**

| Name | Description |
| --- | --- |
| `context` - [`QueryContextInput`](#querycontextinput) | The query context |
| `current_page` - [`Int`](#int) | Specifies which page of results to return. The default value is 1. Default = `1` |
| `filter` - [`[SearchClauseInput!]`](#searchclauseinput) | Identifies product attributes and conditions to filter on |
| `page_size` - [`Int`](#int) | The maximum number of results to return at once. Default = `20` |
| `phrase` - [`String!`](#string) | Phrase to search for in product catalog |
| `sort` - [`[ProductSearchSortInput!]`](#productsearchsortinput) | Attributes and direction to sort on |

#### Example

##### Query

```graphql
query productSearch(
  $context: QueryContextInput,
  $current_page: Int,
  $filter: [SearchClauseInput!],
  $page_size: Int,
  $phrase: String!,
  $sort: [ProductSearchSortInput!]
) {
  productSearch(
    context: $context,
    current_page: $current_page,
    filter: $filter,
    page_size: $page_size,
    phrase: $phrase,
    sort: $sort
  ) {
    facets {
      ...AggregationFragment
    }
    items {
      ...ProductSearchItemFragment
    }
    page_info {
      ...SearchResultPageInfoFragment
    }
    related_terms
    suggestions
    total_count
    warnings {
      ...ProductSearchWarningFragment
    }
  }
}
```

##### Variables

```json
{
  "context": QueryContextInput,
  "current_page": 1,
  "filter": [SearchClauseInput],
  "page_size": 20,
  "phrase": "abc123",
  "sort": [ProductSearchSortInput]
}
```

##### Response

```json
{
  "data": {
    "productSearch": {
      "facets": [Aggregation],
      "items": [ProductSearchItem],
      "page_info": SearchResultPageInfo,
      "related_terms": ["abc123"],
      "suggestions": ["xyz789"],
      "total_count": 987,
      "warnings": [ProductSearchWarning]
    }
  }
}
```

### products

Search for products that match the specified SKU values. In Adobe Commerce as a Cloud Service, this query replaces the `products` query defined in the Commerce Foundation.

**Response:** [`[ProductView]`](#productview)

**Arguments:**

| Name | Description |
| --- | --- |
| `skus` - [`[String]`](#string) | List of SKUs to search for. For example, `123`, `456` or `789`. |

#### Example

##### Query

```graphql
query products($skus: [String]) {
  products(skus: $skus) {
    addToCartAllowed
    inStock
    lowStock
    attributes {
      ...ProductViewAttributeFragment
    }
    description
    id
    images {
      ...ProductViewImageFragment
    }
    videos {
      ...ProductViewVideoFragment
    }
    lastModifiedAt
    metaDescription
    metaKeyword
    metaTitle
    name
    shortDescription
    inputOptions {
      ...ProductViewInputOptionFragment
    }
    sku
    externalId
    url
    urlKey
    links {
      ...ProductViewLinkFragment
    }
    categories {
      ...CategoryProductViewFragment
    }
    queryType
    visibility
  }
}
```

##### Variables

```json
{"skus": ["abc123"]}
```

##### Response

```json
{
  "data": {
    "products": [
      {
        "addToCartAllowed": true,
        "inStock": false,
        "lowStock": false,
        "attributes": [ProductViewAttribute],
        "description": "xyz789",
        "id": "4",
        "images": [ProductViewImage],
        "videos": [ProductViewVideo],
        "lastModifiedAt": "2007-12-03T10:15:30Z",
        "metaDescription": "xyz789",
        "metaKeyword": "abc123",
        "metaTitle": "xyz789",
        "name": "abc123",
        "shortDescription": "abc123",
        "inputOptions": [ProductViewInputOption],
        "sku": "abc123",
        "externalId": "abc123",
        "url": "abc123",
        "urlKey": "xyz789",
        "links": [ProductViewLink],
        "categories": [CategoryProductView],
        "queryType": "xyz789",
        "visibility": "abc123"
      }
    ]
  }
}
```

### recommendationsByUnitIds

Retrieve recommendation units by their unique ID to use on the storefront.

**Response:** [`Recommendations`](#recommendations)

**Arguments:**

| Name | Description |
| --- | --- |
| `unitIds` - [`[String!]!`](#string) | List unit IDs of preconfigured units |
| `currentSku` - [`String`](#string) | SKU of the product currently being viewed on PDP |
| `userPurchaseHistory` - [`[PurchaseHistory]`](#purchasehistory) | User purchase history with timestamp |
| `userViewHistory` - [`[ViewHistory]`](#viewhistory) | User view history with timestamp |
| `cartSkus` - [`[String]`](#string) | SKUs of products in the cart |

#### Example

##### Query

```graphql
query recommendationsByUnitIds(
  $unitIds: [String!]!,
  $currentSku: String,
  $userPurchaseHistory: [PurchaseHistory],
  $userViewHistory: [ViewHistory],
  $cartSkus: [String]
) {
  recommendationsByUnitIds(
    unitIds: $unitIds,
    currentSku: $currentSku,
    userPurchaseHistory: $userPurchaseHistory,
    userViewHistory: $userViewHistory,
    cartSkus: $cartSkus
  ) {
    results {
      ...RecommendationUnitFragment
    }
    totalResults
  }
}
```

##### Variables

```json
{
  "unitIds": ["abc123"],
  "currentSku": "abc123",
  "userPurchaseHistory": [PurchaseHistory],
  "userViewHistory": [ViewHistory],
  "cartSkus": ["abc123"]
}
```

##### Response

```json
{
  "data": {
    "recommendationsByUnitIds": {
      "results": [RecommendationUnit],
      "totalResults": 123
    }
  }
}
```

### refineProduct

Retrieves refined product search results by applying additional filters, sorting, or facets to an existing product result set, enabling incremental narrowing of product lists without running a completely new product query.

**Response:** [`ProductView`](#productview)

**Arguments:**

| Name | Description |
| --- | --- |
| `optionIds` - [`[String!]!`](#string) | List of option IDs to refine the product by. For example, `123`, `456` or `789`. |
| `sku` - [`String!`](#string) | SKU of the product to refine. For example, `RF903`, `DG90-54` or `789-001`. |

#### Example

##### Query

```graphql
query refineProduct(
  $optionIds: [String!]!,
  $sku: String!
) {
  refineProduct(
    optionIds: $optionIds,
    sku: $sku
  ) {
    addToCartAllowed
    inStock
    lowStock
    attributes {
      ...ProductViewAttributeFragment
    }
    description
    id
    images {
      ...ProductViewImageFragment
    }
    videos {
      ...ProductViewVideoFragment
    }
    lastModifiedAt
    metaDescription
    metaKeyword
    metaTitle
    name
    shortDescription
    inputOptions {
      ...ProductViewInputOptionFragment
    }
    sku
    externalId
    url
    urlKey
    links {
      ...ProductViewLinkFragment
    }
    categories {
      ...CategoryProductViewFragment
    }
    queryType
    visibility
  }
}
```

##### Variables

```json
{
  "optionIds": ["abc123"],
  "sku": "xyz789"
}
```

##### Response

```json
{
  "data": {
    "refineProduct": {
      "addToCartAllowed": false,
      "inStock": true,
      "lowStock": true,
      "attributes": [ProductViewAttribute],
      "description": "abc123",
      "id": "4",
      "images": [ProductViewImage],
      "videos": [ProductViewVideo],
      "lastModifiedAt": "2007-12-03T10:15:30Z",
      "metaDescription": "xyz789",
      "metaKeyword": "xyz789",
      "metaTitle": "abc123",
      "name": "abc123",
      "shortDescription": "abc123",
      "inputOptions": [ProductViewInputOption],
      "sku": "abc123",
      "externalId": "xyz789",
      "url": "abc123",
      "urlKey": "abc123",
      "links": [ProductViewLink],
      "categories": [CategoryProductView],
      "queryType": "abc123",
      "visibility": "abc123"
    }
  }
}
```

### searchCategory

Search for categories by name with optional filtering and pagination.

**Response:** [`SearchCategoryResultPage`](#searchcategoryresultpage)

**Arguments:**

| Name | Description |
| --- | --- |
| `searchTerm` - [`String!`](#string) | The search term to match against category names. |
| `family` - [`String`](#string) | Optional product family filter to limit search results. For example, clothing, electronics or books. |
| `pageSize` - [`Int`](#int) | The number of results to return per page (default: 20). Default = `20` |
| `currentPage` - [`Int`](#int) | The page number to retrieve (1-based indexing, default: 1). Default = `1` |

#### Example

##### Query

```graphql
query searchCategory(
  $searchTerm: String!,
  $family: String,
  $pageSize: Int,
  $currentPage: Int
) {
  searchCategory(
    searchTerm: $searchTerm,
    family: $family,
    pageSize: $pageSize,
    currentPage: $currentPage
  ) {
    items {
      ...CategoryTreeViewFragment
    }
    totalCount
    pageInfo {
      ...PageInfoFragment
    }
  }
}
```

##### Variables

```json
{
  "searchTerm": "xyz789",
  "family": "abc123",
  "pageSize": 20,
  "currentPage": 1
}
```

##### Response

```json
{
  "data": {
    "searchCategory": {
      "items": [CategoryTreeView],
      "totalCount": 987,
      "pageInfo": PageInfo
    }
  }
}
```

### variants

**Response:** [`ProductViewVariantResults`](#productviewvariantresults)

**Arguments:**

| Name | Description |
| --- | --- |
| `sku` - [`String!`](#string) | SKU of the product to get variants for. For example, `UR123`, `MZ456` or `KS789`. |
| `optionIds` - [`[String!]`](#string) | List of option IDs to get variants for. For example, `123`, `456` or `789`. |
| `pageSize` - [`Int`](#int) | Page size for pagination. For example, `10` for a page size of 10 or `20` for a page size of 20. |
| `cursor` - [`String`](#string) | Pagination cursor. For example, `123` for the first variant, `456` for the second variant. |

#### Example

##### Query

```graphql
query variants(
  $sku: String!,
  $optionIds: [String!],
  $pageSize: Int,
  $cursor: String
) {
  variants(
    sku: $sku,
    optionIds: $optionIds,
    pageSize: $pageSize,
    cursor: $cursor
  ) {
    variants {
      ...ProductViewVariantFragment
    }
    cursor
  }
}
```

##### Variables

```json
{
  "sku": "abc123",
  "optionIds": ["abc123"],
  "pageSize": 987,
  "cursor": "xyz789"
}
```

##### Response

```json
{
  "data": {
    "variants": {
      "variants": [ProductViewVariant],
      "cursor": "abc123"
    }
  }
}
```

## Types

## Aggregation

A bucket that contains information for each filterable option.

| Field Name | Description |
| --- | --- |
| `attribute` - [`String!`](#string) | The attribute code of the filter item |
| `buckets` - [`[Bucket]!`](#bucket) | A container that divides the data into manageable groups. For example, attributes that can have numeric values might have buckets that define price ranges |
| `title` - [`String!`](#string) | The filter name displayed in layered navigation |
| `type` - [`AggregationType`](#aggregationtype) | Identifies the data type of the aggregation |

## AggregationType

Identifies the data type of the aggregation.

**Values:** `INTELLIGENT`, `PINNED`, `POPULAR`

## AppliedQueryRule

The rule that was applied to this product.

| Field Name | Description |
| --- | --- |
| `action_type` - [`AppliedQueryRuleActionType`](#appliedqueryruleactiontype) | An enum that defines the type of rule that was applied |
| `rule_id` - [`String`](#string) | The ID assigned to the rule |
| `rule_name` - [`String`](#string) | The name of the applied rule |

## AppliedQueryRuleActionType

The type of rule that was applied to a product during search (optional).

**Values:** `BOOST`, `BURY`, `PIN`

## AttributeMetadataResponse

Contains the output of the `attributeMetadata` query.

| Field Name | Description |
| --- | --- |
| `filterableInSearch` - [`[FilterableInSearchAttribute!]`](#filterableinsearchattribute) | An array of product attributes that can be used for filtering in a `productSearch` query |
| `sortable` - [`[SortableAttribute!]`](#sortableattribute) | An array of product attributes that can be used for sorting in a `productSearch` query |

## Boolean

The `Boolean` scalar type represents `true` or `false`.

## Bucket

An interface for bucket contents.

| Field Name | Description |
| --- | --- |
| `title` - [`String!`](#string) | A human-readable name of a bucket |

**Possible types:** [`CategoryBucket`](#categorybucket), [`CategoryView`](#categoryview), [`RangeBucket`](#rangebucket), [`ScalarBucket`](#scalarbucket), [`StatsBucket`](#statsbucket)

## CategoryBucket

New category bucket for federation.

| Field Name | Description |
| --- | --- |
| `count` - [`Int!`](#int) | |
| `id` - [`ID!`](#id) | |
| `path` - [`String!`](#string) | |
| `title` - [`String!`](#string) | |

## CategoryBucketInterface

| Field Name | Description |
| --- | --- |
| `id` - [`ID!`](#id) | |

**Possible types:** [`CategoryBucket`](#categorybucket)

## CategoryImage

Represents an image associated with a category.

| Field Name | Description |
| --- | --- |
| `url` - [`String!`](#string) | The URL where the image is hosted. |
| `label` - [`String`](#string) | A descriptive label or alt text for the image. |
| `roles` - [`[String]`](#string) | Standard predefined roles for the image. |
| `customRoles` - [`[String]`](#string) | Custom roles specific to the implementation. |

## CategoryMetaTags

SEO metadata tags for the category.

| Field Name | Description |
| --- | --- |
| `title` - [`String`](#string) | The page title for SEO purposes. |
| `description` - [`String`](#string) | The meta description for SEO purposes. |
| `keywords` - [`[String]`](#string) | Keywords associated with the category for SEO. |

## CategoryNavigationView

Represents a category optimized for navigation menus, with nested children for building navigation trees.

| Field Name | Description |
| --- | --- |
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `name` - [`String!`](#string) | Category name. For example, `Electronics`, `Clothing` or `Books`. |
| `children` - [`[CategoryNavigationView]`](#categorynavigationview) | The direct child categories for building nested navigation menus. |

## CategoryProductView

Represents category information associated with a product, including hierarchical parent relationships.

| Field Name | Description |
| --- | --- |
| `name` - [`String!`](#string) | Category name. For example, `Electronics`, `Clothing` or `Books`. |
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `level` - [`Int!`](#int) | The level of the category. The root category is a level 1 category. For example, men -> level 1, men/clothing -> level 2, men/clothing/shorts -> level 3 |
| `parents` - [`[CategoryProductView!]`](#categoryproductview) | The ancestor categories in the hierarchy, ordered from root to immediate parent. |

## CategoryTreeView

Represents a category within a hierarchical tree structure, including parent and children relationships.

| Field Name | Description |
| --- | --- |
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `name` - [`String!`](#string) | Category name. For example, `Electronics`, `Clothing` or `Books`. |
| `description` - [`String`](#string) | A detailed description of the category. |
| `metaTags` - [`CategoryMetaTags`](#categorymetatags) | SEO metadata tags for the category. |
| `images` - [`[CategoryImage]`](#categoryimage) | Visual images associated with the category. |
| `level` - [`Int`](#int) | The root category is a level 1 category. For example, men -> level 1, men/clothing -> level 2, men/clothing/shorts -> level 3 |
| `parentSlug` - [`String`](#string) | The slug of the parent category, if any. |
| `childrenSlugs` - [`[String]`](#string) | The slugs of all direct child categories. Ex: men/clothing/shorts -> \[men/clothing/shorts/athletic, men/clothing/shorts/swimwear\] |

## CategoryView

Represents a category. Contains information about a category, including the category ID, the category name, the category path, the category URL key, the category URL path, and the category roles.

| Field Name | Description |
| --- | --- |
| `availableSortBy` - [`[String]`](#string) | List of available sort by options. For example, `name`, `position` or `size`. |
| `children` - [`[String!]`](#string) | List of child category IDs. For example, `123`, `456` or `789`. |
| `defaultSortBy` - [`String`](#string) | Default sort by option. For example, `name`, `position` or `size`. |
| `id` - [`ID!`](#id) | Category ID. For example, `123`, `456` or `789`. 'CategoryView' is deprecated for use as a Bucket in 'productSearch' facet (to be removed after Sep 1, 2024). Use 'CategoryBucket' instead. |
| `level` - [`Int`](#int) | The level of the category. The root category is a level 1 category. For example, men -> level 1, men/clothing -> level 2, men/clothing/shorts -> level 3 |
| `name` - [`String`](#string) | Category name. For example, `Electronics`, `Clothing` or `Books`. |
| `parentId` - [`String!`](#string) | Parent category ID. For example, `123`, `456` or `789`. |
| `path` - [`String`](#string) | Category path. For example, `/electronics/laptops`, `/clothing/shirts` or `/books/fiction`. 'CategoryView' is deprecated for use as a Bucket in 'productSearch' facet (to be removed after Sep 1, 2024). Use 'CategoryBucket' instead. |
| `roles` - [`[String!]!`](#string) | List of roles for the category. For example, `show_on_plp`, `show_in_pdp` or `show_in_search`. |
| `urlKey` - [`String`](#string) | Category URL key. For example, `electronics`, `clothing` or `books`. |
| `urlPath` - [`String`](#string) | Category URL path. For example, `/electronics/laptops`, `/clothing/shirts` or `/books/fiction`. |
| `count` - [`Int!`](#int) | 'CategoryView' is deprecated for use as a Bucket in 'productSearch' facet (to be removed after Sep 1, 2024). Use 'CategoryBucket' instead. |
| `title` - [`String!`](#string) | 'CategoryView' is deprecated for use as a Bucket in 'productSearch' facet (to be removed after Sep 1, 2024). Use 'CategoryBucket' instead. |

## CategoryViewInterface

Base interface defining essential category fields shared across all category views.

| Field Name | Description |
| --- | --- |
| `availableSortBy` - [`[String]`](#string) | List of available sort by options. For example, name, size or position. |
| `defaultSortBy` - [`String`](#string) | Default sort by option. For example, name, size or position. |
| `id` - [`ID!`](#id) | Category ID. For example, `123`, `456` or `789`. 'CategoryView' is deprecated for use as a Bucket in 'productSearch' facet (to be removed after Sep 1, 2024). Use 'CategoryBucket' instead. |
| `level` - [`Int`](#int) | The level of the category. The root category is a level 1 category. For example, men -> level 1, men/clothing -> level 2, men/clothing/shorts -> level 3 |
| `name` - [`String`](#string) | Category name. For example, `Electronics`, `Clothing` or `Books`. |
| `path` - [`String`](#string) | Category path. For example, `/electronics/laptops`, `/clothing/shirts` or `/books/fiction`. |
| `roles` - [`[String]`](#string) | List of roles for the category. For example, `show_on_plp`, `show_in_pdp` or `show_in_search`. |
| `urlKey` - [`String`](#string) | Category URL key. For example, `electronics`, `clothing` or `books`. |
| `urlPath` - [`String`](#string) | Category URL path. For example, `/electronics/laptops`, `/clothing/shirts` or `/books/fiction`. |

**Possible types:** [`CategoryView`](#categoryview)

## CategoryViewV2

Base interface defining essential category fields shared across all category views.

| Field Name | Description |
| --- | --- |
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `name` - [`String!`](#string) | Category name. For example, `Electronics`, `Clothing` or `Books`. |

**Possible types:** [`CategoryNavigationView`](#categorynavigationview), [`CategoryProductView`](#categoryproductview), [`CategoryTreeView`](#categorytreeview)

## ComplexProductView

Represents all product types, except simple products. Complex product prices are returned as a price range, because price values can vary based on selected options.

Field-level arguments for filtering:

- `attributes(roles: [String], names: [String])`: A list of roles to filter attributes by (for example, `show_on_plp`, `show_in_pdp`, or `show_in_search`) and a list of attribute names (for example, `color`, `size` or `material`).
- `images(roles: [String])`: List of roles to filter images by, for example `image`, `small_image`, `thumbnail`, or `swatch`.
- `links(linkTypes: [String!])`: Contains details about product links for related products and cross selling. For example, `related`, `up_sell` or `cross_sell`.
- `categories(family: String)`: The product family to filter the categories by. For example, 'clothing', 'electronics' or 'books'.

| Field Name | Description |
| --- | --- |
| `addToCartAllowed` - [`Boolean`](#boolean) | A flag stating if the product can be added to cart. This field is deprecated and will be removed. |
| `inStock` - [`Boolean`](#boolean) | A flag stating if the product is in stock. This field is deprecated and will be removed. |
| `lowStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the Only X Left threshold. This field is deprecated and will be removed. |
| `attributes` - [`[ProductViewAttribute]`](#productviewattribute) | A list of merchant-defined attributes designated for the storefront. They can be filtered by roles and names. |
| `description` - [`String`](#string) | The detailed description of the product. |
| `id` - [`ID!`](#id) | The product ID, generated as a composite key, unique per locale. |
| `images` - [`[ProductViewImage]`](#productviewimage) | A list of images defined for the product. Possible values include `image`, `small_image` or `swatch`. |
| `videos` - [`[ProductViewVideo]`](#productviewvideo) | A list of videos defined for the product. |
| `lastModifiedAt` - [`DateTime`](#datetime) | Date and time when the product was last updated. |
| `metaDescription` - [`String`](#string) | A brief overview of the product for search results listings. |
| `metaKeyword` - [`String`](#string) | A comma-separated list of keywords that are visible only to search engines. |
| `metaTitle` - [`String`](#string) | A string that is displayed in the title bar and tab of the browser and in search results lists. |
| `name` - [`String`](#string) | Product name. |
| `inputOptions` - [`[ProductViewInputOption]`](#productviewinputoption) | A list of input options. This field is deprecated and will be removed. |
| `options` - [`[ProductViewOption]`](#productviewoption) | A list of selectable options. |
| `priceRange` - [`ProductViewPriceRange`](#productviewpricerange) | A range of possible prices for a complex product. |
| `shortDescription` - [`String`](#string) | A summary of the product. |
| `sku` - [`String`](#string) | A unique code used for identification of a product. |
| `externalId` - [`String`](#string) | External Id. This field is deprecated and will be removed. |
| `url` - [`String`](#string) | Canonical URL of the product. This field is deprecated and will be removed. |
| `urlKey` - [`String`](#string) | The URL key of the product. |
| `links` - [`[ProductViewLink]`](#productviewlink) | A list of product links. Links are used to navigate from one product to another. |
| `categories` - [`[CategoryProductView!]`](#categoryproductview) | A list of categories in which the product is present. |
| `queryType` - [`String`](#string) | Indicates if the product was retrieved from the primary or the backup query |
| `visibility` - [`String`](#string) | Visibility setting of the product |

## DateTime

A slightly refined version of RFC-3339 compliant DateTime Scalar.

**Example:** `"2007-12-03T10:15:30Z"`

## FilterableInSearchAttribute

Contains product attributes that can be used for filtering in a `productSearch` query.

| Field Name | Description |
| --- | --- |
| `attribute` - [`String!`](#string) | The unique identifier for an attribute code. This value should be in lowercase letters and without spaces |
| `frontendInput` - [`String`](#string) | Indicates how field rendered on storefront |
| `label` - [`String`](#string) | The display name assigned to the attribute |
| `numeric` - [`Boolean`](#boolean) | Indicates whether this attribute has a numeric value, such as a price or integer |

## Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## Highlight

An object that provides highlighted text for matched words.

| Field Name | Description |
| --- | --- |
| `attribute` - [`String!`](#string) | The product attribute that contains a match for the search phrase |
| `matched_words` - [`[String]!`](#string) | An array of strings |
| `value` - [`String!`](#string) | The matched text, enclosed within emphasis tags |

## ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

## Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

## JSON

A JSON scalar.

## PageInfo

Provides pagination information for navigating through paginated result sets.

| Field Name | Description |
| --- | --- |
| `currentPage` - [`Int!`](#int) | The current page number (1-based indexing). |
| `pageSize` - [`Int!`](#int) | The number of items per page. |
| `totalPages` - [`Int!`](#int) | The total number of pages available. |

## Price

Defines the price of a simple product or a part of a price range for a complex product. It can include a list of price adjustments.

| Field Name | Description |
| --- | --- |
| `adjustments` - [`[PriceAdjustment]`](#priceadjustment) | The signed value of the price adjustment (positive for markup, negative for markdown). |
| `amount` - [`ProductViewMoney`](#productviewmoney) | Contains the monetary value and currency code of a product. |

## PriceAdjustment

Specifies the amount and type of price adjustment.

| Field Name | Description |
| --- | --- |
| `amount` - [`Float`](#float) | The amount of the price adjustment. |
| `code` - [`String`](#string) | Identifies the type of price adjustment. |

## ProductSearchItem

A single product returned by the query.

| Field Name | Description |
| --- | --- |
| `applied_query_rule` - [`AppliedQueryRule`](#appliedqueryrule) | The query rule type that was applied to this product, if any (in preview mode only, returns null otherwise) |
| `highlights` - [`[Highlight]`](#highlight) | An object that provides highlighted text for matched words |
| `productView` - [`ProductView`](#productview) | Contains a product view |

## ProductSearchResponse

Contains the output of a `productSearch` query.

| Field Name | Description |
| --- | --- |
| `facets` - [`[Aggregation]`](#aggregation) | Details about the static and dynamic facets relevant to the search |
| `items` - [`[ProductSearchItem]`](#productsearchitem) | An array of products returned by the query |
| `page_info` - [`SearchResultPageInfo`](#searchresultpageinfo) | Information for rendering pages of search results |
| `related_terms` - [`[String]`](#string) | An array of strings that might include merchant-defined synonyms |
| `suggestions` - [`[String]`](#string) | An array of strings that include the names of products and categories that exist in the catalog that are similar to the search query |
| `total_count` - [`Int`](#int) | The total number of products returned that matched the query |
| `warnings` - [`[ProductSearchWarning]`](#productsearchwarning) | An array of warning messages for validation issues (e.g., sort parameter ignored due to missing categoryPath) |

## ProductSearchSortInput

The product attribute to sort on.

| Input Field | Description |
| --- | --- |
| `attribute` - [`String!`](#string) | The attribute code of a product attribute |
| `direction` - [`SortEnum!`](#sortenum) | ASC (ascending) or DESC (descending) |

## ProductSearchWarning

Structured warning with code and message for easier client handling.

| Field Name | Description |
| --- | --- |
| `code` - [`String!`](#string) | Error code for programmatic handling (e.g., EMPTY_CATEGORY_PATH) |
| `message` - [`String!`](#string) | Human-readable message describing the warning |

## ProductView

Defines the product fields available to the SimpleProductView and ComplexProductView types.

Field-level arguments for filtering:

- `attributes(roles: [String], names: [String])`
- `images(roles: [String])`
- `links(linkTypes: [String!])`: Contains details about product links for related products and cross selling.
- `categories(family: String)`: The product family to filter the categories by. For example, 'clothing', 'electronics' or 'books'.

| Field Name | Description |
| --- | --- |
| `addToCartAllowed` - [`Boolean`](#boolean) | A flag stating if the product can be added to cart. This field is deprecated and will be removed. |
| `inStock` - [`Boolean`](#boolean) | A flag stating if the product is in stock. This field is deprecated and will be removed. |
| `lowStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the Only X Left threshold. This field is deprecated and will be removed. |
| `attributes` - [`[ProductViewAttribute]`](#productviewattribute) | A list of merchant-defined attributes designated for the storefront. They can be filtered by roles and names. |
| `description` - [`String`](#string) | The detailed description of the product. |
| `id` - [`ID!`](#id) | The product ID, generated as a composite key, unique per locale. |
| `images` - [`[ProductViewImage]`](#productviewimage) | A list of images defined for the product. |
| `videos` - [`[ProductViewVideo]`](#productviewvideo) | A list of videos defined for the product. |
| `lastModifiedAt` - [`DateTime`](#datetime) | Date and time when the product was last updated. |
| `metaDescription` - [`String`](#string) | A brief overview of the product for search results listings. |
| `metaKeyword` - [`String`](#string) | A comma-separated list of keywords that are visible only to search engines. |
| `metaTitle` - [`String`](#string) | A string that is displayed in the title bar and tab of the browser and in search results lists. |
| `name` - [`String`](#string) | Product title for search results listings. |
| `shortDescription` - [`String`](#string) | A summary of the product for search results listings. |
| `inputOptions` - [`[ProductViewInputOption]`](#productviewinputoption) | A list of input options. For example, a text field, a number field or a date field. This field is deprecated and will be removed. |
| `sku` - [`String`](#string) | A unique code used for identification of a product. |
| `externalId` - [`String`](#string) | External Id. This field is deprecated and will be removed. |
| `url` - [`String`](#string) | Canonical URL of the product. This field is deprecated and will be removed. |
| `urlKey` - [`String`](#string) | The URL key of the product. This is a unique identifier for the product that is used to create the product's URL. |
| `links` - [`[ProductViewLink]`](#productviewlink) | A list of product links. For example, related, up-sell, and cross-sell links. |
| `categories` - [`[CategoryProductView!]`](#categoryproductview) | A list of categories in which the product is present. |
| `queryType` - [`String`](#string) | Indicates if the product was retrieved from the primary or the backup query |
| `visibility` - [`String`](#string) | Visibility setting of the product |

**Possible types:** [`ComplexProductView`](#complexproductview), [`SimpleProductView`](#simpleproductview)

## ProductViewAttribute

A container for customer-defined attributes that are displayed the storefront.

| Field Name | Description |
| --- | --- |
| `label` - [`String`](#string) | Label of the attribute. |
| `name` - [`String!`](#string) | Name of an attribute code. For example, `color`, `size` or `material` |
| `roles` - [`[String]`](#string) | Roles designated for an attribute on the storefront. For example, `show_on_plp`, `show_in_pdp` or `show_in_search` |
| `value` - [`JSON`](#json) | Attribute value, arbitrary of type. For example, `red`, `blue` or `green` |

## ProductViewCurrency

The list of supported currency codes.

**Values:** `AED`, `AFN`, `ALL`, `AMD`, `ANG`, `AOA`, `ARS`, `AUD`, `AWG`, `AZM`, `AZN`, `BAM`, `BBD`, `BDT`, `BGN`, `BHD`, `BIF`, `BMD`, `BND`, `BOB`, `BRL`, `BSD`, `BTN`, `BUK`, `BWP`, `BYN`, `BZD`, `CAD`, `CDF`, `CHE`, `CHF`, `CHW`, `CLP`, `CNY`, `COP`, `CRC`, `CUP`, `CVE`, `CZK`, `DJF`, `DKK`, `DOP`, `DZD`, `EEK`, `EGP`, `ERN`, `ETB`, `EUR`, `FJD`, `FKP`, `GBP`, `GEK`, `GEL`, `GHS`, `GIP`, `GMD`, `GNF`, `GQE`, `GTQ`, `GYD`, `HKD`, `HNL`, `HRK`, `HTG`, `HUF`, `IDR`, `ILS`, `INR`, `IQD`, `IRR`, `ISK`, `JMD`, `JOD`, `JPY`, `KES`, `KGS`, `KHR`, `KMF`, `KPW`, `KRW`, `KWD`, `KYD`, `KZT`, `LAK`, `LBP`, `LKR`, `LRD`, `LSL`, `LSM`, `LTL`, `LVL`, `LYD`, `MAD`, `MDL`, `MGA`, `MKD`, `MMK`, `MNT`, `MOP`, `MRO`, `MUR`, `MVR`, `MWK`, `MXN`, `MYR`, `MZN`, `NAD`, `NGN`, `NIC`, `NOK`, `NPR`, `NZD`, `OMR`, `PAB`, `PEN`, `PGK`, `PHP`, `PKR`, `PLN`, `PYG`, `QAR`, `RHD`, `ROL`, `RON`, `RSD`, `RUB`, `RWF`, `SAR`, `SBD`, `SCR`, `SDG`, `SEK`, `SGD`, `SHP`, `SKK`, `SLL`, `SOS`, `SRD`, `STD`, `SVC`, `SYP`, `SZL`, `THB`, `TJS`, `TMM`, `TND`, `TOP`, `TRL`, `TRY`, `TTD`, `TWD`, `TZS`, `UAH`, `UGX`, `USD`, `UYU`, `UZS`, `VEB`, `VEF`, `VND`, `VUV`, `WST`, `XCD`, `XOF`, `XPF`, `YER`, `ZAR`, `ZMK`, `ZWD`, `NONE`

## ProductViewImage

Contains details about a product image.

| Field Name | Description |
| --- | --- |
| `label` - [`String`](#string) | The display label of the product image. For example, `Main Image`, `Small Image` or `Thumbnail Image` |
| `roles` - [`[String]`](#string) | A list that describes how the image is used. Can be `image`, `small_image` or `thumbnail` |
| `url` - [`String!`](#string) | The URL to the product image. For example, `https://example.com/image.jpg`. |

## ProductViewInputOption

Product options provide a way to configure products by making selections of particular option values. Selecting one or many options will point to a simple product.

| Field Name | Description |
| --- | --- |
| `id` - [`ID`](#id) | The ID of an option value. For example, `123` for the first option value, `456` for the second option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, `Red`, `Blue` or `Green` |
| `required` - [`Boolean`](#boolean) | Indicates whether this input option is required. |
| `type` - [`String`](#string) | The type of data entry. For example, `text`, `number` or `date` |
| `markupAmount` - [`Float`](#float) | The percentage the prices is marked up or down. A positive value, such as `10.00`, indicates the product is marked up 10%. A negative value, such as `-10.00`, indicates the price is marked down 10%. |
| `suffix` - [`String`](#string) | SKU suffix to add to the product. For example, `-red`, `-blue` or `-green` |
| `sortOrder` - [`Int`](#int) | Sort order for the input option. For example, `1` for the first input option, `2` for the second input option. |
| `range` - [`ProductViewInputOptionRange`](#productviewinputoptionrange) | The range of values for the input option. For example, if the input option is a text field, the range represents the number of characters. |
| `imageSize` - [`ProductViewInputOptionImageSize`](#productviewinputoptionimagesize) | The size of the image for the input option. |
| `fileExtensions` - [`String`](#string) | The file extensions allowed for the image. For example, `jpg`, `png`, `gif`, or `svg` |

## ProductViewInputOptionImageSize

Dimensions of the image associated with the input option.

| Field Name | Description |
| --- | --- |
| `width` - [`Int`](#int) | The width of the image in pixels. For example, `100` for a 100px width. |
| `height` - [`Int`](#int) | The height of the image, in pixels. For example, `100` for a 100px height. |

## ProductViewInputOptionRange

Lists the value range associated with a `ProductViewInputOption`. For example, if the input option is a text field, the range represents the number of characters.

| Field Name | Description |
| --- | --- |
| `from` - [`Float`](#float) | The starting value of the range. For example, if the input option is a text field, the starting value represents the minimum number of characters. |
| `to` - [`Float`](#float) | The ending value of the range. For example, if the input option is a text field, the ending value represents the maximum number of characters. |

## ProductViewLink

The product link type. Contains details about product links for related products and cross selling. For example, `related`, `up_sell` or `cross_sell`.

| Field Name | Description |
| --- | --- |
| `product` - [`ProductView!`](#productview) | Contains the details of the product found in the link. |
| `linkTypes` - [`[String!]!`](#string) | Stores the types of the links with this product. |

## ProductViewMoney

Defines a monetary value, including a numeric value and a currency code.

| Field Name | Description |
| --- | --- |
| `currency` - [`ProductViewCurrency`](#productviewcurrency) | A three-letter currency code, such as USD or EUR. |
| `value` - [`Float`](#float) | A number expressing a monetary value. |

## ProductViewOption

Product options provide a way to configure products by making selections of particular option values. Selecting one or many options will point to a simple product.

| Field Name | Description |
| --- | --- |
| `id` - [`ID`](#id) | The ID of the option. For example, `123` for the first option, `456` for the second option. |
| `multi` - [`Boolean`](#boolean) | Indicates whether the option allows multiple choices. The value is `true` for a multi-select option, `false` for a single-select option. |
| `required` - [`Boolean`](#boolean) | Indicates whether the option must be selected. |
| `title` - [`String`](#string) | The display name of the option. For example, `Color`, `Size` or `Material` |
| `values` - [`[ProductViewOptionValue!]`](#productviewoptionvalue) | List of available option values. For example, `Red`, `Blue` or `Green` |

## ProductViewOptionValue

Defines the product fields available to the ProductViewOptionValueProduct and ProductViewOptionValueConfiguration types.

| Field Name | Description |
| --- | --- |
| `id` - [`ID`](#id) | The ID of an option value. |
| `title` - [`String`](#string) | The display name of the option value. |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the out-of-stock threshold. |

**Possible types:** [`ProductViewOptionValueConfiguration`](#productviewoptionvalueconfiguration), [`ProductViewOptionValueProduct`](#productviewoptionvalueproduct), [`ProductViewOptionValueSwatch`](#productviewoptionvalueswatch)

## ProductViewOptionValueConfiguration

An implementation of ProductViewOptionValue for configuration values.

| Field Name | Description |
| --- | --- |
| `id` - [`ID`](#id) | The ID of an option value. For example, `123` for the first option value, `456` for the second option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, `Red`, `Blue` or `Green` |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product option value has reached the out-of-stock threshold. |

## ProductViewOptionValueProduct

An implementation of ProductViewOptionValue that adds details about a simple product.

| Field Name | Description |
| --- | --- |
| `id` - [`ID`](#id) | The ID of an option value. For example, `123` for the first option value, `456` for the second option value. |
| `isDefault` - [`Boolean`](#boolean) | Indicates whether the option value is the default. |
| `product` - [`SimpleProductView`](#simpleproductview) | Details about a simple product. For example, a product with a SKU of `123`, a name of `Product 1`, a price of `100.00`. |
| `quantity` - [`Float`](#float) | Default quantity of an option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, `Red`, `Blue` or `Green` |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product option value has reached the out-of-stock threshold. |

## ProductViewOptionValueSwatch

An implementation of ProductViewOptionValueSwatch for swatches.

| Field Name | Description |
| --- | --- |
| `id` - [`ID`](#id) | The ID of an option value. For example, `123` for the first option value, `456` for the second option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, `Red`, `Blue` or `Green` |
| `type` - [`SwatchType`](#swatchtype) | Indicates the type of the swatch. |
| `value` - [`String`](#string) | The value of the swatch depending on the type of the swatch. |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product option value has reached the out-of-stock threshold. |

## ProductViewPrice

Base product price view. Contains the final price after discounts, the regular price, and the list of tier prices.

| Field Name | Description |
| --- | --- |
| `final` - [`Price`](#price) | Price value after discounts, excluding personalized promotions. |
| `regular` - [`Price`](#price) | Base product price specified by the merchant. |
| `tiers` - [`[ProductViewTierPrice]`](#productviewtierprice) | Volume based pricing. |
| `roles` - [`[String]`](#string) | Price roles, stating if the price should be visible or hidden. For example, `show_on_plp`, `show_in_pdp` or `show_in_search` |

## ProductViewPriceRange

The minimum and maximum price of a complex product.

| Field Name | Description |
| --- | --- |
| `maximum` - [`ProductViewPrice`](#productviewprice) | Maximum price. |
| `minimum` - [`ProductViewPrice`](#productviewprice) | Minimum price. |

## ProductViewTierCondition

**Union types:** `ProductViewTierRangeCondition`, `ProductViewTierExactMatchCondition`

## ProductViewTierExactMatchCondition

Minimum quantity (inclusive) required to activate this tier price. For example, a value of `10` means this tier applies when 10 or more items are purchased.

| Field Name | Description |
| --- | --- |
| `in` - [`[Float]`](#float) | Exact quantity values that activate this tier price. For example, `[5, 10]` means the tier applies only when the purchased quantity is exactly 5 or exactly 10. |

## ProductViewTierPrice

The discounted price that applies when the quantity conditions in `quantity` are satisfied. Contains the monetary amount and any price adjustments applied to this tier.

| Field Name | Description |
| --- | --- |
| `tier` - [`Price`](#price) | The discounted price that applies when the quantity conditions in `quantity` are satisfied. Contains the monetary amount and any price adjustments applied to this tier. |
| `quantity` - [`[ProductViewTierCondition!]!`](#productviewtiercondition) | The quantity conditions that must be met to activate the tier price. For example, `10` for a quantity of 10 or `20` for a quantity of 20. |

## ProductViewTierRangeCondition

Minimum quantity (inclusive) required to activate this tier price. For example, a value of `10` means this tier applies when 10 or more items are purchased. Maximum quantity (exclusive) required to activate this tier price. For example, a value of `20` means this tier applies when less than 20 items are purchased.

| Field Name | Description |
| --- | --- |
| `gte` - [`Float`](#float) | The minimum quantity that must be purchased to activate the tier price. Must be greater than or equal to the value in `gte`. |
| `lt` - [`Float`](#float) | Maximum quantity (exclusive) for this tier price. For example, a value of `20` means this tier applies only when fewer than 20 items are purchased. |

## ProductViewVariant

Represents a product variant.

| Field Name | Description |
| --- | --- |
| `selections` - [`[String!]`](#string) | List of option values that make up the variant. For example, `red`, `blue` or `green` |
| `product` - [`ProductView`](#productview) | Product corresponding to the variant. For example, a product with a SKU of `123`, a name of `Product 1`, a price of `100.00`. |

## ProductViewVariantResults

Represents the results of a product variant search.

| Field Name | Description |
| --- | --- |
| `variants` - [`[ProductViewVariant]!`](#productviewvariant) | List of product variants. For example, a variant with a selection of `red`, `blue` or `green` |
| `cursor` - [`String`](#string) | Pagination cursor. For example, `123` for the first variant, `456` for the second variant. |

## ProductViewVideo

Contains details about a product video. For example, a video of the product being used or a video of the product being assembled.

| Field Name | Description |
| --- | --- |
| `preview` - [`ProductViewImage`](#productviewimage) | Preview image for the video. For example, a screenshot of the video. |
| `url` - [`String!`](#string) | The URL to the product video. For example, `https://example.com/video.mp4` or `https://example.com/video.webm` |
| `description` - [`String`](#string) | Description of the product video. For example, `A video of the product being used` or `A video of the product being assembled` |
| `title` - [`String`](#string) | The title of the product video. For example, `Product Video` or `Product Assembly Video` |

## PurchaseHistory

User purchase history.

| Input Field | Description |
| --- | --- |
| `date` - [`DateTime`](#datetime) | |
| `items` - [`[String]!`](#string) | |

## QueryContextInput

| Input Field | Description |
| --- | --- |
| `customerGroup` - [`String!`](#string) | The customer group code. Field reserved for future use. Currently, passing this field will have no impact on search results, that is, the search results will be for "Not logged in" customer |
| `userViewHistory` - [`[ViewHistoryInput!]`](#viewhistoryinput) | User view history with timestamp |

## RangeBucket

For use on numeric product fields.

| Field Name | Description |
| --- | --- |
| `count` - [`Int!`](#int) | The number of items in the bucket |
| `from` - [`Float!`](#float) | The minimum amount in a price range |
| `title` - [`String!`](#string) | The display text defining the price range |
| `to` - [`Float`](#float) | The maximum amount in a price range |

## RecommendationUnit

Recommendation Unit containing product and other details.

| Field Name | Description |
| --- | --- |
| `displayOrder` - [`Int`](#int) | Order in which recommendation units are displayed |
| `pageType` - [`String`](#string) | Page type |
| `productsView` - [`[ProductView]`](#productview) | List of product view |
| `storefrontLabel` - [`String`](#string) | Storefront label to be displayed on the storefront |
| `totalProducts` - [`Int`](#int) | Total products returned in recommendations |
| `typeId` - [`String`](#string) | Type of recommendation |
| `unitId` - [`String`](#string) | Id of the preconfigured unit |
| `unitName` - [`String`](#string) | Name of the preconfigured unit |

## Recommendations

Returns a Recommendations response.

| Field Name | Description |
| --- | --- |
| `results` - [`[RecommendationUnit]`](#recommendationunit) | List of rec units with products recommended |
| `totalResults` - [`Int`](#int) | Total number of rec units for which recommendations are returned |

## ScalarBucket

For use on string and other scalar product fields.

| Field Name | Description |
| --- | --- |
| `count` - [`Int!`](#int) | The number of items in the bucket |
| `id` - [`ID!`](#id) | An identifier that can be used for filtering. It may contain non-human readable data |
| `title` - [`String!`](#string) | The display text for the scalar value |

## SearchCategoryResultPage

Represents a paginated result set of category search results.

| Field Name | Description |
| --- | --- |
| `items` - [`[CategoryTreeView!]!`](#categorytreeview) | The list of categories matching the search criteria. |
| `totalCount` - [`Int!`](#int) | The total number of categories matching the search criteria across all pages. |
| `pageInfo` - [`PageInfo!`](#pageinfo) | Pagination information for navigating through results. |

## SearchClauseInput

A product attribute to filter on.

| Input Field | Description |
| --- | --- |
| `attribute` - [`String!`](#string) | The attribute code of a product attribute |
| `contains` - [`String`](#string) | Attribute value should contain the specified string |
| `eq` - [`String`](#string) | A string value to filter on |
| `in` - [`[String]`](#string) | An array of string values to filter on |
| `range` - [`SearchRangeInput`](#searchrangeinput) | A range of numeric values to filter on |
| `startsWith` - [`String`](#string) | Attribute value should start with the specified string |

## SearchRangeInput

A range of numeric values for use in a search.

| Input Field | Description |
| --- | --- |
| `from` - [`Float`](#float) | The minimum value to filter on. If not specified, the value of `0` is applied |
| `to` - [`Float`](#float) | The maximum value to filter on |

## SearchResultPageInfo

Provides navigation for the query response.

| Field Name | Description |
| --- | --- |
| `current_page` - [`Int`](#int) | The specific page to return. |
| `page_size` - [`Int`](#int) | The maximum number of items to return per page of results. |
| `total_pages` - [`Int`](#int) | The total number of pages in the response. |

## SimpleProductView

Represents a single-SKU product without selectable variants. Because there are no variant combinations, pricing is returned as a single price (not a price range).

Field-level arguments for filtering:

- `attributes(roles: [String], names: [String])`: List of roles to filter the attributes by (for example, `show_on_plp`, `show_in_pdp` or `show_in_search`) and list of names (for example, `color`, `size` or `material`).
- `images(roles: [String])`
- `links(linkTypes: [String!])`: List of link types to filter links by, for example `related`, `up_sell`, or `cross_sell`.
- `categories(family: String)`: The product family to filter categories by, for example `clothing`, `electronics`, or `books`.

| Field Name | Description |
| --- | --- |
| `addToCartAllowed` - [`Boolean`](#boolean) | A flag stating if the product can be added to cart. This field is deprecated and will be removed. |
| `inStock` - [`Boolean`](#boolean) | A flag stating if the product is in stock. This field is deprecated and will be removed. |
| `lowStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the Only X Left threshold. This field is deprecated and will be removed. |
| `attributes` - [`[ProductViewAttribute]`](#productviewattribute) | A list of merchant-defined attributes designated for the storefront. They can be filtered by names and roles. |
| `description` - [`String`](#string) | The detailed description of the product. |
| `id` - [`ID!`](#id) | The product ID, generated as a composite key, unique per locale. |
| `images` - [`[ProductViewImage]`](#productviewimage) | A list of images defined for the product. Possible values include `image`, `small_image`, and `swatch`. |
| `videos` - [`[ProductViewVideo]`](#productviewvideo) | A list of videos defined for the product. |
| `inputOptions` - [`[ProductViewInputOption]`](#productviewinputoption) | A list of input options. For example, a text field, a number field or a date field. This field is deprecated and will be removed. |
| `lastModifiedAt` - [`DateTime`](#datetime) | Date and time when the product was last updated. |
| `metaDescription` - [`String`](#string) | A brief overview of the product for search results listings. |
| `metaKeyword` - [`String`](#string) | A comma-separated list of keywords that are visible only to search engines. |
| `metaTitle` - [`String`](#string) | A string that is displayed in the title bar and tab of the browser and in search results lists. |
| `name` - [`String`](#string) | Product name. |
| `price` - [`ProductViewPrice`](#productviewprice) | Base product price view. |
| `shortDescription` - [`String`](#string) | A summary of the product. |
| `sku` - [`String`](#string) | A unique code used for identification of a product. |
| `externalId` - [`String`](#string) | External Id. For example, `123`, `456` or `789`. This field is deprecated and will be removed. |
| `url` - [`String`](#string) | Canonical URL of the product. For example, `https://example.com/product-1` or `https://example.com/product-2`. This field is deprecated and will be removed. |
| `urlKey` - [`String`](#string) | The URL key of the product. For example, `product-1`, `product-2` or `product-3`. |
| `links` - [`[ProductViewLink]`](#productviewlink) | A list of product links. For example, a related product, an up-sell product or a cross-sell product. |
| `categories` - [`[CategoryProductView!]`](#categoryproductview) | A list of categories in which the product is present. Categories are used to group products by category. |
| `queryType` - [`String`](#string) | Indicates if the product was retrieved from the primary or the backup query |
| `visibility` - [`String`](#string) | Visibility setting of the product |

## SortEnum

Indicates whether to return results in ascending or descending order.

**Values:** `ASC`, `DESC`

## SortableAttribute

Contains product attributes that can be used for sorting in a `productSearch` query.

| Field Name | Description |
| --- | --- |
| `attribute` - [`String!`](#string) | The unique identifier for an attribute code. This value should be in lowercase letters and without space |
| `frontendInput` - [`String`](#string) | Indicates how field rendered on storefront |
| `label` - [`String`](#string) | The display name assigned to the attribute |
| `numeric` - [`Boolean`](#boolean) | Indicates whether this attribute has a numeric value, such as a price or integer |

## StatsBucket

For retrieving statistics across multiple buckets.

| Field Name | Description |
| --- | --- |
| `max` - [`Float!`](#float) | The maximum value |
| `min` - [`Float!`](#float) | The minimum value |
| `title` - [`String!`](#string) | The display text for the bucket |

## String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## SwatchType

The type of the swatch.

**Values:** `TEXT`, `IMAGE`, `COLOR_HEX`, `CUSTOM`

## ViewHistory

User view history.

| Input Field | Description |
| --- | --- |
| `date` - [`DateTime`](#datetime) | |
| `sku` - [`String!`](#string) | |

## ViewHistoryInput

User view history.

| Input Field | Description |
| --- | --- |
| `dateTime` - [`DateTime`](#datetime) | |
| `sku` - [`String!`](#string) | |
