The Merchandising GraphQL API enables developers to build rich, dynamic storefront experiences by providing efficient
access to catalog data from Adobe Commerce Optimizer.

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
# Trigger name and value that sets data access filters.
AC-Policy-{*}: AC-Policy-Brand
```

## Required headers

All API requests must include the following headers:

- `AC-View-Id`: View ID for catalog context.
- `Content-Type`: Content type header.

## Queries

### attributeMetadata

Return a list of product attribute codes that can be used for sorting or filtering in a `productSearch` query

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

<HorizontalLine />

### categoryTree

Retrieves category tree nodes, optionally filtered by family, slugs and limited by depth.

**Response:** [`[CategoryTreeView]`](#categorytreeview)

#### Arguments

| Name | Description |
|------|-------------|
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
  "family": "abc123",
  "slugs": ["abc123"],
  "depth": 987
}
```

##### Response

```json
{
  "data": {
    "categoryTree": [
      {
        "slug": "abc123",
        "name": "abc123",
        "description": "xyz789",
        "metaTags": CategoryMetaTags,
        "images": [CategoryImage],
        "level": 123,
        "parentSlug": "xyz789",
        "childrenSlugs": ["xyz789"]
      }
    ]
  }
}
```

<HorizontalLine />

### navigation

Retrieves the navigation tree for a given product family.

**Response:** [`[CategoryNavigationView]`](#categorynavigationview)

#### Arguments

| Name | Description |
|------|-------------|
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
        "slug": "abc123",
        "name": "xyz789",
        "children": [CategoryNavigationView]
      }
    ]
  }
}
```

<HorizontalLine />

### productSearch

Search products using Live Search

**Response:** [`ProductSearchResponse!`](#productsearchresponse)

#### Arguments

| Name | Description |
|------|-------------|
| `context` - [`QueryContextInput`](#querycontextinput) | The query context |
| `current_page` - [`Int`](#int) | Specifies which page of results to return. The default value is 1 Default: `1` |
| `filter` - [`[SearchClauseInput!]`](#searchclauseinput) | Identifies product attributes and conditions to filter on |
| `page_size` - [`Int`](#int) | The maximum number of results to return at once Default: `20` |
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
  "phrase": "xyz789",
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
      "related_terms": ["xyz789"],
      "suggestions": ["xyz789"],
      "total_count": 123,
      "warnings": [ProductSearchWarning]
    }
  }
}
```

<HorizontalLine />

### products

Search for products that match the specified SKU values. In Adobe Commerce as a Cloud Service, this query replaces the `products` query defined in the Commerce Foundation.

