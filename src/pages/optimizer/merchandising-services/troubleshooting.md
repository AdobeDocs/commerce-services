---
title: Monitor and Troubleshoot
description: Troubleshoot common issues with the Merchandising GraphQL API. Learn how to debug authentication errors, missing data, performance issues, and more.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Troubleshooting
---

<Edition slots="text" backgroundColor="green"/>
[SaaS only](https://experienceleague.adobe.com/en/docs/commerce/user-guides/product-solutions)

# Monitor and troubleshoot

When building dynamic storefronts with the Merchandising GraphQL API, it's essential to ensure that your implementation runs smoothly and efficiently. This section provides guidance on how to monitor and troubleshoot common issues you may encounter while using the Merchandising API.

## Common Issues

- **Authentication errors**: Verify that the tenant ID used in the endpoint URL matches the instance ID for your Adobe Commerce Optimizer instance.
- **Missing Data**: Ensure products are properly ingested via the Data Ingestion API. You can check the synchronization status for product data from the [Data Sync page](https://experienceleague.adobe.com/en/docs/commerce/optimizer/setup/data-sync) in Adobe Commerce Optimizer.
- **Performance Issues**: Optimize queries and implement caching.
- **Rate Limiting**: Monitor API usage and implement proper throttling.

## Private catalog view access errors

If a request to a private catalog view returns an `access-key-invalid` GraphQL error instead of data, check the `message` field for the specific cause:

- **Missing token**: Add the `AC-Catalog-View-Access-Token` header with a valid signed JSON Web Token (JWT) for the catalog view specified by `AC-View-ID`. See [Authentication](using-the-api.md#authentication).
- **Access token signature invalid**: Confirm the JWT was signed with the private key that matches a Restricted Access Key assigned to that catalog view, and that the token wasn't truncated or altered.
- **Restricted access is enabled but no valid access keys are available**: Assign at least one Restricted Access Key to the catalog view, or verify that an existing key hasn't passed its expiration date.
- **Token expired**: A JWT past its own `exp` claim is denied even if its signature is otherwise valid. Tokens aren't refreshable, so mint a new one.
- **Recently rotated or deleted key still appears to grant access**: A short caching window (observed up to approximately 5 minutes) can delay revocation after a Restricted Access Key is unassigned or deleted.

## Debugging

- **Query Validation**: In your staging environment, use GraphQL introspection to validate queries.
- **Response Analysis**: Check response structure and error messages.
- **Header Verification**: Ensure all required headers are included.
