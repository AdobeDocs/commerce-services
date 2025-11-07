# Documentation Overlay for categoryTree and navigation Queries

## Overview

This document summarizes the documentation overlay created for the new `categoryTree` and `navigation` queries in the Merchandising Services API.

## Files Created/Modified

### 1. Updated: `spectaql/metadata-merchandising.json`

The main metadata file now contains comprehensive documentation for:

- `categoryTree` query and its arguments
- `navigation` query and its arguments
- `CategoryTreeView` type and all its fields
- `CategoryNavigationView` type and all its fields

### 2. Updated: `spectaql/config-merchandising.yml`

SpectaQL configuration updated to use enhanced schema file instead of live introspection:
- `introspectionFile: spectaql/enhanced-schema.json`
- Commented out live introspection URL and headers
- Enhanced metadata processing settings enabled

### 3. Created: Enhanced Build Scripts

- `scripts/fetch-and-enhance-schema.js` - Fetches live schema and injects descriptions
- `scripts/build-with-enhanced-schema.js` - Complete build process with description injection
- `scripts/inject-descriptions.js` - Core description injection logic (unused, kept for reference)

## Usage

### Enhanced Build Process

To generate documentation with injected descriptions:

```bash
node scripts/build-with-enhanced-schema.js
```

This process:
1. Fetches the live GraphQL schema via introspection
2. Injects custom descriptions from `spectaql/metadata-merchandising.json`
3. Saves enhanced schema to `spectaql/enhanced-schema.json`
4. Runs SpectaQL using the enhanced schema file
5. Generates `static/graphql-api/merchandising-api/index.html` with descriptions

### Standard Build Process

For basic documentation without custom descriptions:

```bash
yarn build:merchandising-api
```

## Documentation Added

### categoryTree Query

**Description:** Retrieve hierarchical category data in a tree structure. This query allows you to fetch category information with parent-child relationships, useful for building category navigation menus and breadcrumbs.

**Arguments:**

- `family` (String!): The catalog family identifier that determines which catalog's categories to retrieve. This is typically your store's catalog ID.
- `slugs` ([String!]): Optional array of specific category slugs to retrieve. If provided, only these categories and their hierarchical relationships will be returned. If omitted, all categories in the family are returned.
- `depth` (Int): Optional maximum depth level to retrieve in the category tree. Use this to limit how deep the hierarchy goes. If omitted, all levels are returned.

### navigation Query

**Description:** Retrieve category navigation data optimized for building storefront navigation menus. Returns a flattened structure of categories with their immediate children, ideal for creating responsive navigation components.

**Arguments:**

- `family` (String!): The catalog family identifier that determines which catalog's navigation structure to retrieve. This is typically your store's catalog ID.

### CategoryTreeView Type

**Description:** Represents a category in a hierarchical tree structure with parent-child relationships and level information.

**Fields:**

- `slug` (String!): The unique URL-friendly identifier for the category, used in routing and navigation.
- `name` (String!): The display name of the category as shown to customers in the storefront.
- `level` (Int): The hierarchical level of the category in the tree structure, where root categories have level 0.
- `parentSlug` (String): The slug of the parent category. Null for root-level categories.
- `childrenSlugs` ([String]): Array of slugs for all direct child categories. Empty array if the category has no children.

### CategoryNavigationView Type

**Description:** Represents a category optimized for navigation purposes with recursive child category structure.

**Fields:**

- `slug` (String!): The unique URL-friendly identifier for the category, used in routing and navigation.
- `name` (String!): The display name of the category as shown to customers in the storefront navigation.
- `children` ([CategoryNavigationView]): Array of direct child categories, each containing their own children in a recursive structure. Used to build multi-level navigation menus.

## Usage

The documentation overlay has been integrated into the existing SpectaQL configuration. When the API documentation is regenerated using the build scripts, the new queries and types will include comprehensive descriptions for all fields and arguments.

To regenerate the documentation:

```bash
yarn build:merchandising-api
```

## Benefits

1. **Complete Documentation**: Both queries now have detailed descriptions explaining their purpose and use cases.
2. **Argument Documentation**: All query arguments include clear descriptions of their purpose and expected values.
3. **Field Documentation**: Every field in the return types has descriptive documentation.
4. **Developer-Friendly**: The documentation provides context about when and how to use each query.
5. **Maintainable**: The overlay approach allows for easy updates without modifying the core schema.

## Verification

The documentation has been successfully merged into the metadata file. You can verify this by checking:

- The `categoryTree` and `navigation` queries in the metadata file
- The `CategoryTreeView` and `CategoryNavigationView` type definitions
- The field argument documentation for both queries

The next time the API documentation is built (when proper API credentials are available), these descriptions will appear in the generated HTML documentation.
