---
title: Using the data ingestion API
edition: ee
description: Get information about using the data ingestion API to create and manage product, price book, and price data for you commerce catalog.
keywords:
  - REST
  - Services
  - Backend Development
  - Performance
---

# Using the data ingestion API

Use the data ingestion API to create and manage product data for your ecommerce catalog. Data includes products, product attribute metadata, prices books, and prices.

## Base URL

Send all Data Ingestion API requests to the following base URL:

```text
https://na1-sandbox.api.commerce.adobe.com/{tenantId}
```

The URL structure is:

`https://{region}-{environment}.api.commerce.adobe.com/{tenantId}`

- `region` is the cloud region where your instance is deployed.
- `environment-type` identifies non-production environments, for example, `sandbox` or `staging`.
- `tenantId` is the unique identifier for your organization's specific instance within the Adobe Experience Cloud.

&NewLine; <!--Add space between the collapsible section and the previous paragraph-->

<details>
      <summary><b>Get your tenant ID</b></summary>

import GetTenantId from '/src/_includes/authentication/get-tenant-id.md'

<GetTenantId />

</details>

## Authentication

Every API request must include a bearer token in the request header:

`Authorization: Bearer {access token}`

The bearer token is generated using the credentials from the Adobe developer project for the API integration. The token is valid for 24 hours. When it expires, use the Adobe developer project credentials to [generate a new one](#generate-a-new-access-token).

<br></br>

<details>
      <summary><b>Get credentials and bearer access tokens</b></summary>

import IMSAuth from '/src/_includes/authentication/initial-auth-for-api-access.md'

<IMSAuth />

</details>

### Generate a new access token

import GetNewToken from '/src/_includes/authentication/get-new-bearer-token.md'

<GetNewToken />

## Header parameters

Include the following headers in REST API requests.

| Header name  | Required | Description |
|--------------|----------|-------------|
| `AC-Environment-Id` | Yes | Specify the [tenant ID](#base-url) for the Commerce cloud instance.
| `Content-Encoding` | No  | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`.                                                                           |
| `Content-Type`  | Yes   | Media type of the resource. Accepted value: `application/json`. |
| `Authorization: Bearer {access token}`  | Yes  | Bearer access token generated using credentials from the Adobe developer project for the API integration.                            |

## Request template

Use the following template to submit requests using [curl](https://curl.se/) replacing the placeholders as required.

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/{tenantId}/{endpoint} \
  --header "Content-Type:  application/json" \
  --header "Authorization: Bearer {access token}" \
  --data "{apiPayload}"
```

| Placeholder name | Description                                                                                                    |
|------------------|----------------------------------------------------------------------------------------------------------------|
| `endpoint`       | Endpoint for specific Data Ingestion API, for example: `/v1/catalog/products/prices`  |
| `accessToken`    | Bearer token generated from IMS credentials. See [Authentication](#authentication).                                   |
| `apiPayload`     | API payload see examples in the [tutorial](../ccdm-use-case.md)                                                                             |

For sample requests, see the [tutorial](../ccdm-use-case.md).

## Limitations

See [Limits and boundaries](https://experienceleague.adobe.com/en/docs/commerce/optimizer/boundaries-limits) in the *Adobe Commerce Optimizer Guide*.
