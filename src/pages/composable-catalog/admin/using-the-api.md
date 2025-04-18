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

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](ccdm-use-case.md).

The URL structure is:

```https://<region>-<environment>.api.commerce.adobe.com/<tenantId>```

- `region` is the cloud region where your instance is deployed.
- `environment-type` identifies non-production environments, for example, `sandbox` or `staging`.
- `tenantId` is the unique identifier for your organization's specific instance within the Adobe Experience Cloud.

&NewLine; <!--Add space between the collapsible section and the previous paragraph-->

<details>
      <summary><b>Get your tenant Id</b></summary>

import GetTenantId from '/src/_includes/ccdm/get-tenant-id.md'

<GetTenantId />

</details>

## Authentication

Every API request must include a bearer token in the request header:

`Authorization: Bearer {access token}`

An OAUTH 2.0 bearer access token is a type of authentication token that, when included in the Authorization header of an HTTP request, authenticates the API request and authorizes access to the requested resource. The token is valid for 24 hours. When it expires, you use the Adobe developer project credentials to generate a new one.

The bearer token is generated using the credentials from the Adobe developer project for the API integration. The token is valid for 24 hours. When it expires, you use the Adobe developer project credentials to generate a new one.

<br></br>

<details>
      <summary><b>Get credentials and bearer access tokens</b></summary>

import IMSAuth from '/src/_includes/ccdm/initial-auth-for-api-access.md'

<IMSAuth />

</details>

### Generate a new access token

import GetBearerToken from '/src/_includes/ccdm/initial-auth-for-api-access.md'

<GetBearerToken />

## Headers

Include the following headers in GraphQL requests.

| Header Name   | Required |Description |
|---------------|----------|------------|
| `Content-Type` | Yes     | Specifies the media type of the resource. Accepted value: `application/json`. |
| `Authorization: Bearer {access token}`     | Yes      | Bearer token generated from IMS credentials. See [Authentication](#authentication).  |

## Request template

Use the following template for each GraphQL query request, replacing the placeholders as required.

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/<tenantId>/admin/graphql \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer {access token}" \
  --data "{apiPayload}"
```

For sample requests, see the [tutorial](../ccdm-use-case.md).
