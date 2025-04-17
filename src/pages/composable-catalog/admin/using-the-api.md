---
title: Using the Channels and Policies API
edition: ee
description: Get information about using GraphQL queries and mutations to manage channels, policies, and configuration for search and recommendations capabilities.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the Channels and Policies API

## Base URL

Use the following base URL for all Channels and Policies API requests.

`https://na1-sandbox.api.commerce.adobe.com/<tenantId>/admin/graphql`

<InlineAlert variant="info" slots="text"/>

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](cdm-use-case.md).

## Authentication

Every API request must include a bearer token in the request header:

`Authorization: Bearer <bearerToken>`

An OAUTH 2.0 bearer access token is a type of authentication token that, when included in the Authorization header of an HTTP request, authenticates the API request and authorizes access to the requested resource. The token is valid for 24 hours. When it expires, you use the Adobe developer project credentials to generate a new one.

The bearer token is generated using the credentials from the Adobe developer project for the API integration. The token is valid for 24 hours. When it expires, you use the Adobe developer project credentials to generate a new one.

<br></br>

<details>
      <summary><b>Get credentials and bearer access tokens</b></summary>

import IMSAuth from '/src/_includes/ccdm/initial-auth-for-api-access.md'

<IMSAuth />

</details>

### Get a new access token

import GetBearerToken from '/src/_includes/ccdm/initial-auth-for-api-access.md'

<GetBearerToken />

## Headers

Include the following headers in GraphQL requests.

| Header Name   | Required |Description |
|---------------|----------|------------|
| `Content-Type` | Yes     | Specifies the media type of the resource. Accepted value: `application/json`. |
| `Authorization: Bearer <accessToken>`     | Yes      | Bearer token generated from IMS credentials. See [Authentication](#authentication).  |

## Request template

Use the following template for each GraphQL query request, replacing the placeholders as required.

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/<tenantId>/admin/graphql \
  --header "Content-Type: application/json" \
  --header 'Authorization: Bearer <bearerToken>' \
  --data 'apiPayload'
```

For sample requests, see the [tutorial](../ccdm-use-case.md).
