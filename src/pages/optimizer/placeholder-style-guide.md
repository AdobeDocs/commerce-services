---
title: Placeholder Style Guide for Optimizer Documentation
edition: saas
description: Standardized placeholder conventions for consistent documentation across all Optimizer APIs and guides.
keywords:
  - Documentation
  - Style Guide
  - Placeholders
  - Standards
---

# Placeholder Style Guide for Optimizer Documentation

This style guide establishes standardized placeholder conventions for the Adobe Commerce Optimizer Developer Guide to ensure consistency across all APIs, code examples, and documentation.

## Placeholder Format

### Standard Bracket Style

**Use double curly braces `{{}}` for all placeholders**

✅ **Correct:**

```shell
https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/graphql
Authorization: {{accessToken}}
```

❌ **Incorrect:**

```shell
https://na1-sandbox.api.commerce.adobe.com/{tenantId}/graphql
Authorization: <accessToken>
```

### Naming Conventions

**Use camelCase for all placeholder names**

✅ **Correct:** `{{tenantId}}`, `{{accessToken}}`, `{{catalogViewId}}`

❌ **Incorrect:** `{{tenant_id}}`, `{{access-token}}`, `{{CatalogViewID}}`

## Standard Placeholder Reference

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{tenantId}}` | Unique identifier for your Adobe Experience Cloud organization | `Xyub6kdpvYCmeEdcCX7PTg` |
| `{{accessToken}}` | Bearer access token for API authentication | `eyJhbGciOiJSUzI1NiIs...` |
| `{{region}}` | Cloud region where your instance is deployed | `na1` |
| `{{environment}}` | Environment type (only for non-production) | `sandbox` |
| `{{catalogViewId}}` | Unique identifier for catalog view | `51330428-3090-4650-8394-7a4a12b2c087` |
| `{{priceBookId}}` | Price book identifier | `west_coast_inc` |
| `{{endpoint}}` | Specific API endpoint path | `/v1/catalog/products` |
| `{{apiPayload}}` | Request payload data | `{"sku": "example-product"}` |
| `{{attributeCode}}` | Policy attribute code | `Brand` |
| `{{attributeValue}}` | Policy attribute value | `Aurora` |
| `{{clientId}}` | OAuth client ID from Adobe Developer Console | `1234567890abcdef` |
| `{{clientSecret}}` | OAuth client secret from Adobe Developer Console | `s3cr3t-v4lu3` |

## URL Templates

### Base URL Structure

**Standard format:**

```text
https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}
```

**Examples:**

- **Sandbox:** `https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}`
- **Production:** `https://na1.api.commerce.adobe.com/{{tenantId}}`

### API-Specific URLs

**Data Ingestion API:**

```text
https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}/{{endpoint}}
```

**Merchandising API:**

```text
https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}/graphql
```

**Admin API:**

```text
https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}/admin/graphql
```

## Code Example Templates

### cURL Template for REST APIs

```shell
curl --request POST \
  --url https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}/{{endpoint}} \
  --header "Content-Type: application/json" \
  --header "Authorization: {{accessToken}}" \
  --data "{{apiPayload}}"
```

### cURL Template for GraphQL APIs

```shell
curl --request POST \
  --url https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}/graphql \
  --header "Content-Type: application/json" \
  --header "AC-View-ID: {{catalogViewId}}" \
  --header "AC-Policy-{{attributeCode}}: {{attributeValue}}" \
  --data "{{apiPayload}}"
```

### Authentication Template

```shell
curl --request POST \
  --url 'https://ims-na1.adobelogin.com/ims/token/v3' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' \
  --data 'client_id={{clientId}}' \
  --data 'client_secret={{clientSecret}}' \
  --data 'scope=openid,AdobeID,profile,email,commerce.aco.ingestion'
```

## Header Standards

### Required Headers

| Header | Format | Usage |
|--------|--------|-------|
| Content-Type | `"Content-Type: application/json"` | All APIs |
| Authorization | `"Authorization: {{accessToken}}"` | Data Ingestion & Admin APIs |
| AC-View-ID | `"AC-View-ID: {{catalogViewId}}"` | Merchandising API |
| AC-Policy-* | `"AC-Policy-{{attributeCode}}: {{attributeValue}}"` | Merchandising API |
| AC-Price-Book-ID | `"AC-Price-Book-ID: {{priceBookId}}"` | Merchandising API |

## Environment References

### Consistent Terminology

**Use lowercase for environment types:**

- ✅ `sandbox`
- ❌ `Sandbox`, `SANDBOX`

**Standard environment descriptions:**

- **Sandbox:** Non-production environment for testing and development
- **Production:** Live environment for production use

## Documentation Context

### Table Descriptions

When describing placeholders in tables, maintain the same `{{}}` format:

| Parameter | Description |
|-----------|-------------|
| `{{tenantId}}` | Required. The unique identifier for your organization's specific instance within the Adobe Experience Cloud |
| `{{catalogViewId}}` | Required. The unique identifier assigned to the catalog view to filter catalog data |

### Inline References

When referencing placeholders in prose, use the same format:

"Replace `{{tenantId}}` with your actual tenant identifier from the Adobe Commerce Optimizer instance details."

## Common Mistakes to Avoid

### ❌ Inconsistent Bracket Styles

```text
// Don't mix bracket styles
{tenantId} and {{accessToken}} and <catalogViewId>
```

### ❌ Inconsistent Naming

```text
// Don't use different names for the same concept
{{tenantId}} vs {{tenantUUID}} vs {{tenant-id}}
```

### ❌ Mixed Casing

```text
// Don't mix casing conventions
{{catalogViewId}} vs {{catalogviewID}} vs {{CatalogViewId}}
```

### ❌ Spacing Issues

```text
// Don't forget spaces in headers
Authorization:{{accessToken}}  // Wrong
Authorization: {{accessToken}} // Correct
```

## Validation Checklist

Before publishing documentation, verify:

- [ ] All placeholders use `{{}}` format
- [ ] Placeholder names use camelCase
- [ ] No duplicate or conflicting placeholder names
- [ ] All code examples follow template standards
- [ ] Headers include proper spacing
- [ ] Environment references use lowercase
- [ ] URLs follow standard structure patterns

## Updates and Maintenance

This style guide should be updated when:

- New API endpoints are added
- New placeholder types are introduced
- Naming conventions change
- URL structures are modified

For questions or suggestions about these standards, please consult with the documentation team.

---

*Last updated: December 2024*
