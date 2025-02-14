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

## Endpoints

Send all Data Ingestion requests to this endpoint: `https://commerce.adobe.io/api`

<InlineAlert variant="info" slots="text"/>

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](../ccdm-use-case.md).

## Authentication

To interact with the Data Ingestion API, the consumer must authenticate by generating a JWT token signed with the public API key from your Adobe Commerce account at https://account.magento.com.

For instructions on generating the public API key, see [Generate the production and sandbox keys](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey)

### Generate JWT token

Use the following java code to generate a JWT token signed with the private key associated with your public API key.

**JwtGenerator.java**

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.PrivateKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class JwtGenerator {

    public String generateJwt(PrivateKey privateKey) {

        Instant now = Instant.now();

        return Jwts.builder()
                   .setIssuedAt(Date.from(now))
                   .setExpiration(Date.from(now.plus(5L, ChronoUnit.MINUTES)))
                   .signWith(privateKey, SignatureAlgorithm.RS256)
                   .compact();
    }
}
```

## Path parameters

Include the following path parameter in each API request.

| Parameter name | Required | Description |
|---|---|---|
DATA_SPACE_ID | Yes | The data space ID for the data space where commerce catalog data is stored. See [SaaS configuration](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#saasenv) in *Adobe Experience League*.

## Header parameters

The following headers list should be present in each Data Ingestion API call.

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Content-Encoding` | No       | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`                                                                                                                                                |
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                                                                                                     |
| `x-api-key`        | Yes      | Use the public [API Key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey) for your production environment when submitting Data Ingestion API requests.                            |
| `x-gw-signature`   | Yes      | [JSON Web token generated for Public API key](https://developer.adobe.com/developer-console/docs/guides/authentication/JWT/#creating-a-json-web-token). |

## Request template

Use the following template to submit requests using [cURL](https://curl.se/).

```shell
curl --request POST \
  --url 'https://commerce.adobe.io/api/<API_ENDPOINT>/<DATA_SPACE_ID>' \
  --header 'Content-Type:  application/json' \
  --header 'x-api-key: <API_KEY>' \
  --header 'x-gw-signature: <JWT_TOKEN>' \
  --data '<API_PAYLOAD>'
```

| Placeholder name | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| API_ENDPOINT     | Endpoint for specific Data Ingestion API, for example: `/api/v1/catalog/products/prices/`  |
| DATA_SPACE_ID    | [SaaS Data Space ID](#path-parameters).                                               |
| API_KEY          | [Public API_KEY for Adobe Commerce account](#authentication).                              |
| JWT_TOKEN        | [JWT token generated from Commerce API key.](#generate-jwt-token)                                     |
| API_PAYLOAD      | API payload see examples in the [tutorial](../ccdm-use-case.md)                                                                              |

For sample requests, see the [tutorial](../ccdm-use-case.md).
