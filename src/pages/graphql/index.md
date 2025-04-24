---
title: Storefront Services GraphQL Overview
description: Learn about the GraphQL capabilities of Live Search, Catalog Service, and Product Recommendations
---

# Storefront Services GraphQL overview

Catalog Service, Live Search, and Product Recommendations services contribute to the Storefront Services schema, which operates independently from the [core Adobe Commerce schema](https://developer.adobe.com/commerce/webapi/graphql/). Each of these services defines one or more queries. Mutations are not currently supported in this schema.

The endpoints for all Storefront Service queries are:

- Testing: `https://catalog-service-sandbox.adobe.io/graphql`
- Production: `https://catalog-service.adobe.io/graphql`

You must also specify multiple HTTP headers, including an API key, with each call. Refer to the documentation for each query for details about the required headers.

You can optionally use [API Mesh for Adobe Developer App Builder](https://developer.adobe.com/graphql-mesh-gateway/gateway/) to integrate the core Commerce schema, the Storefront Services schema, and third-party APIs. API Mesh requires an [Adobe I/O Runtime](https://developer.adobe.com/runtime/docs/guides/) account.
