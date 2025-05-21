---
title: Live Search Events | Commerce Services
description: Lists events in the Adobe Commerce Event SDK that are applicable to Live Search. 
keywords:
  - Search
  - Services
---

# Live Search Events

The [storefront events](../index.md#supported-events) topic lists all the events deployed to your storefront. In that list, there is a subset of events specific to Live Search.

See the [list of events](../index.md#live-search) specific to Live Search.

## Events used for ranking strategy

The following table describes the events used by Live Search [ranking strategies](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/rules/rules-add#intelligent-ranking).

| Ranking Strategy | Events | Page |
| --- | --- | --- |
| Most Viewed |  `page-view`, `product-view` | Product detail page |
| Most Purchased |  `page-view`, `place-order` | Cart/Checkout |
| Most added to cart |  `page-view`, `add-to-cart` | Product detail page, Product listing page, Cart, Wish List |
| Viewed this, viewed that |  `page-view`, `product-view` | Product detail page |

<InlineAlert variant="info" slots="text"/>

Data collection for the purposes of Live Search does not include personally identifiable information (PII). All user identifiers, such as cookie IDs and IP addresses, are strictly anonymized. [Learn more](https://www.adobe.com/privacy/experience-cloud.html).

## Required dashboard events

Some events are required to populate the [Live Search dashboard](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/performance).

| Dashboard area        | Events      | Join field |
| ------------------- | ------------- | ---------- |
| Unique searches       |`page-view`, `search-request-sent`, `search-response-received` | `searchRequestId`  |
| Zero results searches |`page-view`, `search-request-sent`,  `search-response-received` | `searchRequestId`  |
| Zero results rate     |`page-view`, `search-request-sent`,  `search-response-received` | `searchRequestId`  |
| Popular searches      |`page-view`, `search-request-sent`,  `search-response-received` | `searchRequestId`  |
| Avg. click position   |`page-view`, `search-request-sent`, `search-response-received`, `search-results-view`, `search-product-click`   | `searchRequestId`      |
| Click-through rate    |`page-view`, `search-request-sent`, `search-response-received`, `search-results-view`, `search-product-click`   | `searchRequestId`, `sku`, `parentSku` |
| Conversion rate       |`page-view`, `search-request-sent`, `search-response-received`, `search-results-view`, `search-product-click`, `product-view`, `add-to-cart`, `place-order`| `searchRequestId`, `sku`, `parentSku` |

### Required contexts

All events require the `Page` and `Storefront` contexts. This should happen at the page level/storefront application layer rather than when generating individual events (for example, in a PHP storefront, the PHP application container is responsible for setting them at runtime).

## Usage

Here is a sample implementation of the `search-request-sent` event:

```javascript
const mse = window.magentoStorefrontEvents;

/* set in application container */
// mse.context.page(pageCtx);
// mse.context.setStorefrontInstance(storefrontCtx);

/* set before firing event */
mse.context.setSearchInput(searchInputCtx);
mse.publish.searchRequestSent("search-bar");
```

## Caveats

- Ad blockers and privacy settings can prevent events from being captured and might cause the engagement and revenue [metrics](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/performance) to be under-reported. Additionally, some events might not be sent due to shoppers leaving the page or network issues.
- Headless implementations must implement eventing to power intelligent merchandising.

<InlineAlert variant="info" slots="text"/>

If [Cookie Restriction Mode](https://experienceleague.adobe.com/docs/commerce-admin/start/compliance/privacy/compliance-cookie-law.html) is enabled, Adobe Commerce does not collect behavioral data until the shopper consents to using cookies. If Cookie Restriction Mode is disabled, Adobe Commerce collects behavioral data by default.
