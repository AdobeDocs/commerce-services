---
title: Using the catalog management and rules API
edition: ee
description: Get information about using GraphQL queries and mutations to manage channels, policies, and configuration for search and recommendations capabilities.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Using the catalog management and rules API

## Endpoints

The storefront API endpoints for all storefront API operations operations are:

Environment | URL |
----------- | --- |
Testing | https://scoping-service-stage.magento-ds.com/graphql
Production | https://scoping-service.magento-ds.com/graphql

You must also specify multiple HTTP headers, including an API key, with each request.

## Authentication

Add authentication information here.

## Headers

<!--Requires update for CCDM context-->

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                      |
| `x-api-key`        | Yes      | [Public API Key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey)                             |
| `x-gw-signature`   | Yes      | [JSON Web token generated for Public API key](https://developer.adobe.com/developer-console/docs/guides/authentication/JWT/#creating-a-json-web-token). |
|`AC-Environment-Id` | Yes | Specify the environment id for the data space where commerce data is stored. Retrieve SaaS data space id from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command. |
| `Content-Encoding` | No       | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`                                                                                                                                                |
