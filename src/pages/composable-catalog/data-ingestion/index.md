---
title: Ingest product and price data with the Data Ingestion API
edition: saas
description: Learn how to use the Data Ingestion GraphQL API to add and manage product data using the composable catalog data model.
keywords:
  - REST
  - Services
  - Backend Development
---

# Ingest product and price data with the Data Ingestion API

Developers setting up catalogs for merchants with large or complex product assortments use the Data Ingestion API to send catalog data to Commerce storefront services directly. It bypasses the Adobe Commerce instance and moves catalog data from a third-party Enterprise Resource Planning (ERP) directly to Adobe Commerce services reducing processing time and improving performance.

The Data Ingestion API is designed to be used by backend applications to manage product data. It is not intended for use by frontend applications or storefronts. It is implemented as a REST (Representational State Transfer) API endpoint to manage the following types of data.

## Metadata

Metadata defines the characteristics and behavior of a product attribute. It includes details such as the attribute's type, label, input method, and usage in the storefront, search, and filtering functionalities. These settings control how product attributes appear and function throughout the storefront.

For example, you can define a product attribute as searchable, filterable, and sortable. You can also specify the search type for a product attribute, such as autocomplete or exact match.

Metadata is required to index product data for discovery. Consequently, it must be created before creating products. For each Commerce project, the following product attribute metadata must be defined for each catalog source (`locale`):

- `sku`
- `name`
- `description`
- `shortDescription`
- `price`

You can also define custom metadata for additional product attributes. For example, you can define a `brand` attribute to allow product discovery and filtering by brand name.

For details, see <a href="https://developer-stage.adobe.com/commerce/services/composable-catalog/reference/rest/data-ingestion-api/#tag/Metadata" target="_blank" rel="noopener noreferrer">Metadata API</a> in the *Data Ingestion API Reference*.

## Products

A product is any item or service offered for sale through online channels. Products can be physical goods, digital downloads, or services. They are the core elements of your catalog. In the context of the Merchandising Services, products are categorized into different types.

**Product types** are different categories of products that you can create and manage in your catalog. Merchandising Services supports the following product types:

  - **Simple Products**—Basic items with no variations, for example a single t-shirt in one size and color.
  - **Configurable Products**—Items with multiple options or variations, for example a t-shirt available in different sizes and colors.

Each product type has its own set of attributes and configurations to help you manage and present them effectively in your store.

**Product variants** are a specific version of a product that differs from other versions based on certain attributes like size, color, or material. These variants are typically part of a configurable product, allowing customers to choose from different options on a single product page.

For example, if you're selling a t-shirt, the product variants might include different sizes (small, medium, large) and colors (red, blue, green). Each combination of size and color represents a unique product variant.

For details, see <a href="https://developer-stage.adobe.com/commerce/services/composable-catalog/reference/rest/data-ingestion-api/#tag/Products" target="_blank" rel="noopener noreferrer">Products API</a> in the *Data Ingestion API reference*.

## Price books and prices

In Merchandising Services, a product SKU and its price are decoupled. This decoupling allows you to define multiple price books for a single SKU, supporting different customer tiers, business units, and geographies. When defining prices for a product SKU, you can set both regular and discounted prices within the catalog source for each price book.

**Price books** are collections of prices for a specific set of products. Price books allow you to manage and organize prices for different customer segments, regions, or sales channels. You can create multiple price books to accommodate various pricing strategies and customer groups. Each price book has an associated currency. Merchandising Services includes a default price book with a default currency in US dollars, which is used when no other price book is specified.

**Prices** are the monetary values assigned to products within a price book. To create prices for each product SKU, specify the associated price books and define the pricing schedule for each price book.

For details, see <a href="https://developer-stage.adobe.com/commerce/services/composable-catalog/reference/rest/data-ingestion-api/#tag/Metadata/#tag/Price-Books" target="_blank" rel="noopener noreferrer">Price Books</a> and <a href="https://developer-stage.adobe.com/commerce/services/composable-catalog/reference/rest/data-ingestion-api/#operation/createPrices" target="_blank" rel="noopener noreferrer">Prices</a> in the *Data Ingestion API Reference*.
