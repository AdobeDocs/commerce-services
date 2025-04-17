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

Send all Data Ingestion API requests to this URL: `https://na1-sandbox.api.commerce.adobe.com/<tenantId>`

<InlineAlert variant="info" slots="text"/>

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](../ccdm-use-case.md).

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

## Header parameters

Include the following headers in REST API requests.

| Header name  | Required | Description |
|--------------|----------|-------------|
| `Content-Encoding` | No  | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`.                                                                           |
| `Content-Type`  | Yes   | Media type of the resource. Accepted value: `application/json`. |
| `Authorization: Bearer <bearerToken>`  | Yes  | Bearer access token generated using credentials from the Adobe developer project for the API integration.                            |

## Request template

Use the following template to submit requests using [cURL](https://curl.se/) replacing the placeholders as required.

```shell
curl --request POST \
  --url https://na1-sandbox.api.commerce.adobe.com/<tenantId>/<endpoint> \
  --header 'Content-Type:  application/json' \
  --header 'x-api-key: <clientId>' \
  --header 'Authorization: Bearer <bearerToken>' \
  --data '<apiPayload>'
```

| Placeholder name | Description                                                                                                    |
|------------------|----------------------------------------------------------------------------------------------------------------|
| endpoint         | Endpoint for specific Data Ingestion API, for example: `/v1/catalog/products/prices`  |
| bearerToken        | Bearer token generated from IMS credentials. See [Authentication](#authentication)                                    |
| apiPayload      | API payload see examples in the [tutorial](../ccdm-use-case.md)                                                                             |

For sample requests, see the [tutorial](../ccdm-use-case.md).

## Limitations

The Data Ingestion API has the following limitations and boundaries:
