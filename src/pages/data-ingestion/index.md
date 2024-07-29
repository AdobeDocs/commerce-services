---
title: Adobe Commerce Data Ingestion API
description: Reference information for Adobe Commerce Data Ingestion API.
---

# Introduction

<div style="color:red; font-size:12pt">
The introduction part should include a description of possible use cases, on a high level describe what customers get from using Commerce Services API.
! It's not only limited by Data Ingestion API, but also includes API for:

- customer onboarding
- service registration
- service configuration
- data ingestion

</div>


# Onboarding

## Register tenant API keys

To send your data to Commerce Services, you first have to obtain Public and Private API keys.
You can do it from API Portal. Please follow the [documentation](https://experienceleague.adobe.com/docs/commerce-merchant-services/user-guides/integration-services/saas.html?lang=en#genapikey)

You have to obtain:

| Key Name        | Description                                                                                                                      |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------|
| Public API key  | Public API key used in each request to Commerce Service API. `API_KEY` placeholder is used in as reference in this documentation |
| Private API key | Secret key associated with the Public API key and used to generate `JWT_TOKEN`                                                   |


## Register SaaS Project

<div style="color:red; font-size:12pt">
This section should describe the API necessary to obtain Testing/Production projects and Data Space ID for each project.
In the same section (since it's the same API) it makes sense to describe how customer can get corresponding entitlements for interested services (LS/Catalog Service, PRex,...)
</div>

You have to obtain:

| Key Name        | Description                                                                                                                                                                                                                                                 |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Data Space IDs  | list of Data Space IDs per for Production/Testing data spaces. Each Data Space ID cab be subscribed to a specific [Commerce Service](https://experienceleague.adobe.com/docs/commerce-merchant-services/user-guides/integration-services/saas.html?lang=en) |

NOTE: Link on how to obtain Data Spaces using Adobe Commerce Instance: [https://experienceleague.adobe.com/docs/commerce-admin/config/services/saas.html](https://experienceleague.adobe.com/docs/commerce-admin/config/services/saas.html) 

Responsible Team:

- Data Solution Core SaaS Team (slack: https://magento.slack.com/archives/C0296RPV36E/p1707856352796829)

NOTE:

We have to describe all API with examples that used in Admin UI: https://experienceleague.adobe.com/docs/commerce-admin/config/services/saas.html?lang=en

Likely entire section may be covered by Registry Service API that should address next questions:

- Register new tenant with corresponding API keys
- Create new Production and Testing Environments
- Create Data Space ID (environment id) for each environment
- Register Feature Set for given Data Space Id

## Obtain a JWT token for your request

<div style="color:red; font-size:12pt">
Note: this part is required almost for all API calls, not only Data Ingestion API, so we may have 1 page that will describe what is it and how to use it - and all APIs that requires JWT token will have a reference to this page.
</div>

Outcome:

- How to generate JWT token for API request
- describe the max TTL for the token that the user may set (10 min)
  Responsible Team:

Data Solution Core SaaS Team (Troll Team may help here)

# Data Ingestion API

The Adobe Commerce Data Ingestion API allows you to sync your catalog data straight to the Adobe Commerce services platform, bypassing the need to go through your Commerce instance, saving time
and processing power.

The Data Ingestion API allows customers with large and/or complex catalogs to send data to Adobe Commerce services directly.

The Data Ingestion API decreases the time that it takes to process product changes by bypassing the Adobe Commerce instance and moving catalog data from a third-party Enterprise Resource
Planning (ERP) directly to Adobe Commerce services.

## API reference

All requests to Data Ingestion API should go to `https://commerce.adobe.io/feeds` endpoint.
Please check [API Reference](data-ingestion.md)

### Headers

Headers list should be present in each Data Ingestion API call

| Header name        | Required | Description                                                                                                                                                                                                                        |
|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Content-Type`     | Yes      | Media type of the resource. Accepted value: `application/json`                                                                                                                                                                     |
| `x-api-key`        | Yes      | Public API Key. TODO: add link docs according to https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-RegistertenantAPIkeys                              |
| `x-gw-signature`   | Yes      | JWT generated for Public API key. TODO: add link to docs according to https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-ObtainaJWTtokenforyourrequest |
| `Content-Encoding` | No       | Use this header only if the payload is compressed with gzip. Accepted value: `gzip`                                                                                                                                                |


## Examples

Let's check basic scenarios on how you may use Data Ingestion API

Example below demonstrate how you can create your Catalog in Commerce Services.
This example will register 4 products, category tree, product attributes metadata and scopes in Commerce Services.

Use the following template for API call:

```shell
curl --location 'https://commerce.adobe.io/feeds/<API_ENDPOINT>/<DATA_SPACE_ID>' \
--header 'Content-Type:  application/json' \
--header 'x-api-key: <API_KEY>' \
--header 'x-gw-signature: <JWT_TOKEN>' \
--data '<API_PAYLOAD>'
```

| Placeholder name | Description                                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| API_ENDPOINT     | API endpoint retrieved from API reference for specific Data Ingestion API, for example: `metadata/v2/metadata`  |
| DATA_SPACE_ID    | Data Space ID obtained in [this section](#register-saas-project)                                                |
| API_KEY          | API_KEY obtained in [this section](#register-tenant-api-keys)                                                   |
| JWT_TOKEN        | JWT token obtained in [this section](#obtain-a-jwt-token-for-your-request)                                      |
| API_PAYLOAD      | API payload see in examples below                                                                               |

### Define product attributes and their characteristics

API Reference: [Product Attributes Metadata API](./data-ingestion/data-ingestion/#tag/metadata/operation/PostV2ProductMetadata)
API Payload:

```json
[
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "name",
    "attributeType": "catalog_product",
    "dataType": "varchar",
    "multi": false,
    "label": "Product Name",
    "frontendInput": "text",
    "required": true,
    "unique": false,
    "global": false,
    "visible": true,
    "searchable": true,
    "filterable": false,
    "visibleInCompareList": false,
    "visibleInListing": true,
    "sortable": true,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 5,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "sku",
    "attributeType": "catalog_product",
    "dataType": "static",
    "multi": false,
    "label": "SKU",
    "frontendInput": "text",
    "required": true,
    "unique": true,
    "global": true,
    "visible": true,
    "searchable": true,
    "filterable": false,
    "visibleInCompareList": true,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 6,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "description",
    "attributeType": "catalog_product",
    "dataType": "text",
    "multi": false,
    "label": "Description",
    "frontendInput": "textarea",
    "required": false,
    "unique": false,
    "global": false,
    "visible": true,
    "searchable": true,
    "filterable": false,
    "visibleInCompareList": true,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "short_description",
    "attributeType": "catalog_product",
    "dataType": "text",
    "multi": false,
    "label": "Short Description",
    "frontendInput": "textarea",
    "required": false,
    "unique": false,
    "global": false,
    "visible": true,
    "searchable": true,
    "filterable": false,
    "visibleInCompareList": true,
    "visibleInListing": true,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "price",
    "attributeType": "catalog_product",
    "dataType": "decimal",
    "multi": false,
    "label": "Price",
    "frontendInput": "price",
    "required": true,
    "unique": false,
    "global": true,
    "visible": true,
    "searchable": true,
    "filterable": true,
    "visibleInCompareList": false,
    "visibleInListing": true,
    "sortable": true,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": true,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "weight",
    "attributeType": "catalog_product",
    "dataType": "decimal",
    "multi": false,
    "label": "Weight",
    "frontendInput": "weight",
    "required": false,
    "unique": false,
    "global": true,
    "visible": true,
    "searchable": false,
    "filterable": false,
    "visibleInCompareList": false,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": true,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "meta_title",
    "attributeType": "catalog_product",
    "dataType": "varchar",
    "multi": false,
    "label": "Meta Title",
    "frontendInput": "text",
    "required": false,
    "unique": false,
    "global": false,
    "visible": true,
    "searchable": false,
    "filterable": false,
    "visibleInCompareList": false,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "meta_description",
    "attributeType": "catalog_product",
    "dataType": "varchar",
    "multi": false,
    "label": "Meta Description",
    "frontendInput": "textarea",
    "required": false,
    "unique": false,
    "global": false,
    "visible": true,
    "searchable": false,
    "filterable": false,
    "visibleInCompareList": false,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": false,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "color",
    "attributeType": "catalog_product",
    "dataType": "int",
    "multi": false,
    "label": "Color",
    "frontendInput": "select",
    "required": false,
    "unique": false,
    "global": true,
    "visible": true,
    "searchable": true,
    "filterable": true,
    "visibleInCompareList": true,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": true,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  },
  {
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "attributeCode": "size",
    "attributeType": "catalog_product",
    "dataType": "int",
    "multi": false,
    "label": "size",
    "frontendInput": "select",
    "required": false,
    "unique": false,
    "global": true,
    "visible": true,
    "searchable": true,
    "filterable": true,
    "visibleInCompareList": false,
    "visibleInListing": false,
    "sortable": false,
    "visibleInSearch": false,
    "filterableInSearch": false,
    "searchWeight": 1,
    "usedForRules": false,
    "systemAttribute": true,
    "numeric": false,
    "modifiedAt": "2024-02-20 19:38:26",
    "deleted": false
  }
]
```

### Define scopes

Define Website - Store - Store View structure

API Reference: [Scopes API](./data-ingestion/data-ingestion/#tag/scopes/operation/PostV1Scopes)
API Payload to register Website - Store - Store Views:

```json
[
  {
    "website": {
      "websiteCode": "us",
      "stores": [
        {
          "storeCode": "us",
          "storeViews": [
            {
              "storeViewCode": "us_en"
            }
          ]
        }
      ]
    },
    "updatedAt": "2024-02-26T16:47:08+00:00",
    "deleted": false
  }
]
```

Define customer groups. Shoppers requests prices providing `WEBSITE_CODE` and `CUSTOMER_GROUP_CODE` scopes.
Please define all Customer Groups related to Website applicable for your Store.
Soft limit: 1000 per website

API Payload to register Customer Groups:

```json
[
  {
    "customerGroup": {
      "customerGroupCode": "dealer-1",
      "websites": [
        "us"
      ]
    },
    "updatedAt": "2024-02-26T16:47:20+00:00",
    "deleted": false
  },
  {
    "customerGroup": {
      "customerGroupCode": "356a192b7913b04c54574d18c28d46e6395428ab",
      "websites": [
        "us"
      ]
    },
    "updatedAt": "2024-02-26T16:47:20+00:00",
    "deleted": false
  }
]
```

### Define products

API Reference: [Product API](./data-ingestion/data-ingestion/#tag/products/operation/PostV2Products)
API Payload:

```json
[
  {
    "sku": "simple_1",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Simple Product 1",
    "type": "simple",
    "shortDescription": "Produc short description",
    "description": "<h1>Product info</h1><p>Product description ...</p>",
    "status": "Enabled",
    "taxClassId": "Taxable Goods",
    "createdAt": "2024-01-20 20:20:13",
    "updatedAt": "2024-01-20 20:20:13",
    "urlKey": "simple-product-1",
    "visibility": "Catalog, Search",
    "weight": 1,
    "weightUnit": "lbs",
    "currency": "USD",
    "buyable": true,
    "attributes": [
      {
        "attributeCode": "color",
        "value": [
          "red"
        ]
      }
    ],
    "categoryData": [
      {
        "categoryId": "cat2",
        "categoryPath": "category-1",
        "productPosition": 1
      },
      {
        "categoryId": "cat3_1",
        "categoryPath": "category-1/category-1-1",
        "productPosition": -1
      }
    ],
    "inStock": true,
    "lowStock": false,
    "url": "https://magento.test/simple-product-1.html",
    "deleted": false,
    "modifiedAt": "2024-02-26 18:02:34"
  },
  {
    "sku": "simple_2",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Simple Product 2",
    "type": "simple",
    "shortDescription": "Produc short description",
    "description": "<h1>Product info</h1><p>Product description ...</p>",
    "status": "Enabled",
    "taxClassId": "Taxable Goods",
    "createdAt": "2024-01-20 20:20:13",
    "updatedAt": "2024-01-20 20:20:13",
    "urlKey": "simple-product-2",
    "visibility": "Catalog, Search",
    "weight": 1,
    "weightUnit": "lbs",
    "currency": "USD",
    "buyable": true,
    "attributes": [
      {
        "attributeCode": "color",
        "value": [
          "red"
        ]
      }
    ],
    "categoryData": [
      {
        "categoryId": "cat2",
        "categoryPath": "category-1",
        "productPosition": 1
      },
      {
        "categoryId": "cat3_1",
        "categoryPath": "category-1/category-1-1",
        "productPosition": -1
      }
    ],
    "inStock": true,
    "lowStock": false,
    "url": "https:\/\/magento.test\/simple-product-2.html",
    "deleted": false,
    "modifiedAt": "2024-02-26 18:02:34"
  },
  {
    "sku": "simple_3",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Simple Product 3",
    "type": "simple",
    "shortDescription": "Produc short description",
    "description": "<h1>Product info</h1><p>Product description ...</p>",
    "status": "Enabled",
    "taxClassId": "Taxable Goods",
    "createdAt": "2024-01-20 20:20:13",
    "updatedAt": "2024-01-20 20:20:13",
    "urlKey": "simple-product-3",
    "visibility": "Catalog, Search",
    "weight": 1,
    "weightUnit": "lbs",
    "currency": "USD",
    "buyable": true,
    "attributes": [
      {
        "attributeCode": "color",
        "value": [
          "blue"
        ]
      }
    ],
    "categoryData": [
      {
        "categoryId": "cat2",
        "categoryPath": "category-1",
        "productPosition": 1
      },
      {
        "categoryId": "cat3_2",
        "categoryPath": "category-1/category-1-2",
        "productPosition": -1
      }
    ],
    "inStock": true,
    "lowStock": false,
    "url": "https:\/\/magento.test\/simple-product-3.html",
    "deleted": false,
    "modifiedAt": "2024-02-26 18:02:34"
  },
  {
    "sku": "simple_4",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Simple Product 4",
    "type": "simple",
    "shortDescription": "Produc short description",
    "description": "<h1>Product info</h1><p>Product description ...</p>",
    "status": "Enabled",
    "taxClassId": "Taxable Goods",
    "createdAt": "2024-01-20 20:20:13",
    "updatedAt": "2024-01-20 20:20:13",
    "urlKey": "simple-product-4",
    "visibility": "Catalog, Search",
    "weight": 1,
    "weightUnit": "lbs",
    "currency": "USD",
    "buyable": true,
    "attributes": [
      {
        "attributeCode": "color",
        "value": [
          "blue"
        ]
      }
    ],
    "categoryData": [
      {
        "categoryId": "cat2",
        "categoryPath": "category-1",
        "productPosition": 1
      },
      {
        "categoryId": "cat3_2",
        "categoryPath": "category-1/category-1-2",
        "productPosition": -1
      }
    ],
    "inStock": true,
    "lowStock": false,
    "url": "https:\/\/magento.test\/simple-product-4.html",
    "deleted": false,
    "modifiedAt": "2024-02-26 18:02:34"
  }
]

```

### Define prices


API Reference: [Product Prices API](./data-ingestion/data-ingestion/#tag/products/operation/PostV1ProductPrices)
API Payload:

```json
[
  {
    "type": "SIMPLE",
    "sku": "simple_1",
    "customerGroupCode": "0",
    "websiteCode": "us",
    "parents": [],
    "regular": 100.0,
    "discounts": [],
    "deleted": false,
    "updatedAt": "2024-02-27T21:36:00.637Z"
  },
  {
    "type": "SIMPLE",
    "sku": "simple_2",
    "customerGroupCode": "0",
    "websiteCode": "us",
    "parents": [],
    "regular": 50.0,
    "discounts": [],
    "deleted": false,
    "updatedAt": "2024-02-27T21:36:00.637Z"
  },
  {
    "type": "SIMPLE",
    "sku": "simple_3",
    "customerGroupCode": "0",
    "websiteCode": "us",
    "parents": [],
    "regular": 20.0,
    "discounts": [],
    "deleted": false,
    "updatedAt": "2024-02-27T21:36:00.637Z"
  },
  {
    "type": "SIMPLE",
    "sku": "simple_4",
    "customerGroupCode": "0",
    "websiteCode": "us",
    "parents": [],
    "regular": 30.0,
    "discounts": [],
    "deleted": false,
    "updatedAt": "2024-02-27T21:36:00.637Z"
  }
]
```

### Define categories

This example defines 4 categories as shown above:
NOTE: categoryId and urlPath have to be aligned with categoryData.categoryId and categoryData.categoryPath from Product API fields accordingly

```text
|cat1
|__cat2
|____cat3_1
|____cat3_2
```

API Reference: [Categories API](./data-ingestion/data-ingestion/#tag/categories/operation/PostV1CategoryFeed)
API Payload:

```json
[
  {
    "categoryId": "cat1",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Default Category",
    "description": "Welcome text",
    "displayMode": "PRODUCTS",
    "urlKey": "default-category",
    "image": null,
    "level": 1,
    "path": "1/cat1",
    "children": [
      "cat2"
    ],
    "position": 1,
    "defaultSortBy": "position",
    "availableSortBy": null,
    "isAnchor": 0,
    "includeInMenu": 1,
    "isActive": 1,
    "createdAt": "2024-02-26 15:49:38",
    "updatedAt": "2024-02-26 15:49:38",
    "modifiedAt": "2024-02-26 15:49:38",
    "deleted": false
  },
  {
    "categoryId": "cat2",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Category 1",
    "urlKey": "category1",
    "urlPath": "category1",
    "image": null,
    "level": 2,
    "path": "1/cat1/cat2",
    "position": 2,
    "children": [
      "cat3_1",
      "cat3_2"
    ],
    "defaultSortBy": "position",
    "availableSortBy": null,
    "isAnchor": 1,
    "includeInMenu": 1,
    "isActive": 1,
    "createdAt": "2024-02-26 15:49:38",
    "updatedAt": "2024-02-26 15:49:38",
    "modifiedAt": "2024-02-26 15:49:38",
    "deleted": false
  },
  {
    "categoryId": "cat3_1",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Category 1-1",
    "urlKey": "category-1-1",
    "urlPath": "category1/category-1-1",
    "image": null,
    "level": 3,
    "path": "1/cat1/cat2/cat3_1",
    "children": null,
    "position": 2,
    "defaultSortBy": "position",
    "availableSortBy": null,
    "isAnchor": 1,
    "includeInMenu": 1,
    "isActive": 1,
    "createdAt": "2024-02-26 15:49:38",
    "updatedAt": "2024-02-26 15:49:38",
    "modifiedAt": "2024-02-26 15:49:38",
    "deleted": false
  },
  {
    "categoryId": "cat3_2",
    "websiteCode": "us",
    "storeCode": "us",
    "storeViewCode": "us_en",
    "name": "Category 1-2",
    "urlKey": "category-1-2",
    "urlPath": "category1/category-1-2",
    "image": null,
    "level": 3,
    "path": "1/cat1/cat2/cat3_2",
    "children": null,
    "position": 2,
    "defaultSortBy": "position",
    "availableSortBy": null,
    "isAnchor": 1,
    "includeInMenu": 1,
    "isActive": 1,
    "createdAt": "2024-02-26 15:49:38",
    "updatedAt": "2024-02-26 15:49:38",
    "modifiedAt": "2024-02-26 15:49:38",
    "deleted": false
  }
]
```

# Service-specific Configuration API

TODO:
https://wiki.corp.adobe.com/display/ACDS/Feed+Ingestion+Service+-+notes+for+public+docs#FeedIngestionServicenotesforpublicdocs-Service-specificConfigurationAPI
