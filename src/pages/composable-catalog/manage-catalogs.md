---
title: Set up and manage catalogs
edition: ee
description: Learn how to use distribution channels, policies, and scope resources to define where products are sold and who they are sold to.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Set up and manage catalogs

An ecommerce product catalog benefits from reflecting the company's business structure as closely as possible. Businesses need to sell different products and different prices depending on geographic market, distribution channel, customer segment, and other variables.

Using the channel, policy, and scope resources available with the Composable Catalog Data Model (CCDM), you can create catalog variations instantly to adapt to these scenarios without requiring extensive development work.

* **Channel**—Distribution channel of products a business wants to sell through. A channel is the highest-level abstraction which encapsulates scopes and policies.

  Example: Dealers for the automotive industry. Subsidiaries for multi-brand conglomerates. Manufacturing location for suppliers.

* **Policy**—A data access action that supports delivering the right content to the right destination. Policies support catalog syndication capabilities to ensure that product data is consistent and up-to-date across multiple channels and platforms.

  Example: POS physical stores, marketplaces, advertisement pipelines such as Google, Meta, and Instagram.

* **Scope**—Specifies the language and geography (locale) for catalogs. Scope is set at the SKU level during data ingestion. When used, the `locale` scope is required. A channel must define at least one locale.

  Example: Locale scopes such as `en_US` or `es_ES`, and scopes like 'brand' and 'market' that can be introduced to meet unique business use cases.
