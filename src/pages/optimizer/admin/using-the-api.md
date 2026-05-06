---
title: Using the Catalog Views and Policies API
description: Get information about using GraphQL queries and mutations to manage catalog views, policies, and configuration for search and recommendations capabilities.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

<Edition slots="text" backgroundColor="green"/>
[SaaS only](https://experienceleague.adobe.com/en/docs/commerce/user-guides/product-solutions)

# Using the Catalog Views and Policies API

## Base URL

Use the following base URL for all Catalog Views and Policies API requests.

`https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/admin/graphql`

<InlineAlert variant="info" slots="text"/>

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](../ccdm-use-case.md).

The URL structure is:

```https://{{region}}-{{environment}}.api.commerce.adobe.com/{{tenantId}}```

- `region` is the cloud region where your instance is deployed.
- `environment-type` is included only for non-production URLs (`sandbox`).
- `tenantId` is the unique identifier for your organization's specific instance within the Adobe Experience Cloud.

### Get your instance ID

<Fragment src="../../includes/authentication/get-tenant-id.md" />

## Authentication

Every API request must include a bearer token in the request header:

`Authorization: Bearer {{accessToken}}`

The bearer token is generated using the credentials from the Adobe developer project for the API integration. The token is valid for 24 hours. When it expires, use the Adobe developer project credentials to generate a new one.

### Get credentials and bearer access tokens

<Fragment src="../../includes/authentication/initial-auth-for-api-access.md" />

### Generate a new access token

<Fragment src="../../includes/authentication/get-new-bearer-token.md" />

## Headers

Include the following headers in GraphQL requests.

| Header Name   | Required |Description |
|---------------|----------|------------|
| `Content-Type` | Yes     | Specifies the media type of the resource. Accepted value: `application/json`. |
| `Authorization: Bearer {{accessToken}}`     | Yes      | Bearer token generated from IMS credentials.|

## Request template

Use the following template to submit requests using [curl](https://curl.se), replacing the placeholders as required.

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{{tenantId}}/admin/graphql \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {{accessToken}}" \
  --data "{{apiPayload}}"
```

For sample requests, see the [tutorial](../ccdm-use-case.md).
