---
title: Using the Data Ingestion API
edition: ee
description: Get information about using the REST API endpoints and operations provided by the data ingestion API.
keywords:
  - REST
  - Services
  - Backend Development
  - Performance
---

# Using the Data Ingestion API

Send all Data Ingestion requests to the `https://commerce.adobe.io/feeds` endpoint. For details about using the API, see the [API Reference](api-reference.md).

## Authentication

## Headers

Include the following headers in each Data Ingestion API request.

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                                                                                                     |
| `x-api-key`        | Yes      | Public API Key. TODO: add link docs according to https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-RegistertenantAPIkeys                              |
| `x-gw-signature`   | Yes      | JWT generated for Public API key. TODO: add link to docs according to https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-ObtainaJWTtokenforyourrequest |
| `Content-Encoding` | No       | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`                                                                                                                                                |