**Response:** [`[ProductView]`](#productview)

#### Arguments

| Name | Description |
|------|-------------|
| `skus` - [`[String]`](#string) | List of SKUs to search for. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. |

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
        "addToCartAllowed": false,
        "inStock": true,
        "lowStock": false,
        "attributes": [ProductViewAttribute],
        "description": "abc123",
        "id": "4",
        "images": [ProductViewImage],
        "videos": [ProductViewVideo],
        "lastModifiedAt": "2007-12-03T10:15:30Z",
        "metaDescription": "abc123",
        "metaKeyword": "abc123",
        "metaTitle": "abc123",
        "name": "xyz789",
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

<HorizontalLine />

### recommendationsByUnitIds

**Response:** [`Recommendations`](#recommendations)

#### Arguments

| Name | Description |
|------|-------------|
| `unitIds` - [`[String!]!`](#string) | List unit IDs of preconfigured units |
| `currentSku` - [`String`](#string) | SKU of the product currently being viewed on PDP |
| `currentProduct` - [`CurrentProductInput`](#currentproductinput) | Current product context from PDP (SKU, price, category, etc.) |
| `userPurchaseHistory` - [`[PurchaseHistory]`](#purchasehistory) | User purchase history with timestamp |
| `userViewHistory` - [`[ViewHistory]`](#viewhistory) | User view history with timestamp |
| `cartSkus` - [`[String]`](#string) | SKUs of products in the cart |

#### Example

##### Query

```graphql
query recommendationsByUnitIds(
  $unitIds: [String!]!,
  $currentSku: String,
  $currentProduct: CurrentProductInput,
  $userPurchaseHistory: [PurchaseHistory],
  $userViewHistory: [ViewHistory],
  $cartSkus: [String]
) {
  recommendationsByUnitIds(
    unitIds: $unitIds,
    currentSku: $currentSku,
    currentProduct: $currentProduct,
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
  "unitIds": ["xyz789"],
  "currentSku": "abc123",
  "currentProduct": CurrentProductInput,
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
      "totalResults": 987
    }
  }
}
```

<HorizontalLine />

### refineProduct

Narrow down the results of a `products` query that was run against a complex product. Specify option IDs and SKUs to refine the product.

**Response:** [`ProductView`](#productview)

#### Arguments

| Name | Description |
|------|-------------|
| `optionIds` - [`[String!]!`](#string) | List of option IDs to refine the product by. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. |
| `sku` - [`String!`](#string) | SKU of the product to refine. For example, &#x60;RF903&#x60;, &#x60;DG90-54&#x60; or &#x60;789-001&#x60;. |

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
      "addToCartAllowed": true,
      "inStock": false,
      "lowStock": true,
      "attributes": [ProductViewAttribute],
      "description": "xyz789",
      "id": "4",
      "images": [ProductViewImage],
      "videos": [ProductViewVideo],
      "lastModifiedAt": "2007-12-03T10:15:30Z",
      "metaDescription": "abc123",
      "metaKeyword": "xyz789",
      "metaTitle": "xyz789",
      "name": "abc123",
      "shortDescription": "abc123",
      "inputOptions": [ProductViewInputOption],
      "sku": "abc123",
      "externalId": "abc123",
      "url": "xyz789",
      "urlKey": "xyz789",
      "links": [ProductViewLink],
      "categories": [CategoryProductView],
      "queryType": "xyz789",
      "visibility": "abc123"
    }
  }
}
```

<HorizontalLine />

### searchCategory

Search for categories by name with optional filtering and pagination. Results are returned in alphabetical order by category name.

**Response:** [`SearchCategoryResultPage`](#searchcategoryresultpage)

#### Arguments

| Name | Description |
|------|-------------|
| `searchTerm` - [`String!`](#string) | The search term to match against category names. |
| `family` - [`String`](#string) | Optional product family filter to limit search results. For example, clothing, electronics or books. |
| `pageSize` - [`Int`](#int) | The number of results to return per page (default: 20). Default: `20` |
| `currentPage` - [`Int`](#int) | The page number to retrieve (1-based indexing, default: 1). Default: `1` |

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
  "family": "xyz789",
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
      "totalCount": 123,
      "pageInfo": PageInfo
    }
  }
}
```

<HorizontalLine />

### variants

**Response:** [`ProductViewVariantResults`](#productviewvariantresults)

#### Arguments

| Name | Description |
|------|-------------|
| `sku` - [`String!`](#string) | SKU of the product to get variants for. For example, &#x60;UR123&#x60;, &#x60;MZ456&#x60; or &#x60;KS789&#x60;. |
| `optionIds` - [`[String!]`](#string) | List of option IDs to get variants for. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. |
| `pageSize` - [`Int`](#int) | Page size for pagination. For example, &#x60;10&#x60; for a page size of 10 or &#x60;20&#x60; for a page size of 20. |
| `cursor` - [`String`](#string) | Pagination cursor. For example, &#x60;123&#x60; for the first variant, &#x60;456&#x60; for the second variant. |

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
  "sku": "xyz789",
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
      "cursor": "xyz789"
    }
  }
}
```

## Types

### Aggregation

A bucket that contains information for each filterable option

#### Fields

| Field Name | Description |
|------------|-------------|
| `attribute` - [`String!`](#string) | The attribute code of the filter item |
| `buckets` - [`[Bucket]!`](#bucket) | A container that divides the data into manageable groups. For example, attributes that can have numeric values might have buckets that define price ranges |
| `title` - [`String!`](#string) | The filter name displayed in layered navigation |
| `type` - [`AggregationType`](#aggregationtype) | Identifies the data type of the aggregation |

#### Example

```json
{
  "attribute": "abc123",
  "buckets": [Bucket],
  "title": "xyz789",
  "type": "INTELLIGENT"
}
```

<HorizontalLine />

### AggregationType

Identifies the data type of the aggregation

#### Values

| Enum Value | Description |
|------------|-------------|
| `INTELLIGENT` |  |
| `PINNED` |  |
| `POPULAR` |  |

#### Example

```json
""INTELLIGENT""
```

<HorizontalLine />

### AppliedQueryRule

The rule that was applied to this product

#### Fields

| Field Name | Description |
|------------|-------------|
| `action_type` - [`AppliedQueryRuleActionType`](#appliedqueryruleactiontype) | An enum that defines the type of rule that was applied |
| `rule_id` - [`String`](#string) | The ID assigned to the rule |
| `rule_name` - [`String`](#string) | The name of the applied rule |

#### Example

```json
{
  "action_type": "BOOST",
  "rule_id": "xyz789",
  "rule_name": "abc123"
}
```

<HorizontalLine />

### AppliedQueryRuleActionType

The type of rule that was applied to a product during search (optional)

#### Values

| Enum Value | Description |
|------------|-------------|
| `BOOST` |  |
| `BURY` |  |
| `PIN` |  |

#### Example

```json
""BOOST""
```

<HorizontalLine />

### AttributeMetadataResponse

Contains the output of the `attributeMetadata` query

#### Fields

| Field Name | Description |
|------------|-------------|
| `filterableInSearch` - [`[FilterableInSearchAttribute!]`](#filterableinsearchattribute) | An array of product attributes that can be used for filtering in a &#x60;productSearch&#x60; query |
| `sortable` - [`[SortableAttribute!]`](#sortableattribute) | An array of product attributes that can be used for sorting in a &#x60;productSearch&#x60; query |

#### Example

```json
{
  "filterableInSearch": [FilterableInSearchAttribute],
  "sortable": [SortableAttribute]
}
```

<HorizontalLine />

### Boolean

The `Boolean` scalar type represents `true` or `false`.

#### Example

```json
true
```

<HorizontalLine />

### Bucket

An interface for bucket contents

#### Fields

| Field Name | Description |
|------------|-------------|
| `title` - [`String!`](#string) | A human-readable name of a bucket |

#### Possible Types

| Bucket Types |
|----------------|
| [`CategoryBucket`](#categorybucket) |
| [`CategoryView`](#categoryview) |
| [`RangeBucket`](#rangebucket) |
| [`ScalarBucket`](#scalarbucket) |
| [`StatsBucket`](#statsbucket) |

#### Example

```json
{"title": "abc123"}
```

<HorizontalLine />

### CategoryBucket

New category bucket for federation

#### Fields

| Field Name | Description |
|------------|-------------|
| `count` - [`Int!`](#int) |  |
| `id` - [`ID!`](#id) |  |
| `path` - [`String!`](#string) |  |
| `title` - [`String!`](#string) |  |

#### Example

```json
{
  "count": 123,
  "id": 4,
  "path": "xyz789",
  "title": "abc123"
}
```

<HorizontalLine />

### CategoryBucketInterface

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID!`](#id) |  |

#### Possible Types

| CategoryBucketInterface Types |
|----------------|
| [`CategoryBucket`](#categorybucket) |

#### Example

```json
{"id": 4}
```

<HorizontalLine />

### CategoryImage

Represents an image associated with a category.

#### Fields

| Field Name | Description |
|------------|-------------|
| `url` - [`String!`](#string) | The URL where the image is hosted. |
| `label` - [`String`](#string) | A descriptive label or alt text for the image. |
| `roles` - [`[String]`](#string) | Standard predefined roles for the image. |
| `customRoles` - [`[String]`](#string) | Custom roles specific to the implementation. |

#### Example

```json
{
  "url": "xyz789",
  "label": "xyz789",
  "roles": ["abc123"],
  "customRoles": ["abc123"]
}
```

<HorizontalLine />

### CategoryMetaTags

SEO metadata tags for the category.

#### Fields

| Field Name | Description |
|------------|-------------|
| `title` - [`String`](#string) | The page title for SEO purposes. |
| `description` - [`String`](#string) | The meta description for SEO purposes. |
| `keywords` - [`[String]`](#string) | Keywords associated with the category for SEO. |

#### Example

```json
{
  "title": "abc123",
  "description": "abc123",
  "keywords": ["xyz789"]
}
```

<HorizontalLine />

### CategoryNavigationView

Represents a category optimized for navigation menus, with nested children for building navigation trees.

#### Fields

| Field Name | Description |
|------------|-------------|
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `name` - [`String!`](#string) | Category name. For example, &#x60;Electronics&#x60;, &#x60;Clothing&#x60; or &#x60;Books&#x60;. |
| `children` - [`[CategoryNavigationView]`](#categorynavigationview) | The direct child categories for building nested navigation menus. |

#### Example

```json
{
  "slug": "abc123",
  "name": "xyz789",
  "children": [CategoryNavigationView]
}
```

<HorizontalLine />

### CategoryProductView

Represents category information associated with a product, including hierarchical parent relationships.

#### Fields

| Field Name | Description |
|------------|-------------|
| `name` - [`String!`](#string) | Category name. For example, &#x60;Electronics&#x60;, &#x60;Clothing&#x60; or &#x60;Books&#x60;. |
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `level` - [`Int!`](#int) | The level of the category. The root category is a level 1 category. For example, men -&gt; level 1, men/clothing -&gt; level 2, men/clothing/shorts -&gt; level 3 |
| `parents` - [`[CategoryProductView!]`](#categoryproductview) | The ancestor categories in the hierarchy, ordered from root to immediate parent. |

#### Example

```json
{
  "name": "xyz789",
  "slug": "abc123",
  "level": 987,
  "parents": [CategoryProductView]
}
```

<HorizontalLine />

### CategoryTreeView

Represents a category within a hierarchical tree structure, including parent and children relationships.

#### Fields

| Field Name | Description |
|------------|-------------|
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `name` - [`String!`](#string) | Category name. For example, &#x60;Electronics&#x60;, &#x60;Clothing&#x60; or &#x60;Books&#x60;. |
| `description` - [`String`](#string) | A detailed description of the category. |
| `metaTags` - [`CategoryMetaTags`](#categorymetatags) | SEO metadata tags for the category. |
| `images` - [`[CategoryImage]`](#categoryimage) | Visual images associated with the category. |
| `level` - [`Int`](#int) | The root category is a level 1 category. For example, men -&gt; level 1, men/clothing -&gt; level 2, men/clothing/shorts -&gt; level 3 |
| `parentSlug` - [`String`](#string) | The slug of the parent category, if any. |
| `childrenSlugs` - [`[String]`](#string) | The slugs of all direct child categories. Ex: men/clothing/shorts -&gt; [men/clothing/shorts/athletic, men/clothing/shorts/swimwear] |

#### Example

```json
{
  "slug": "xyz789",
  "name": "abc123",
  "description": "xyz789",
  "metaTags": CategoryMetaTags,
  "images": [CategoryImage],
  "level": 987,
  "parentSlug": "abc123",
  "childrenSlugs": ["xyz789"]
}
```

<HorizontalLine />

### CategoryView

Represents a category. Contains information about a category, including the category ID, the category name, the category path, the category URL key, the category URL path, and the category roles.

#### Fields

| Field Name | Description |
|------------|-------------|
| `availableSortBy` - [`[String]`](#string) | List of available sort by options. For example, &#x60;name&#x60;, &#x60;position&#x60; or &#x60;size&#x60;. |
| `children` - [`[String!]`](#string) | List of child category IDs. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. |
| `defaultSortBy` - [`String`](#string) | Default sort by option. For example, &#x60;name&#x60;, &#x60;position&#x60; or &#x60;size&#x60;. |
| `id` - [`ID!`](#id) | Category ID. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. *(Deprecated: &#x27;CategoryView&#x27; is deprecated for use as a Bucket in &#x27;productSearch&#x27; facet (to be removed after Sep 1, 2024). Use &#x27;CategoryBucket&#x27; instead.)* |
| `level` - [`Int`](#int) | The level of the category. The root category is a level 1 category. For example, men -&gt; level 1, men/clothing -&gt; level 2, men/clothing/shorts -&gt; level 3 |
| `name` - [`String`](#string) | Category name. For example, &#x60;Electronics&#x60;, &#x60;Clothing&#x60; or &#x60;Books&#x60;. |
| `parentId` - [`String!`](#string) | Parent category ID. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. |
| `position` - [`Int`](#int) | The position of the category in sort order. For example, &#x60;1&#x60;, &#x60;2&#x60;, &#x60;3&#x60; or &#x60;10&#x60;. |
| `path` - [`String`](#string) | Category path. For example, &#x60;/electronics/laptops&#x60;, &#x60;/clothing/shirts&#x60; or &#x60;/books/fiction&#x60;. *(Deprecated: &#x27;CategoryView&#x27; is deprecated for use as a Bucket in &#x27;productSearch&#x27; facet (to be removed after Sep 1, 2024). Use &#x27;CategoryBucket&#x27; instead.)* |
| `roles` - [`[String!]!`](#string) | List of roles for the category. For example, &#x60;show_on_plp&#x60;, &#x60;show_in_pdp&#x60; or &#x60;show_in_search&#x60;. |
| `urlKey` - [`String`](#string) | Category URL key. For example, &#x60;electronics&#x60;, &#x60;clothing&#x60; or &#x60;books&#x60;. |
| `urlPath` - [`String`](#string) | Category URL path. For example, &#x60;/electronics/laptops&#x60;, &#x60;/clothing/shirts&#x60; or &#x60;/books/fiction&#x60;. |
| `count` - [`Int!`](#int) |  *(Deprecated: &#x27;CategoryView&#x27; is deprecated for use as a Bucket in &#x27;productSearch&#x27; facet (to be removed after Sep 1, 2024). Use &#x27;CategoryBucket&#x27; instead.)* |
| `title` - [`String!`](#string) |  *(Deprecated: &#x27;CategoryView&#x27; is deprecated for use as a Bucket in &#x27;productSearch&#x27; facet (to be removed after Sep 1, 2024). Use &#x27;CategoryBucket&#x27; instead.)* |

#### Example

```json
{
  "availableSortBy": ["abc123"],
  "children": ["abc123"],
  "defaultSortBy": "xyz789",
  "id": 4,
  "level": 987,
  "name": "xyz789",
  "parentId": "xyz789",
  "position": 987,
  "path": "abc123",
  "roles": ["abc123"],
  "urlKey": "abc123",
  "urlPath": "xyz789",
  "count": 123,
  "title": "abc123"
}
```

<HorizontalLine />

### CategoryViewInterface

Base interface defining essential category fields shared across all category views.

#### Fields

| Field Name | Description |
|------------|-------------|
| `availableSortBy` - [`[String]`](#string) | List of available sort by options. For example, name, size or position. |
| `defaultSortBy` - [`String`](#string) | Default sort by option. For example, name, size or position. |
| `id` - [`ID!`](#id) | Category ID. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. *(Deprecated: &#x27;CategoryView&#x27; is deprecated for use as a Bucket in &#x27;productSearch&#x27; facet (to be removed after Sep 1, 2024). Use &#x27;CategoryBucket&#x27; instead.)* |
| `level` - [`Int`](#int) | The level of the category. The root category is a level 1 category. For example, men -&gt; level 1, men/clothing -&gt; level 2, men/clothing/shorts -&gt; level 3 |
| `name` - [`String`](#string) | Category name. For example, &#x60;Electronics&#x60;, &#x60;Clothing&#x60; or &#x60;Books&#x60;. |
| `path` - [`String`](#string) | Category path. For example, &#x60;/electronics/laptops&#x60;, &#x60;/clothing/shirts&#x60; or &#x60;/books/fiction&#x60;. |
| `roles` - [`[String]`](#string) | List of roles for the category. For example, &#x60;show_on_plp&#x60;, &#x60;show_in_pdp&#x60; or &#x60;show_in_search&#x60;. |
| `urlKey` - [`String`](#string) | Category URL key. For example, &#x60;electronics&#x60;, &#x60;clothing&#x60; or &#x60;books&#x60;. |
| `urlPath` - [`String`](#string) | Category URL path. For example, &#x60;/electronics/laptops&#x60;, &#x60;/clothing/shirts&#x60; or &#x60;/books/fiction&#x60;. |

#### Possible Types

| CategoryViewInterface Types |
|----------------|
| [`CategoryView`](#categoryview) |

#### Example

```json
{
  "availableSortBy": ["abc123"],
  "defaultSortBy": "abc123",
  "id": 4,
  "level": 987,
  "name": "abc123",
  "path": "abc123",
  "roles": ["abc123"],
  "urlKey": "abc123",
  "urlPath": "abc123"
}
```

<HorizontalLine />

### CategoryViewV2

Base interface defining essential category fields shared across all category views.

#### Fields

| Field Name | Description |
|------------|-------------|
| `slug` - [`String!`](#string) | The unique URL-friendly identifier for the category. |
| `name` - [`String!`](#string) | Category name. For example, &#x60;Electronics&#x60;, &#x60;Clothing&#x60; or &#x60;Books&#x60;. |

#### Possible Types

| CategoryViewV2 Types |
|----------------|
| [`CategoryNavigationView`](#categorynavigationview) |
| [`CategoryProductView`](#categoryproductview) |
| [`CategoryTreeView`](#categorytreeview) |

#### Example

```json
{
  "slug": "abc123",
  "name": "abc123"
}
```

<HorizontalLine />

### ComplexProductView

Represents all product types, except simple products. Complex product prices are returned as a price range, because price values can vary based on selected options.

#### Fields

| Field Name | Description |
|------------|-------------|
| `addToCartAllowed` - [`Boolean`](#boolean) | A flag stating if the product can be added to cart *(Deprecated: This field is deprecated and will be removed.)* |
| `inStock` - [`Boolean`](#boolean) | A flag stating if the product is in stock *(Deprecated: This field is deprecated and will be removed.)* |
| `lowStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the Only X Left threshold. *(Deprecated: This field is deprecated and will be removed.)* |
| `attributes` - [`[ProductViewAttribute]`](#productviewattribute) | A list of merchant-defined attributes designated for the storefront. They can be filtered by roles and names. |
| `description` - [`String`](#string) | The detailed description of the product. |
| `id` - [`ID!`](#id) | The product ID, generated as a composite key, unique per locale. |
| `images` - [`[ProductViewImage]`](#productviewimage) | A list of images defined for the product. Possible values include &#x60;image&#x60;, &#x60;small_image&#x60; or &#x60;swatch&#x60;. |
| `videos` - [`[ProductViewVideo]`](#productviewvideo) | A list of videos defined for the product. |
| `lastModifiedAt` - [`DateTime`](#datetime) | Date and time when the product was last updated. |
| `metaDescription` - [`String`](#string) | A brief overview of the product for search results listings. |
| `metaKeyword` - [`String`](#string) | A comma-separated list of keywords that are visible only to search engines. |
| `metaTitle` - [`String`](#string) | A string that is displayed in the title bar and tab of the browser and in search results lists. |
| `name` - [`String`](#string) | Product name. |
| `inputOptions` - [`[ProductViewInputOption]`](#productviewinputoption) | A list of input options. *(Deprecated: This field is deprecated and will be removed.)* |
| `options` - [`[ProductViewOption]`](#productviewoption) | A list of selectable options. |
| `priceRange` - [`ProductViewPriceRange`](#productviewpricerange) | A range of possible prices for a complex product. |
| `shortDescription` - [`String`](#string) | A summary of the product. |
| `sku` - [`String`](#string) | A unique code used for identification of a product. |
| `externalId` - [`String`](#string) | External Id *(Deprecated: This field is deprecated and will be removed.)* |
| `url` - [`String`](#string) | Canonical URL of the product. *(Deprecated: This field is deprecated and will be removed.)* |
| `urlKey` - [`String`](#string) | The URL key of the product. |
| `links` - [`[ProductViewLink]`](#productviewlink) | A list of product links. Links are used to navigate from one product to another. |
| `categories` - [`[CategoryProductView!]`](#categoryproductview) | A list of categories in which the product is present. |
| `queryType` - [`String`](#string) | Indicates if the product was retrieved from the primary or the backup query |
| `visibility` - [`String`](#string) | Visibility setting of the product |

#### Example

```json
{
  "addToCartAllowed": true,
  "inStock": false,
  "lowStock": false,
  "attributes": [ProductViewAttribute],
  "description": "xyz789",
  "id": 4,
  "images": [ProductViewImage],
  "videos": [ProductViewVideo],
  "lastModifiedAt": "2007-12-03T10:15:30Z",
  "metaDescription": "xyz789",
  "metaKeyword": "abc123",
  "metaTitle": "abc123",
  "name": "xyz789",
  "inputOptions": [ProductViewInputOption],
  "options": [ProductViewOption],
  "priceRange": ProductViewPriceRange,
  "shortDescription": "xyz789",
  "sku": "xyz789",
  "externalId": "abc123",
  "url": "abc123",
  "urlKey": "abc123",
  "links": [ProductViewLink],
  "categories": [CategoryProductView],
  "queryType": "abc123",
  "visibility": "abc123"
}
```

<HorizontalLine />

### CurrentProductInput

Attributes of the product currently being viewed on PDP

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `sku` - [`String`](#string) | SKU of the current product |
| `price` - [`Float`](#float) | Resolved display price of the current product (specialPrice ?? regularPrice) |

#### Example

```json
{"sku": "abc123", "price": 123.45}
```

<HorizontalLine />

### DateTime

A slightly refined version of RFC-3339 compliant DateTime Scalar

#### Example

```json
"2007-12-03T10:15:30Z"
```

<HorizontalLine />

### FilterableInSearchAttribute

Contains product attributes that can be used for filtering in a `productSearch` query

#### Fields

| Field Name | Description |
|------------|-------------|
| `attribute` - [`String!`](#string) | The unique identifier for an attribute code. This value should be in lowercase letters and without spaces |
| `frontendInput` - [`String`](#string) | Indicates how field rendered on storefront |
| `label` - [`String`](#string) | The display name assigned to the attribute |
| `numeric` - [`Boolean`](#boolean) | Indicates whether this attribute has a numeric value, such as a price or integer |

#### Example

```json
{
  "attribute": "abc123",
  "frontendInput": "xyz789",
  "label": "xyz789",
  "numeric": true
}
```

<HorizontalLine />

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

#### Example

```json
123.45
```

<HorizontalLine />

### Highlight

An object that provides highlighted text for matched words

#### Fields

| Field Name | Description |
|------------|-------------|
| `attribute` - [`String!`](#string) | The product attribute that contains a match for the search phrase |
| `matched_words` - [`[String]!`](#string) | An array of strings |
| `value` - [`String!`](#string) | The matched text, enclosed within emphasis tags |

#### Example

```json
{
  "attribute": "xyz789",
  "matched_words": ["xyz789"],
  "value": "abc123"
}
```

<HorizontalLine />

### ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

#### Example

```json
"4"
```

<HorizontalLine />

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

#### Example

```json
123
```

<HorizontalLine />

### JSON

A JSON scalar

#### Example

```json
{}
```

<HorizontalLine />

### PageInfo

Provides pagination information for navigating through paginated result sets.

#### Fields

| Field Name | Description |
|------------|-------------|
| `currentPage` - [`Int!`](#int) | The current page number (1-based indexing). |
| `pageSize` - [`Int!`](#int) | The number of items per page. |
| `totalPages` - [`Int!`](#int) | The total number of pages available. |

#### Example

```json
{"currentPage": 987, "pageSize": 123, "totalPages": 123}
```

<HorizontalLine />

### Price

Defines the price of a simple product or a part of a price range for a complex product. It can include a list of price adjustments.

#### Fields

| Field Name | Description |
|------------|-------------|
| `adjustments` - [`[PriceAdjustment]`](#priceadjustment) | The signed value of the price adjustment (positive for markup, negative for markdown). |
| `amount` - [`ProductViewMoney`](#productviewmoney) | Contains the monetary value and currency code of a product. |

#### Example

```json
{
  "adjustments": [PriceAdjustment],
  "amount": ProductViewMoney
}
```

<HorizontalLine />

### PriceAdjustment

Specifies the amount and type of price adjustment.

#### Fields

| Field Name | Description |
|------------|-------------|
| `amount` - [`Float`](#float) | The amount of the price adjustment. |
| `code` - [`String`](#string) | Identifies the type of price adjustment. |

#### Example

```json
{"amount": 123.45, "code": "xyz789"}
```

<HorizontalLine />

### ProductSearchItem

A single product returned by the query

#### Fields

| Field Name | Description |
|------------|-------------|
| `applied_query_rule` - [`AppliedQueryRule`](#appliedqueryrule) | The query rule type that was applied to this product, if any (in preview mode only, returns null otherwise) |
| `highlights` - [`[Highlight]`](#highlight) | An object that provides highlighted text for matched words |
| `productView` - [`ProductView`](#productview) | Contains a product view |

#### Example

```json
{
  "applied_query_rule": AppliedQueryRule,
  "highlights": [Highlight],
  "productView": ProductView
}
```

<HorizontalLine />

### ProductSearchResponse

Contains the output of a `productSearch` query

#### Fields

| Field Name | Description |
|------------|-------------|
| `facets` - [`[Aggregation]`](#aggregation) | Details about the static and dynamic facets relevant to the search |
| `items` - [`[ProductSearchItem]`](#productsearchitem) | An array of products returned by the query |
| `page_info` - [`SearchResultPageInfo`](#searchresultpageinfo) | Information for rendering pages of search results |
| `related_terms` - [`[String]`](#string) | An array of strings that might include merchant-defined synonyms |
| `suggestions` - [`[String]`](#string) | An array of strings that include the names of products and categories that exist in the catalog that are similar to the search query |
| `total_count` - [`Int`](#int) | The total number of products returned that matched the query |
| `warnings` - [`[ProductSearchWarning]`](#productsearchwarning) | An array of warning messages for validation issues (e.g., sort parameter ignored due to missing categoryPath) |

#### Example

```json
{
  "facets": [Aggregation],
  "items": [ProductSearchItem],
  "page_info": SearchResultPageInfo,
  "related_terms": ["xyz789"],
  "suggestions": ["abc123"],
  "total_count": 987,
  "warnings": [ProductSearchWarning]
}
```

<HorizontalLine />

### ProductSearchSortInput

The product attribute to sort on

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `attribute` - [`String!`](#string) | The attribute code of a product attribute |
| `direction` - [`SortEnum!`](#sortenum) | ASC (ascending) or DESC (descending) |

#### Example

```json
{"attribute": "abc123", "direction": "ASC"}
```

<HorizontalLine />

### ProductSearchWarning

Structured warning with code and message for easier client handling

#### Fields

| Field Name | Description |
|------------|-------------|
| `code` - [`String!`](#string) | Error code for programmatic handling (e.g., EMPTY_CATEGORY_PATH) |
| `message` - [`String!`](#string) | Human-readable message describing the warning |

#### Example

```json
{
  "code": "xyz789",
  "message": "abc123"
}
```

<HorizontalLine />

### ProductView

Defines the product fields available to the SimpleProductView and ComplexProductView types.

#### Fields

| Field Name | Description |
|------------|-------------|
| `addToCartAllowed` - [`Boolean`](#boolean) | A flag stating if the product can be added to cart *(Deprecated: This field is deprecated and will be removed.)* |
| `inStock` - [`Boolean`](#boolean) | A flag stating if the product is in stock *(Deprecated: This field is deprecated and will be removed.)* |
| `lowStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the Only X Left threshold. *(Deprecated: This field is deprecated and will be removed.)* |
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
| `inputOptions` - [`[ProductViewInputOption]`](#productviewinputoption) | A list of input options. For example, a text field, a number field or a date field. *(Deprecated: This field is deprecated and will be removed.)* |
| `sku` - [`String`](#string) | A unique code used for identification of a product. |
| `externalId` - [`String`](#string) | External Id *(Deprecated: This field is deprecated and will be removed.)* |
| `url` - [`String`](#string) | Canonical URL of the product. *(Deprecated: This field is deprecated and will be removed.)* |
| `urlKey` - [`String`](#string) | The URL key of the product. This is a unique identifier for the product that is used to create the product&#x27;s URL. |
| `links` - [`[ProductViewLink]`](#productviewlink) | A list of product links. For example, related, up-sell, and cross-sell links. |
| `categories` - [`[CategoryProductView!]`](#categoryproductview) | A list of categories in which the product is present. |
| `queryType` - [`String`](#string) | Indicates if the product was retrieved from the primary or the backup query |
| `visibility` - [`String`](#string) | Visibility setting of the product |

#### Possible Types

| ProductView Types |
|----------------|
| [`ComplexProductView`](#complexproductview) |
| [`SimpleProductView`](#simpleproductview) |

#### Example

```json
{
  "addToCartAllowed": true,
  "inStock": false,
  "lowStock": true,
  "attributes": [ProductViewAttribute],
  "description": "xyz789",
  "id": "4",
  "images": [ProductViewImage],
  "videos": [ProductViewVideo],
  "lastModifiedAt": "2007-12-03T10:15:30Z",
  "metaDescription": "abc123",
  "metaKeyword": "xyz789",
  "metaTitle": "abc123",
  "name": "xyz789",
  "shortDescription": "xyz789",
  "inputOptions": [ProductViewInputOption],
  "sku": "abc123",
  "externalId": "abc123",
  "url": "xyz789",
  "urlKey": "xyz789",
  "links": [ProductViewLink],
  "categories": [CategoryProductView],
  "queryType": "xyz789",
  "visibility": "abc123"
}
```

<HorizontalLine />

### ProductViewAttribute

A container for customer-defined attributes that are displayed the storefront.

#### Fields

| Field Name | Description |
|------------|-------------|
| `label` - [`String`](#string) | Label of the attribute. |
| `name` - [`String!`](#string) | Name of an attribute code. For example, &#x60;color&#x60;, &#x60;size&#x60; or &#x60;material&#x60; |
| `roles` - [`[String]`](#string) | Roles designated for an attribute on the storefront. For example, &#x60;show_on_plp&#x60;, &#x60;show_in_pdp&#x60; or &#x60;show_in_search&#x60; |
| `value` - [`JSON`](#json) | Attribute value, arbitrary of type. For example, &#x60;red&#x60;, &#x60;blue&#x60; or &#x60;green&#x60; |

#### Example

```json
{
  "label": "abc123",
  "name": "xyz789",
  "roles": ["xyz789"],
  "value": {}
}
```

<HorizontalLine />

### ProductViewCurrency

The list of supported currency codes.

#### Values

| Enum Value | Description |
|------------|-------------|
| `AED` |  |
| `AFN` |  |
| `ALL` |  |
| `AMD` |  |
| `ANG` |  |
| `AOA` |  |
| `ARS` |  |
| `AUD` |  |
| `AWG` |  |
| `AZM` |  |
| `AZN` |  |
| `BAM` |  |
| `BBD` |  |
| `BDT` |  |
| `BGN` |  |
| `BHD` |  |
| `BIF` |  |
| `BMD` |  |
| `BND` |  |
| `BOB` |  |
| `BRL` |  |
| `BSD` |  |
| `BTN` |  |
| `BUK` |  |
| `BWP` |  |
| `BYN` |  |
| `BZD` |  |
| `CAD` |  |
| `CDF` |  |
| `CHE` |  |
| `CHF` |  |
| `CHW` |  |
| `CLP` |  |
| `CNY` |  |
| `COP` |  |
| `CRC` |  |
| `CUP` |  |
| `CVE` |  |
| `CZK` |  |
| `DJF` |  |
| `DKK` |  |
| `DOP` |  |
| `DZD` |  |
| `EEK` |  |
| `EGP` |  |
| `ERN` |  |
| `ETB` |  |
| `EUR` |  |
| `FJD` |  |
| `FKP` |  |
| `GBP` |  |
| `GEK` |  |
| `GEL` |  |
| `GHS` |  |
| `GIP` |  |
| `GMD` |  |
| `GNF` |  |
| `GQE` |  |
| `GTQ` |  |
| `GYD` |  |
| `HKD` |  |
| `HNL` |  |
| `HRK` |  |
| `HTG` |  |
| `HUF` |  |
| `IDR` |  |
| `ILS` |  |
| `INR` |  |
| `IQD` |  |
| `IRR` |  |
| `ISK` |  |
| `JMD` |  |
| `JOD` |  |
| `JPY` |  |
| `KES` |  |
| `KGS` |  |
| `KHR` |  |
| `KMF` |  |
| `KPW` |  |
| `KRW` |  |
| `KWD` |  |
| `KYD` |  |
| `KZT` |  |
| `LAK` |  |
| `LBP` |  |
| `LKR` |  |
| `LRD` |  |
| `LSL` |  |
| `LSM` |  |
| `LTL` |  |
| `LVL` |  |
| `LYD` |  |
| `MAD` |  |
| `MDL` |  |
| `MGA` |  |
| `MKD` |  |
| `MMK` |  |
| `MNT` |  |
| `MOP` |  |
| `MRO` |  |
| `MUR` |  |
| `MVR` |  |
| `MWK` |  |
| `MXN` |  |
| `MYR` |  |
| `MZN` |  |
| `NAD` |  |
| `NGN` |  |
| `NIC` |  |
| `NOK` |  |
| `NPR` |  |
| `NZD` |  |
| `OMR` |  |
| `PAB` |  |
| `PEN` |  |
| `PGK` |  |
| `PHP` |  |
| `PKR` |  |
| `PLN` |  |
| `PYG` |  |
| `QAR` |  |
| `RHD` |  |
| `ROL` |  |
| `RON` |  |
| `RSD` |  |
| `RUB` |  |
| `RWF` |  |
| `SAR` |  |
| `SBD` |  |
| `SCR` |  |
| `SDG` |  |
| `SEK` |  |
| `SGD` |  |
| `SHP` |  |
| `SKK` |  |
| `SLL` |  |
| `SOS` |  |
| `SRD` |  |
| `STD` |  |
| `SVC` |  |
| `SYP` |  |
| `SZL` |  |
| `THB` |  |
| `TJS` |  |
| `TMM` |  |
| `TND` |  |
| `TOP` |  |
| `TRL` |  |
| `TRY` |  |
| `TTD` |  |
| `TWD` |  |
| `TZS` |  |
| `UAH` |  |
| `UGX` |  |
| `USD` |  |
| `UYU` |  |
| `UZS` |  |
| `VEB` |  |
| `VEF` |  |
| `VND` |  |
| `VUV` |  |
| `WST` |  |
| `XCD` |  |
| `XOF` |  |
| `XPF` |  |
| `YER` |  |
| `ZAR` |  |
| `ZMK` |  |
| `ZWD` |  |
| `NONE` |  |

#### Example

```json
""AED""
```

<HorizontalLine />

### ProductViewImage

Contains details about a product image.

#### Fields

| Field Name | Description |
|------------|-------------|
| `label` - [`String`](#string) | The display label of the product image. For example, &#x60;Main Image&#x60;, &#x60;Small Image&#x60; or &#x60;Thumbnail Image&#x60; |
| `roles` - [`[String]`](#string) | A list that describes how the image is used. Can be &#x60;image&#x60;, &#x60;small_image&#x60; or &#x60;thumbnail&#x60; |
| `url` - [`String!`](#string) | The URL to the product image. For example, &#x60;https://example.com/image.jpg&#x60;. |

#### Example

```json
{
  "label": "abc123",
  "roles": ["xyz789"],
  "url": "abc123"
}
```

<HorizontalLine />

### ProductViewInputOption

Product options provide a way to configure products by making selections of particular option values. Selecting one or many options will point to a simple product.

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID`](#id) | The ID of an option value. For example, &#x60;123&#x60; for the first option value, &#x60;456&#x60; for the second option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, &#x60;Red&#x60;, &#x60;Blue&#x60; or &#x60;Green&#x60; |
| `required` - [`Boolean`](#boolean) | Indicates whether this input option is required. |
| `type` - [`String`](#string) | The type of data entry. For example, &#x60;text&#x60;, &#x60;number&#x60; or &#x60;date&#x60; |
| `markupAmount` - [`Float`](#float) | The percentage the prices is marked up or down. A positive value, such as &#x60;10.00&#x60;, indicates the product is marked up 10%. A negative value, such as &#x60;-10.00&#x60;, indicates the price is marked down 10%. |
| `suffix` - [`String`](#string) | SKU suffix to add to the product. For example, &#x60;-red&#x60;, &#x60;-blue&#x60; or &#x60;-green&#x60; |
| `sortOrder` - [`Int`](#int) | Sort order for the input option. For example, &#x60;1&#x60; for the first input option, &#x60;2&#x60; for the second input option. |
| `range` - [`ProductViewInputOptionRange`](#productviewinputoptionrange) | The range of values for the input option. For example, if the input option is a text field, the range represents the number of characters. |
| `imageSize` - [`ProductViewInputOptionImageSize`](#productviewinputoptionimagesize) | The size of the image for the input option. |
| `fileExtensions` - [`String`](#string) | The file extensions allowed for the image. For example, &#x60;jpg&#x60;, &#x60;png&#x60;, &#x60;gif&#x60;, or &#x60;svg&#x60; |

#### Example

```json
{
  "id": 4,
  "title": "xyz789",
  "required": true,
  "type": "xyz789",
  "markupAmount": 987.65,
  "suffix": "xyz789",
  "sortOrder": 987,
  "range": ProductViewInputOptionRange,
  "imageSize": ProductViewInputOptionImageSize,
  "fileExtensions": "xyz789"
}
```

<HorizontalLine />

### ProductViewInputOptionImageSize

Dimensions of the image associated with the input option.

#### Fields

| Field Name | Description |
|------------|-------------|
| `width` - [`Int`](#int) | The width of the image in pixels. For example, &#x60;100&#x60; for a 100px width. |
| `height` - [`Int`](#int) | The height of the image, in pixels. For example, &#x60;100&#x60; for a 100px height. |

#### Example

```json
{"width": 123, "height": 987}
```

<HorizontalLine />

### ProductViewInputOptionRange

Lists the value range associated with a `ProductViewInputOption`. For example, if the input option is a text field, the range represents the number of characters.

#### Fields

| Field Name | Description |
|------------|-------------|
| `from` - [`Float`](#float) | The starting value of the range. For example, if the input option is a text field, the starting value represents the minimum number of characters. |
| `to` - [`Float`](#float) | The ending value of the range. For example, if the input option is a text field, the ending value represents the maximum number of characters. |

#### Example

```json
{"from": 123.45, "to": 987.65}
```

<HorizontalLine />

### ProductViewLink

The product link type. Contains details about product links for related products and cross selling. For example, `related`, `up_sell` or `cross_sell`

#### Fields

| Field Name | Description |
|------------|-------------|
| `product` - [`ProductView!`](#productview) | Contains the details of the product found in the link. |
| `linkTypes` - [`[String!]!`](#string) | Stores the types of the links with this product. |

#### Example

```json
{
  "product": ProductView,
  "linkTypes": ["xyz789"]
}
```

<HorizontalLine />

### ProductViewMoney

Defines a monetary value, including a numeric value and a currency code.

#### Fields

| Field Name | Description |
|------------|-------------|
| `currency` - [`ProductViewCurrency`](#productviewcurrency) | A three-letter currency code, such as USD or EUR. |
| `value` - [`Float`](#float) | A number expressing a monetary value. |

#### Example

```json
{"currency": "AED", "value": 987.65}
```

<HorizontalLine />

### ProductViewOption

Product options provide a way to configure products by making selections of particular option values. Selecting one or many options will point to a simple product.

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID`](#id) | The ID of the option. For example, &#x60;123&#x60; for the first option, &#x60;456&#x60; for the second option. |
| `multi` - [`Boolean`](#boolean) | Indicates whether the option allows multiple choices. The value is &#x60;true&#x60; for a multi-select option, &#x60;false&#x60; for a single-select option. |
| `required` - [`Boolean`](#boolean) | Indicates whether the option must be selected. |
| `title` - [`String`](#string) | The display name of the option. For example, &#x60;Color&#x60;, &#x60;Size&#x60; or &#x60;Material&#x60; |
| `values` - [`[ProductViewOptionValue!]`](#productviewoptionvalue) | List of available option values. For example, &#x60;Red&#x60;, &#x60;Blue&#x60; or &#x60;Green&#x60; |

#### Example

```json
{
  "id": 4,
  "multi": false,
  "required": true,
  "title": "abc123",
  "values": [ProductViewOptionValue]
}
```

<HorizontalLine />

### ProductViewOptionValue

Defines the product fields available to the ProductViewOptionValueProduct and ProductViewOptionValueConfiguration types.

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID`](#id) | The ID of an option value. |
| `title` - [`String`](#string) | The display name of the option value. |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the out-of-stock threshold. |

#### Possible Types

| ProductViewOptionValue Types |
|----------------|
| [`ProductViewOptionValueConfiguration`](#productviewoptionvalueconfiguration) |
| [`ProductViewOptionValueProduct`](#productviewoptionvalueproduct) |
| [`ProductViewOptionValueSwatch`](#productviewoptionvalueswatch) |

#### Example

```json
{
  "id": "4",
  "title": "abc123",
  "inStock": false
}
```

<HorizontalLine />

### ProductViewOptionValueConfiguration

An implementation of ProductViewOptionValue for configuration values.

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID`](#id) | The ID of an option value. For example, &#x60;123&#x60; for the first option value, &#x60;456&#x60; for the second option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, &#x60;Red&#x60;, &#x60;Blue&#x60; or &#x60;Green&#x60; |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product option value has reached the out-of-stock threshold. |

#### Example

```json
{
  "id": 4,
  "title": "abc123",
  "inStock": true
}
```

<HorizontalLine />

### ProductViewOptionValueProduct

An implementation of ProductViewOptionValue that adds details about a simple product.

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID`](#id) | The ID of an option value. For example, &#x60;123&#x60; for the first option value, &#x60;456&#x60; for the second option value. |
| `isDefault` - [`Boolean`](#boolean) | Indicates whether the option value is the default. |
| `product` - [`SimpleProductView`](#simpleproductview) | Details about a simple product. For example, a product with a SKU of &#x60;123&#x60;, a name of &#x60;Product 1&#x60;, a price of &#x60;100.00&#x60;. |
| `quantity` - [`Float`](#float) | Default quantity of an option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, &#x60;Red&#x60;, &#x60;Blue&#x60; or &#x60;Green&#x60; |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product option value has reached the out-of-stock threshold. |

#### Example

```json
{
  "id": "4",
  "isDefault": false,
  "product": SimpleProductView,
  "quantity": 987.65,
  "title": "abc123",
  "inStock": true
}
```

<HorizontalLine />

### ProductViewOptionValueSwatch

An implementation of ProductViewOptionValueSwatch for swatches.

#### Fields

| Field Name | Description |
|------------|-------------|
| `id` - [`ID`](#id) | The ID of an option value. For example, &#x60;123&#x60; for the first option value, &#x60;456&#x60; for the second option value. |
| `title` - [`String`](#string) | The display name of the option value. For example, &#x60;Red&#x60;, &#x60;Blue&#x60; or &#x60;Green&#x60; |
| `type` - [`SwatchType`](#swatchtype) | Indicates the type of the swatch. |
| `value` - [`String`](#string) | The value of the swatch depending on the type of the swatch. |
| `inStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product option value has reached the out-of-stock threshold. |

#### Example

```json
{
  "id": 4,
  "title": "xyz789",
  "type": "TEXT",
  "value": "abc123",
  "inStock": true
}
```

<HorizontalLine />

### ProductViewPrice

Base product price view. Contains the final price after discounts, the regular price, and the list of tier prices.

#### Fields

| Field Name | Description |
|------------|-------------|
| `final` - [`Price`](#price) | Price value after discounts, excluding personalized promotions. |
| `regular` - [`Price`](#price) | Base product price specified by the merchant. |
| `tiers` - [`[ProductViewTierPrice]`](#productviewtierprice) | Volume based pricing. |
| `roles` - [`[String]`](#string) | Price roles, stating if the price should be visible or hidden. For example, &#x60;show_on_plp&#x60;, &#x60;show_in_pdp&#x60; or &#x60;show_in_search&#x60; |

#### Example

```json
{
  "final": Price,
  "regular": Price,
  "tiers": [ProductViewTierPrice],
  "roles": ["xyz789"]
}
```

<HorizontalLine />

### ProductViewPriceRange

The minimum and maximum price of a complex product.

#### Fields

| Field Name | Description |
|------------|-------------|
| `maximum` - [`ProductViewPrice`](#productviewprice) | Maximum price. |
| `minimum` - [`ProductViewPrice`](#productviewprice) | Minimum price. |

#### Example

```json
{
  "maximum": ProductViewPrice,
  "minimum": ProductViewPrice
}
```

<HorizontalLine />

### ProductViewTierCondition

#### Types

| Union Types |
|-------------|
| [`ProductViewTierRangeCondition`](#productviewtierrangecondition) |
| [`ProductViewTierExactMatchCondition`](#productviewtierexactmatchcondition) |

#### Example

```json
ProductViewTierRangeCondition
```

<HorizontalLine />

### ProductViewTierExactMatchCondition

Minimum quantity (inclusive) required to activate this tier price. For example, a value of `10` means this tier applies when 10 or more items are purchased.

#### Fields

| Field Name | Description |
|------------|-------------|
| `in` - [`[Float]`](#float) | Exact quantity values that activate this tier price. For example, &#x60;[5, 10]&#x60; means the tier applies only when the purchased quantity is exactly 5 or exactly 10. |

#### Example

```json
{"in": [987.65]}
```

<HorizontalLine />

### ProductViewTierPrice

The discounted price that applies when the quantity conditions in `quantity` are satisfied. Contains the monetary amount and any price adjustments applied to this tier.

#### Fields

| Field Name | Description |
|------------|-------------|
| `tier` - [`Price`](#price) | The discounted price that applies when the quantity conditions in &#x60;quantity&#x60; are satisfied. Contains the monetary amount and any price adjustments applied to this tier. |
| `quantity` - [`[ProductViewTierCondition!]!`](#productviewtiercondition) | The quantity conditions that must be met to activate the tier price. For example, &#x60;10&#x60; for a quantity of 10 or &#x60;20&#x60; for a quantity of 20. |

#### Example

```json
{
  "tier": Price,
  "quantity": [ProductViewTierRangeCondition]
}
```

<HorizontalLine />

### ProductViewTierRangeCondition

Minimum quantity (inclusive) required to activate this tier price. For example, a value of `10` means this tier applies when 10 or more items are purchased. Maximum quantity (exclusive) required to activate this tier price. For example, a value of `20` means this tier applies when less than 20 items are purchased.

#### Fields

| Field Name | Description |
|------------|-------------|
| `gte` - [`Float`](#float) | The minimum quantity that must be purchased to activate the tier price. Must be greater than or equal to the value in &#x60;gte&#x60;. |
| `lt` - [`Float`](#float) | Maximum quantity (exclusive) for this tier price. For example, a value of &#x60;20&#x60; means this tier applies only when fewer than 20 items are purchased. |

#### Example

```json
{"gte": 987.65, "lt": 987.65}
```

<HorizontalLine />

### ProductViewVariant

Represents a product variant.

#### Fields

| Field Name | Description |
|------------|-------------|
| `selections` - [`[String!]`](#string) | List of option values that make up the variant. For example, &#x60;red&#x60;, &#x60;blue&#x60; or &#x60;green&#x60; |
| `product` - [`ProductView`](#productview) | Product corresponding to the variant. For example, a product with a SKU of &#x60;123&#x60;, a name of &#x60;Product 1&#x60;, a price of &#x60;100.00&#x60;. |

#### Example

```json
{
  "selections": ["xyz789"],
  "product": ProductView
}
```

<HorizontalLine />

### ProductViewVariantResults

Represents the results of a product variant search.

#### Fields

| Field Name | Description |
|------------|-------------|
| `variants` - [`[ProductViewVariant]!`](#productviewvariant) | List of product variants. For example, a variant with a selection of &#x60;red&#x60;, &#x60;blue&#x60; or &#x60;green&#x60; |
| `cursor` - [`String`](#string) | Pagination cursor. For example, &#x60;123&#x60; for the first variant, &#x60;456&#x60; for the second variant. |

#### Example

```json
{
  "variants": [ProductViewVariant],
  "cursor": "abc123"
}
```

<HorizontalLine />

### ProductViewVideo

Contains details about a product video. For example, a video of the product being used or a video of the product being assembled.

#### Fields

| Field Name | Description |
|------------|-------------|
| `preview` - [`ProductViewImage`](#productviewimage) | Preview image for the video. For example, a screenshot of the video. |
| `url` - [`String!`](#string) | The URL to the product video. For example, &#x60;https://example.com/video.mp4&#x60; or &#x60;https://example.com/video.webm&#x60; |
| `description` - [`String`](#string) | Description of the product video. For example, &#x60;A video of the product being used&#x60; or &#x60;A video of the product being assembled&#x60; |
| `title` - [`String`](#string) | The title of the product video. For example, &#x60;Product Video&#x60; or &#x60;Product Assembly Video&#x60; |

#### Example

```json
{
  "preview": ProductViewImage,
  "url": "abc123",
  "description": "abc123",
  "title": "xyz789"
}
```

<HorizontalLine />

### PurchaseHistory

User purchase history

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `date` - [`DateTime`](#datetime) |  |
| `items` - [`[String]!`](#string) |  |

#### Example

```json
{
  "date": "2007-12-03T10:15:30Z",
  "items": ["xyz789"]
}
```

<HorizontalLine />

### QueryContextInput

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `customerGroup` - [`String!`](#string) | The customer group code. Field reserved for future use. Currently, passing this field will have no impact on search results, that is, the search results will be for &quot;Not logged in&quot; customer |
| `userViewHistory` - [`[ViewHistoryInput!]`](#viewhistoryinput) | User view history with timestamp |

#### Example

```json
{
  "customerGroup": "abc123",
  "userViewHistory": [ViewHistoryInput]
}
```

<HorizontalLine />

### RangeBucket

For use on numeric product fields

#### Fields

| Field Name | Description |
|------------|-------------|
| `count` - [`Int!`](#int) | The number of items in the bucket |
| `from` - [`Float!`](#float) | The minimum amount in a price range |
| `title` - [`String!`](#string) | The display text defining the price range |
| `to` - [`Float`](#float) | The maximum amount in a price range |

#### Example

```json
{
  "count": 987,
  "from": 987.65,
  "title": "abc123",
  "to": 987.65
}
```

<HorizontalLine />

### RecommendationUnit

Recommendation Unit containing product and other details

#### Fields

| Field Name | Description |
|------------|-------------|
| `displayOrder` - [`Int`](#int) | Order in which recommendation units are displayed |
| `pageType` - [`String`](#string) | Page type |
| `productsView` - [`[ProductView]`](#productview) | List of product view |
| `storefrontLabel` - [`String`](#string) | Storefront label to be displayed on the storefront |
| `totalProducts` - [`Int`](#int) | Total products returned in recommedations |
| `typeId` - [`String`](#string) | Type of recommendation |
| `unitId` - [`String`](#string) | Id of the preconfigured unit |
| `unitName` - [`String`](#string) | Name of the preconfigured unit |
| `userError` - [`String`](#string) | User error message if the unit could not be fully resolved (e.g. required currentSku was not provided) |

#### Example

```json
{
  "displayOrder": 123,
  "pageType": "xyz789",
  "productsView": [ProductView],
  "storefrontLabel": "xyz789",
  "totalProducts": 123,
  "typeId": "abc123",
  "unitId": "abc123",
  "unitName": "abc123",
  "userError": "xyz789"
}
```

<HorizontalLine />

### Recommendations

Recommendations response

#### Fields

| Field Name | Description |
|------------|-------------|
| `results` - [`[RecommendationUnit]`](#recommendationunit) | List of rec units with products recommended |
| `totalResults` - [`Int`](#int) | total number of rec units for which recommendations are returned |

#### Example

```json
{"results": [RecommendationUnit], "totalResults": 987}
```

<HorizontalLine />

### ScalarBucket

For use on string and other scalar product fields

#### Fields

| Field Name | Description |
|------------|-------------|
| `count` - [`Int!`](#int) | The number of items in the bucket |
| `id` - [`ID!`](#id) | An identifier that can be used for filtering. It may contain non-human readable data |
| `title` - [`String!`](#string) | The display text for the scalar value |

#### Example

```json
{
  "count": 123,
  "id": "4",
  "title": "xyz789"
}
```

<HorizontalLine />

### SearchCategoryResultPage

Represents a paginated result set of category search results.

#### Fields

| Field Name | Description |
|------------|-------------|
| `items` - [`[CategoryTreeView!]!`](#categorytreeview) | The list of categories matching the search criteria. |
| `totalCount` - [`Int!`](#int) | The total number of categories matching the search criteria across all pages. |
| `pageInfo` - [`PageInfo!`](#pageinfo) | Pagination information for navigating through results. |

#### Example

```json
{
  "items": [CategoryTreeView],
  "totalCount": 987,
  "pageInfo": PageInfo
}
```

<HorizontalLine />

### SearchClauseInput

A product attribute to filter on

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `attribute` - [`String!`](#string) | The attribute code of a product attribute |
| `contains` - [`String`](#string) | attribute value should contain the specified string |
| `eq` - [`String`](#string) | A string value to filter on |
| `in` - [`[String]`](#string) | An array of string values to filter on |
| `range` - [`SearchRangeInput`](#searchrangeinput) | A range of numeric values to filter on |
| `startsWith` - [`String`](#string) | attribute value should start with the specified string |

#### Example

```json
{
  "attribute": "xyz789",
  "contains": "abc123",
  "eq": "abc123",
  "in": ["abc123"],
  "range": SearchRangeInput,
  "startsWith": "xyz789"
}
```

<HorizontalLine />

### SearchRangeInput

A range of numeric values for use in a search

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `from` - [`Float`](#float) | The minimum value to filter on. If not specified, the value of &#x60;0&#x60; is applied |
| `to` - [`Float`](#float) | The maximum value to filter on |

#### Example

```json
{"from": 123.45, "to": 123.45}
```

<HorizontalLine />

### SearchResultPageInfo

Provides navigation for the query response.

#### Fields

| Field Name | Description |
|------------|-------------|
| `current_page` - [`Int`](#int) | The specific page to return. |
| `page_size` - [`Int`](#int) | The maximum number of items to return per page of results. |
| `total_pages` - [`Int`](#int) | The total number of pages in the response. |

#### Example

```json
{"current_page": 123, "page_size": 987, "total_pages": 987}
```

<HorizontalLine />

### SimpleProductView

Represents a single-SKU product without selectable variants. Because there are no variant combinations, pricing is returned as a single price (not a price range).

#### Fields

| Field Name | Description |
|------------|-------------|
| `addToCartAllowed` - [`Boolean`](#boolean) | A flag stating if the product can be added to cart *(Deprecated: This field is deprecated and will be removed.)* |
| `inStock` - [`Boolean`](#boolean) | A flag stating if the product is in stock *(Deprecated: This field is deprecated and will be removed.)* |
| `lowStock` - [`Boolean`](#boolean) | Indicates whether the remaining quantity of the product has reached the Only X Left threshold. *(Deprecated: This field is deprecated and will be removed.)* |
| `attributes` - [`[ProductViewAttribute]`](#productviewattribute) | A list of merchant-defined attributes designated for the storefront. They can be filtered by names and roles. |
| `description` - [`String`](#string) | The detailed description of the product. |
| `id` - [`ID!`](#id) | The product ID, generated as a composite key, unique per locale. |
| `images` - [`[ProductViewImage]`](#productviewimage) | A list of images defined for the product. Possible values include &#x60;image&#x60;, &#x60;small_image&#x60;, and &#x60;swatch&#x60;. |
| `videos` - [`[ProductViewVideo]`](#productviewvideo) | A list of videos defined for the product. |
| `inputOptions` - [`[ProductViewInputOption]`](#productviewinputoption) | A list of input options. For example, a text field, a number field or a date field. *(Deprecated: This field is deprecated and will be removed.)* |
| `lastModifiedAt` - [`DateTime`](#datetime) | Date and time when the product was last updated. |
| `metaDescription` - [`String`](#string) | A brief overview of the product for search results listings. |
| `metaKeyword` - [`String`](#string) | A comma-separated list of keywords that are visible only to search engines. |
| `metaTitle` - [`String`](#string) | A string that is displayed in the title bar and tab of the browser and in search results lists. |
| `name` - [`String`](#string) | Product name. |
| `price` - [`ProductViewPrice`](#productviewprice) | Base product price view. |
| `shortDescription` - [`String`](#string) | A summary of the product. |
| `sku` - [`String`](#string) | A unique code used for identification of a product. |
| `externalId` - [`String`](#string) | External Id. For example, &#x60;123&#x60;, &#x60;456&#x60; or &#x60;789&#x60;. *(Deprecated: This field is deprecated and will be removed.)* |
| `url` - [`String`](#string) | Canonical URL of the product. For example, &#x60;https://example.com/product-1&#x60; or &#x60;https://example.com/product-2&#x60;. *(Deprecated: This field is deprecated and will be removed.)* |
| `urlKey` - [`String`](#string) | The URL key of the product. For example, &#x60;product-1&#x60;, &#x60;product-2&#x60; or &#x60;product-3&#x60;. |
| `links` - [`[ProductViewLink]`](#productviewlink) | A list of product links. For example, a related product, an up-sell product or a cross-sell product. |
| `categories` - [`[CategoryProductView!]`](#categoryproductview) | A list of categories in which the product is present. Categories are used to group products by category. |
| `queryType` - [`String`](#string) | Indicates if the product was retrieved from the primary or the backup query |
| `visibility` - [`String`](#string) | Visibility setting of the product |

#### Example

```json
{
  "addToCartAllowed": false,
  "inStock": true,
  "lowStock": true,
  "attributes": [ProductViewAttribute],
  "description": "xyz789",
  "id": "4",
  "images": [ProductViewImage],
  "videos": [ProductViewVideo],
  "inputOptions": [ProductViewInputOption],
  "lastModifiedAt": "2007-12-03T10:15:30Z",
  "metaDescription": "abc123",
  "metaKeyword": "abc123",
  "metaTitle": "abc123",
  "name": "xyz789",
  "price": ProductViewPrice,
  "shortDescription": "xyz789",
  "sku": "xyz789",
  "externalId": "abc123",
  "url": "xyz789",
  "urlKey": "abc123",
  "links": [ProductViewLink],
  "categories": [CategoryProductView],
  "queryType": "xyz789",
  "visibility": "xyz789"
}
```

<HorizontalLine />

### SortEnum

Indicates whether to return results in ascending or descending order.

#### Values

| Enum Value | Description |
|------------|-------------|
| `ASC` |  |
| `DESC` |  |

#### Example

```json
""ASC""
```

<HorizontalLine />

### SortableAttribute

Contains product attributes that be used for sorting in a `productSearch` query

#### Fields

| Field Name | Description |
|------------|-------------|
| `attribute` - [`String!`](#string) | The unique identifier for an attribute code. This value should be in lowercase letters and without space |
| `frontendInput` - [`String`](#string) | Indicates how field rendered on storefront |
| `label` - [`String`](#string) | The display name assigned to the attribute |
| `numeric` - [`Boolean`](#boolean) | Indicates whether this attribute has a numeric value, such as a price or integer |

#### Example

```json
{
  "attribute": "xyz789",
  "frontendInput": "abc123",
  "label": "abc123",
  "numeric": true
}
```

<HorizontalLine />

### StatsBucket

For retrieving statistics across multiple buckets

#### Fields

| Field Name | Description |
|------------|-------------|
| `max` - [`Float!`](#float) | The maximum value |
| `min` - [`Float!`](#float) | The minimum value |
| `title` - [`String!`](#string) | The display text for the bucket |

#### Example

```json
{
  "max": 123.45,
  "min": 987.65,
  "title": "xyz789"
}
```

<HorizontalLine />

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

#### Example

```json
"xyz789"
```

<HorizontalLine />

### SwatchType

The type of the swatch.

#### Values

| Enum Value | Description |
|------------|-------------|
| `TEXT` |  |
| `IMAGE` |  |
| `COLOR_HEX` |  |
| `CUSTOM` |  |

#### Example

```json
""TEXT""
```

<HorizontalLine />

### ViewHistory

User view history

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `date` - [`DateTime`](#datetime) |  |
| `sku` - [`String!`](#string) |  |

#### Example

```json
{
  "date": "2007-12-03T10:15:30Z",
  "sku": "xyz789"
}
```

<HorizontalLine />

### ViewHistoryInput

User view history

#### Input Fields

| Input Field | Description |
|-------------|-------------|
| `dateTime` - [`DateTime`](#datetime) |  |
| `sku` - [`String!`](#string) |  |

#### Example

```json
{
  "dateTime": "2007-12-03T10:15:30Z",
  "sku": "abc123"
}
```
