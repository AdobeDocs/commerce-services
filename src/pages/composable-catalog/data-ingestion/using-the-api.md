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

Send all Data Ingestion requests to the `https://commerce.adobe.io/api` endpoint. For details about using the API, see the [API Reference](api-reference.md).

## Authentication

To interact with the Data Ingestion API, the consumer must authenticate by generating a JWT token signed with the public API key from your Commerce account at https://account.magento.com.

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

## Headers

The following Headers list should be present in each Data Ingestion API call.

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                                                                                                     |
| `x-api-key`        | Yes      | [Public API Key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey)                             |
| `x-gw-signature`   | Yes      | [JSON Web token generated for Public API key](https://developer.adobe.com/developer-console/docs/guides/authentication/JWT/#creating-a-json-web-token). |
| `Content-Encoding` | No       | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`                                                                                                                                                |

## Examples

Use the following examples to learn about the basic scenarios for using the Data Ingestion API.

The Example below demonstrate how you can create your catalog in Commerce Services.
This example will register 4 products, category tree, product attributes metadata and scopes in Commerce Services.

Use the following template for API call:

```shell
curl --location 'https://commerce.adobe.io/api/<API_ENDPOINT>/<DATA_SPACE_ID>' \
--header 'Content-Type:  application/json' \
--header 'x-api-key: <API_KEY>' \
--header 'x-gw-signature: <JWT_TOKEN>' \
--data '<API_PAYLOAD>'
```

| Placeholder name | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| API_ENDPOINT     | API endpoint retrieved from API reference for specific Data Ingestion API, for example: `metadata/v2/metadata`  |
| DATA_SPACE_ID    | Data Space ID obtained in this section.                                                |
| API_KEY          | API_KEY obtained in this section.                                               |
| JWT_TOKEN        | JWT token obtained in this section.                                     |
| API_PAYLOAD      | API payload see examples in [CCDM use case](../ccdm-use-case.md)                                                                              |
