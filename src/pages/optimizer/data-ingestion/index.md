---
title: Ingest product and price data with the Data Ingestion API
edition: saas
description: Learn how to use the Data Ingestion REST API to add and manage product data using the composable catalog data model.
keywords:
  - REST
  - Services
  - Backend Development
---

# Ingest product and price data with the Data Ingestion API

Developers setting up catalogs for merchants with large or complex product assortments use the Data Ingestion API to send catalog data to Commerce Optimizer merchandising services directly. This data is used to create a single base catalog that can be configured and filtered to deliver custom catalog views for different sales channels, locales, and customer segments.

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

For details, see <a href="https://developer.adobe.com/commerce/services/reference/rest/#tag/Metadata" target="_blank" rel="noopener noreferrer">Metadata API</a> in the *Data Ingestion API Reference*.

## Products

A product is any item or service offered for sale through online channels. Products can be physical goods, digital downloads, or services. They are the core elements of your catalog. In the context of the Merchandising Services, products are categorized into different types.

**Product types** are different categories of products that you can create and manage in your catalog. Merchandising Services supports the following product types:

  - **Simple Products**—Basic items with no variations, for example a single t-shirt in one size and color.
  - **Configurable Products**—Items with multiple options or variations, for example a t-shirt available in different sizes and colors.

Each product type has its own set of attributes and configurations to help you manage and present them effectively in your store.

**Product variants** are a specific version of a product that differs from other versions based on certain attributes like size, color, or material. These variants are typically part of a configurable product, allowing customers to choose from different options on a single product page.

For example, if you're selling a t-shirt, the product variants might include different sizes (small, medium, large) and colors (red, blue, green). Each combination of size and color represents a unique product variant.

For details, see <a href="https://developer.adobe.com/commerce/services/reference/rest/#tag/Products" target="_blank" rel="noopener noreferrer">Products API</a> in the *Data Ingestion API Reference*.

## Price books and prices

In Merchandising Services, a product SKU and its price are decoupled. This decoupling allows you to define multiple price books for a single SKU, supporting different customer tiers, business units, and geographies. When defining prices for a product SKU, you can set both regular and discounted prices within the catalog source for each price book.

**Price books** are collections of prices for a specific set of products. Price books allow you to manage and organize prices for different customer segments, regions, or sales channels. You can create multiple price books to accommodate various pricing strategies and customer groups. Each price book has an associated currency. Merchandising Services includes a default price book with a default currency in US dollars, which is used when no other price book is specified.

**Prices** are the monetary values assigned to products within a price book. To create prices for each product SKU, specify the associated price books and define the pricing schedule for each price book.

For details, see <a href="https://developer.adobe.com/commerce/services/reference/rest/#tag/Price-Books" target="_blank" rel="noopener noreferrer">Price Books</a> and <a href="https://developer.adobe.com/commerce/services/reference/rest/#operation/createPrices" target="_blank" rel="noopener noreferrer">Prices</a> in the *Data Ingestion API Reference*.

## Load sample data using the Adobe Commerce Optimizer SDK

To help you get started with the data ingestion, you can load sample catalog data into your Adobe Commerce Optimizer instance using the Adobe Commerce Optimizer TypeScript and JavaScript SDK. This loads initial product and price data that you can use to

- Test the Data Ingestion API by submitting updates to the sample data
- Explore the capabilities of the Merchandising Services
- Understand the data structure and relationships

### About the sample data

The sample data is based on the <a href="https://experienceleague.adobe.com/en/docs/commerce/optimizer/use-case/admin-use-case#business-scenario--carvelo-automobile" target="_blank" rel="noopener noreferrer">Carvelo use case</a> described in the *Adobe Commerce Optimizer User Guide*. It includes a variety of products, price books, and prices to demonstrate how to use the API effectively.

To load the sample data, follow the instructions in the [Sample catalog data ingestion GitHub repository](https://github.com/adobe-commerce/aco-sample-catalog-data-ingestion).

After loading the sample data, you can:

- Set up your first storefront
- Complete the end-to-end workflow for the Carvelo use case

See the [Carvelo use case](https://experienceleague.adobe.com/en/docs/commerce/optimizer/use-case/admin-use-case#business-scenario--carvelo-automobile) in the *Adobe Commerce Optimizer User Guide* for details on how to set up the storefront and complete the workflow.

## Next steps

Get started with the [Data Ingestion API](using-the-api.md)
