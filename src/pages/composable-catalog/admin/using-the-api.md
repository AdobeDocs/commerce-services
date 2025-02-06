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

The storefront API endpoints for all storefront API operations are:

https://commerce.adobe.io/admin/graphql

You must also specify multiple HTTP headers, including an API key, with each request.

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

<!--Requires update for CCDM context-->

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`AC-Environment-Id` | Yes | Specify the environment id for the data space where commerce data is stored. Retrieve SaaS data space id from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command. |
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                      |
| `x-api-key`        | Yes      | [Public API Key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey)                             |
| `x-gw-signature`   | Yes      | [JSON Web token generated for Public API key](#generate-jwt-token) |
