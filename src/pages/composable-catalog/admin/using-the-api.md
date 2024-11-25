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

Header name| Description
--- | ---
`AC-Environment-Id` |  Specify the environment id for the data space where commerce data is stored. Retrieve SaaS data space id from Commerce Admin at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment**, or using the Commerce CLI command `bin/magento config:show services_connector/services_id/environment_id` command. <!--If no Commerce backend, how do you get the data space environment ID? -->
`X-Api-Key` | Product public API key
