---
title: Data Ingestion API
edition: ee
description: Learn how to use the Data Ingestion GraphQL API to add and manage product data using the composable catalog data model.
keywords:
  - REST
  - Services
  - Backend Development
  - Performance
---

# Data Ingestion API

Developers setting up catalogs for merchants with large or complex product assortments use the Data Ingestion API to send catalog data to Commerce storefront services directly, bypassing the need to go through an Adobe Commerce instance, saving time and processing power.

This direct connection decreases the time that it takes to process product changes because it bypasses the Adobe Commerce instance and moves catalog data from a third-party Enterprise Resource Planning (ERP) directly to Adobe Commerce services.

The Data Ingestion API is implemented as a REST (Representational State Transfer) API endpoint to manage the following types of data.

- **Product**—A product is any item or service offered for sale through online channels. Products can be physical goods, digital downloads, or services. They are the core elements of your catalog. In the context of the Composable Catalog Data Model (CCDM), products are categorized into different types. Currently, the following types are supported:

  - Simple Products: Basic items with no variations, for example a single t-shirt in one size and color.
  - Configurable Products: Items with multiple options or variations, for example a t-shirt available in different sizes and colors.

  Each product type has its own set of attributes and configurations to help you manage and present them effectively in your store.

- **Product variants**—Refer to a specific version of a product that differs from other versions based on certain attributes like size, color, or material. These variants are typically part of a configurable product, allowing customers to choose from different options on a single product page.

  For example, if you're selling a t-shirt, the product variants might include different sizes (small, medium, large) and colors (red, blue, green). Each combination of size and color represents a unique product variant

- **Metadata** (product attribute metadata)—Refers to the information that defines the characteristics and behavior of a product attribute. This metadata includes details such as the attribute's type, label, input method, and how it should be used in the storefront, search, and filtering functionalities.

  For example, if you have a product attribute called "color," the metadata would specify whether it's a text field, dropdown, or swatch, and how it should be displayed and used in various parts of the store, like product pages or search results

- **Price books and prices**—Determines the selling prices of products. In CCDM, a product SKU and price are decoupled. This decoupling allows you to define multiple price books for a single SKU to support different customer tiers, business units, and geographies. When you define prices for a product SKU, you can define regular and discounted prices within the scope of each price book.
