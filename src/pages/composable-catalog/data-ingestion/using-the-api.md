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

Send all Data Ingestion requests to the `https://commerce.adobe.io/feeds` endpoint. For details about using the API, see the [API Reference](api-reference.md).

## Authentication

Add authentication information here.

### Headers

Headers list should be present in each Data Ingestion API call

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                                                                                                     |
| `x-api-key`        | Yes      | Public API Key. TODO: add link docs according to https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-RegistertenantAPIkeys                              |
| `x-gw-signature`   | Yes      | JWT generated for Public API key. TODO: add link to docs according to https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-ObtainaJWTtokenforyourrequest |
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
| API_PAYLOAD      | API payload see in examples below                                                                               |
