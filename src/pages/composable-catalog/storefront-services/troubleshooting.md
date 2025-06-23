---
title: Monitor and Troubleshoot
edition: ee
description: Troubleshoot common issues with the Merchandising GraphQL API. Learn how to debug authentication errors, missing data, performance issues, and more.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Troubleshooting
---

# Monitor and troubleshoot

When building dynamic storefronts with the Merchandising GraphQL API, it's essential to ensure that your implementation runs smoothly and efficiently. This section provides guidance on how to monitor and troubleshoot common issues you may encounter while using the Merchandising API.

## Common Issues

- **Authentication Errors**: Verify the tenant ID used in the endpoint URL to ensure it matches the tenant ID in your Adobe Commerce Optimizer instance.
- **Missing Data**: Ensure products are properly ingested via the Data Ingestion API. You can check the synchronization status for product data from the [Data Sync page](https://experienceleague-review.corp.adobe.com/docs/commerce/optimizer/setup/data-sync.html) in Adobe Commerce Optimizer.
- **Performance Issues**: Optimize queries and implement caching.
- **Rate Limiting**: Monitor API usage and implement proper throttling.

## Debugging

- **Query Validation**: In your staging environment, use GraphQL introspection to validate queries.
- **Response Analysis**: Check response structure and error messages.
- **Header Verification**: Ensure all required headers are included.
