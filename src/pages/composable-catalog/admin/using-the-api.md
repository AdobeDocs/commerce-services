---
title: Using the catalog management API
edition: ee
description: Get information about using GraphQL queries and mutations to manage channels, policies, and configuration for search and recommendations capabilities.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the catalog management and rules API

## Endpoint

Send all Catalog Management API requests to this endpoint: https://commerce.adobe.io/admin/graphql

<InlineAlert variant="info" slots="text"/>

For sample requests and examples using the API, see the [API Reference](api-reference.md) and the [tutorial](../ccdm-use-case.md).

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

Include the following headers in each GraphQL request.

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`AC-Environment-Id` | Yes | Specify the environment id for the data space where commerce data is stored. Retrieve the [SaaS data space id](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#saas-data-space-provisioning) from the Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command. |
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                      |
| `x-api-key`        | Yes      | Use the [public API Key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey) for your production environment when submitting Catalog Management API requests.                             |
| `x-gw-signature`   | Yes      | [JSON Web token generated for Public API key](#generate-jwt-token) |

## Request template

Use the following template for each GraphQL query request, replacing the request type based 

```shell
curl --request POST \
  --url https://commerce.adobe.io/admin/graphql \
  --header "AC-Environment-Id: <DATA_SPACE_ID>" \
  --header "Content-Type: application/json" \
  --header "x-api-key: <API_KEY>" \
  --header "x-gw-signature: <JWT_TOKEN>" \
  --data 'API_PAYLOAD'
```

For sample requests, see the [tutorial](../ccdm-use-case.md).
