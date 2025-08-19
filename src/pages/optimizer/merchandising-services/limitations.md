---
title: Limitations and considerations
edition: saas
description: Learn about the limitations and considerations when using the Merchandising API to retrieve catalog data from Adobe Commerce Optimizer.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Limitations and considerations

The Merchandising API provides powerful capabilities for accessing catalog data, but there are important limitations and considerations to keep in mind when using it. This section outlines the key constraints and best practices to ensure optimal performance and reliability.

### API Limits

- **Rate Limiting**: Requests are subject to rate limits based on your subscription tier
- **Query Complexity**: Complex queries may have timeout restrictions
- **Response Size**: Large result sets may be paginated or truncated
- **Concurrent Requests**: Limit concurrent requests to avoid throttling

For details about these limits, see [Boundaries and Limits](https://experienceleague.adobe.com/en/docs/commerce/optimizer/boundaries-limits) in the *Adobe Commerce Optimizer Guide*.

### Data Constraints

- **Read-Only Access**: The API provides read-only access to catalog data
- **Data Freshness**: For details about catalog data synchronization, see [Boundaries and Limits](https://experienceleague.adobe.com/en/docs/commerce/optimizer/boundaries-limits) in the *Adobe Commerce Optimizer Guide*.
- **Locale Requirements**: All queries require a specific locale to be set in the headers
- **Catalog View Dependencies**: Data access depends on configured catalog views

### Technical Limitations

- **GraphQL Only**: The API only supports GraphQL queries
- **HTTPS Only**: Production requests must use HTTPS
- **Browser CORS**: Consider CORS policies for browser-based applications

## Performance Considerations

### Query Optimization

- **Field Selection**: Only request the fields you need to minimize response size
- **Pagination**: Use proper pagination for large result sets
- **Caching**: Implement client-side caching for frequently accessed data
- **Batch Requests**: Combine multiple queries when possible

### Best Practices

- **Error Handling**: Implement comprehensive error handling for network issues
- **Loading States**: Provide user feedback during data loading
- **Rate Limiting**: Respect API rate limits and implement retry logic
- **Mobile Optimization**: Ensure queries work efficiently on mobile devices
