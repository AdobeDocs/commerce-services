---
title: Set up and manage catalogs
edition: ee
description: Learn how to use catalog views, policies, and catalog source resources to define where products are sold and who they are sold to.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Set up and manage catalogs

An ecommerce product catalog benefits from reflecting the company's business structure as closely as possible. Businesses need to sell different products at different prices depending on geographic market, distribution catalog view, customer segment, and other variables.

Using the catalog view, policy, and catalog source resources available with the Merchandising Services Catalog Views and Policies API, you can create catalog variations instantly to adapt to these scenarios without requiring extensive development work.

* **Catalog Views**—Represent the product assortment that a business wants to sell to a particular distribution channel. A catalog view is the highest-level abstraction which encapsulates catalog sources and policies.

  Example: Dealers for the automotive industry. Subsidiaries for multi-brand conglomerates. Manufacturing location for suppliers.

* **Policy**—A data access action that supports delivering the right content to the right destination. Policies support catalog syndication capabilities to ensure that product data is consistent and up-to-date across multiple catalog views and platforms.

  Example: POS physical stores, marketplaces, advertisement pipelines such as Google, Meta, and Instagram.

* **Catalog source**—Specifies the language and geography (locale) for catalogs. The catalog source is set at the SKU level during data ingestion. When used, the `locale` catalog source is required. A catalog view must define at least one locale.

  Example: Catalog source `locale` such as `en_US` or `es_ES`, and sources like 'brand' and 'market' that can be introduced to meet unique business use cases.

For details, see the [Adobe Commerce Optimizer Guide](https://experienceleague.adobe.com/en/docs/commerce/optimizer/overview).
