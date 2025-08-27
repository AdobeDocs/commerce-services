---
title: Data type reference - Merchandising API
description: Comprehensive reference for GraphQL data types used in the Merchandising API, including object types, interfaces, enums, and their relationships for product search, recommendations, and catalog operations.
keywords:
  - GraphQL
  - Data Types
  - Services
  - Backend Development
  - API Reference
---

# GraphQL API Types Summary - Merchandising API

This summary provides a detailed overview of the types used in the GraphQL API Merchandising API to  clarify the structure and relationships of the data managed by the API. For detailed information on each type and its fields, see the [Merchandising API reference](https://developer.adobe.com/commerce/services/reference/graphql/).

This document provides a comprehensive overview of the types used in the following queries in the GraphQL API Merchandising API:

- `attributeMetadata` - Return product attribute codes for sorting and filtering
- `productSearch` - Search for products with filters, sorting, and faceting
- `products` - Return product details for specified SKUs
- `recommendations` - Get information about product recommendation blocks for a given SKU.
- `recommendationsByUnitIds` - Get product recommendations by recommendation unit IDs
- `refineProduct` - Get products by selection of options
- `variants` - Get product variants based on specified options

## Scalar Types

Primitive data types used throughout the API:

- **Boolean** - True/false values
- **DateTime** - Date and time representation
- **Float** - Floating-point numbers
- **ID** - Unique identifier type
- **Int** - Integer numbers
- **JSON** - Raw JSON data type
- **String** - Text data type

## Object Types

Complex types that contain multiple fields:

### Search & Filtering

- **Aggregation** - Search aggregation data
- **AppliedQueryRule** - Applied query rules for search
- **AttributeMetadataResponse** - Response for attribute metadata
- **FilterableInSearchAttribute** - Attributes available for search filtering
- **Highlight** - Search result highlighting information
- **ProductSearchItem** - Individual product in search results
- **ProductSearchResponse** - Complete search response with results and metadata
- **SearchResultPageInfo** - Pagination information for search results
- **SortableAttribute** - Attributes available for sorting

### Product Information

- **ComplexProductView** - Complex/configurable product details
- **ProductViewAttribute** - Product attribute information
- **ProductViewImage** - Product image details
- **ProductViewLink** - Product relationship links
- **ProductViewMoney** - Monetary values with currency
- **ProductViewOption** - Product configuration options
- **ProductViewOptionValueConfiguration** - Option value configuration details
- **ProductViewOptionValueProduct** - Product-specific option values
- **ProductViewOptionValueSwatch** - Visual swatch option values
- **ProductViewPrice** - Product pricing information
- **ProductViewPriceRange** - Price range for variable products
- **ProductViewVariant** - Product variant information
- **ProductViewVariantResults** - Results for variant queries
- **ProductViewVideo** - Product video content
- **SimpleProductView** - Simple product details

### Pricing

- **Price** - Basic price information
- **PriceAdjustment** - Price adjustment details

### Categories

- **CategoryBucket** - Category facet bucket
- **CategoryView** - Category information

### Recommendations

- **RecommendationUnit** - Individual recommendation unit
- **Recommendations** - Recommendation response data

### Aggregation & Faceting

- **RangeBucket** - Range-based facet bucket
- **ScalarBucket** - Single-value facet bucket
- **StatsBucket** - Statistical aggregation bucket

## Interface Types

Abstract types that define common contracts:

### Faceting & Buckets

- **Bucket** - Base interface for all bucket types
- **CategoryBucketInterface** - Interface for category buckets

### Categories

- **CategoryInterface** - Base interface for category types
- **CategoryViewInterface** - Interface for category view types

### Products

- **ProductInterface** - Base interface for all product types
- **ProductLinksInterface** - Interface for product relationships
- **ProductView** - Base interface for product view types
- **ProductViewOptionValue** - Interface for product option values

### Media

- **MediaGalleryInterface** - Interface for media gallery items

---

## Enum Types

Enumeration types with predefined values:

- **AggregationType** - Types of search aggregations available
- **AppliedQueryRuleActionType** - Types of query rule actions
- **ProductViewCurrency** - Supported currency codes
- **SwatchType** - Types of visual swatches (color, image, text)

---

## Key Supporting Type Relationships

### Product Data Flow

```text
ProductView (interface)
├── SimpleProductView (object)
├── ComplexProductView (object)
├── ProductViewAttribute (object)
├── ProductViewPrice (object)
├── ProductViewOption (object)
└── ProductViewVariant (object)
```

### Search & Filtering Flow

```text
ProductSearchResponse (object)
├── ProductSearchItem (object)
├── SearchResultPageInfo (object)
├── Aggregation (object)
└── Bucket (interface)
    ├── CategoryBucket (object)
    ├── RangeBucket (object)
    ├── ScalarBucket (object)
    └── StatsBucket (object)
```

### Recommendation Flow

```text
Recommendations (object)
└── RecommendationUnit (object)
    └── ProductView (interface)
```
