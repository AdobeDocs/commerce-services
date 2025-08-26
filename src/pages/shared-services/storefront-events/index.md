---
title: Storefront events | Commerce Services
description: Learn how to use the storefront events SDK and collector package to programmatically access Adobe Commerce storefront events.
keywords:
  - Events
  - Services
  - Storefront
---

# Adobe Commerce storefront events

When you install Adobe Commerce, storefront events are deployed to your site. These events capture data from shoppers' interactions on your site. When you install and configure SaaS-based Adobe Commerce features such as [Product Recommendations](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/getting-started/install-configure), [Live Search](https://experienceleague.adobe.com/en/docs/commerce/live-search/install), or [Data Connection](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/install) the modules deploy behavioral data collection to your storefront for specific events. This mechanism collects anonymized behavioral data from the events and help to power Product Recommendations and Live Search or in the case of Data Connection, send that behavioral data to the Adobe Experience Platform.

## Publish, subscribe, and handle the storefront events

Adobe provides an eventing framework that you can use to programmatically access Adobe Commerce storefront events.

<InlineAlert variant="info" slots="text"/>

If you are using the Data Connection module, the module deploys the eventing framework for you. [Learn more](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data#data-collection).

- [**Adobe Commerce Storefront Events SDK**](sdk/index.md)—Provides access to a common data layer and an event publishing/subscription service.
- [**Adobe Commerce Storefront Events Collector**](collector/index.md)—Listens for and handles events sent from the SDK.

## Available events based on module

The following section lists the events from which each module collects behavioral data.

<InlineAlert variant="info" slots="text"/>

Product Recommendations and Live Search also use other non-module specific events to populate dashboards, inform ranking strategies, and help Adobe Sensei interpret shopper data correctly.

### Product Recommendations

The Product Recommendations module collects behavioral data from the following events:

- [impression-render](./reference/storefront-events.md#impression-render)
- [rec-add-to-cart-click](./reference/storefront-events.md#rec-add-to-cart-click)
- [rec-click](./reference/storefront-events.md#rec-click)
- [view](./reference/storefront-events.md#view)

Although Product Recommendation metrics are optimized for Luma storefronts, they also work with other storefront implementations:

- [Edge Delivery Storefront](https://experienceleague.adobe.com/developer/commerce/storefront/setup/analytics/instrumentation/)
- [PWA Studio](https://developer.adobe.com/commerce/pwa-studio/integrations/product-recommendations/)
- [Custom frontent (React, Vue JS)](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/getting-started/headless)

#### Required dashboard events

The following events are required to populate the [Product Recommendations dashboard](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/admin/workspace). 

<InlineAlert variant="info" slots="text"/>

If you do not see any statistics appearing in your dashboard, ensure that the required events are implemented and being tracked on your site. See [Verify event collection](collector/verify.md).

| Dashboard column | Events    | Join field  |
| ---------------- | --------- | ----------- |
| Impressions      |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-unit-render` | `unitId`  |
| Views            |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-unit-render`, `recs-unit-view` | `unitId`  |
| Clicks           |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-item-click`, `recs-add-to-cart-click`    | `unitId`  |
| Revenue          |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-item-click`, `recs-add-to-cart-click`, `place-order` | `unitId`, `sku`, `parentSku` |
| LT Revenue       |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-item-click`, `recs-add-to-cart-click`, `place-order` | `unitId`, `sku`, `parentSku` |
| CTR              |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-unit-render`, `recs-item-click`, `recs-add-to-cart-click`  | `unitId`, `sku`, `parentSku` |
| vCTR             |`page-view`, `recs-request-sent`, `recs-response-received`, `recs-unit-render`, `recs-unit-view`, `recs-item-click`, `recs-add-to-cart-click` | `unitId`, `sku`, `parentSku` |

The following events are not specific to Product Recommendations, but are required for Adobe Sensei to interpret shopper data correctly:

- `view`
- `add-to-cart`
- `place-order`

#### Recommendation Type

This table describes the events used by each recommendation type.

| Recommendation Type | Events | Page |
| --- | --- | --- |
| Most Viewed | `page-view`, `product-view` | Product detail page |
| Most Purchased | `page-view`, `place-order` | Cart/Checkout |
| Most added to cart | `page-view`, `add-to-cart` | Product detail page, Product listing page, Cart, Wish List |
| Viewed this, viewed that | `page-view`, `product-view` | Product detail page |
| Viewed this, bought that | Product Recs | `page-view`, `product-view` | Product detail page, Cart/Checkout |
| Bought this, bought that | Product Recs | `page-view`, `product-view` | Product detail page |
| Trending | `page-view`, `product-view` | Product detail page |
| Conversion: View to purchase | Product Recs | `page-view`, `product-view` | Product detail page |
| Conversion: View to purchase | Product Recs | `page-view`, `place-order` | Cart/Checkout |
| Conversion: View to cart | Product Recs | `page-view`, `product-view` | Product detail page |
| Conversion: View to cart | Product Recs | `page-view`, `add-to-cart` | Product detail page, Product listing page, Cart, Wishlist |

### Live Search

The Live Search module collects behavioral data from the following events:

- [searchProductClick](./reference/storefront-events.md#searchproductclick)
- [searchRequestSent](./reference/storefront-events.md#searchrequestsent) (also part of the [Data Connection](#data-connection) list.)
- [searchResponseReceived](./reference/storefront-events.md#searchresponsereceived) (also part of the [Data Connection](#data-connection) list.)
- [searchResultsView](./reference/storefront-events.md#searchresultsview)
- [searchSuggestionClick](./reference/storefront-events.md#searchsuggestionclick)

#### Events used for ranking strategy

The following table describes the events used by Live Search [ranking strategies](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/rules/rules-add#intelligent-ranking).

| Ranking Strategy | Events | Page |
| --- | --- | --- |
| Most Viewed |  `page-view`, `product-view` | Product detail page |
| Most Purchased |  `page-view`, `place-order` | Cart/Checkout |
| Most added to cart |  `page-view`, `add-to-cart` | Product detail page, Product listing page, Cart, Wish List |
| Viewed this, viewed that |  `page-view`, `product-view` | Product detail page |

<InlineAlert variant="info" slots="text"/>

Data collection for the purposes of Live Search does not include personally identifiable information (PII). All user identifiers, such as cookie IDs and IP addresses, are strictly anonymized. [Learn more](https://www.adobe.com/privacy/experience-cloud.html).

#### Required dashboard events

Some events are required to populate the [Live Search dashboard](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/performance).

<InlineAlert variant="info" slots="text"/>

If you do not see any statistics appearing in your dashboard, ensure that the required events are implemented and being tracked on your site. See [Verify event collection](collector/verify.md).

| Dashboard area        | Events      | Join field |
| ------------------- | ------------- | ---------- |
| Unique searches       |`page-view`, `search-request-sent`, `search-response-received` | `searchRequestId`  |
| Zero results searches |`page-view`, `search-request-sent`,  `search-response-received` | `searchRequestId`  |
| Zero results rate     |`page-view`, `search-request-sent`,  `search-response-received` | `searchRequestId`  |
| Popular searches      |`page-view`, `search-request-sent`,  `search-response-received` | `searchRequestId`  |
| Avg. click position   |`page-view`, `search-request-sent`, `search-response-received`, `search-results-view`, `search-product-click`   | `searchRequestId`      |
| Click-through rate    |`page-view`, `search-request-sent`, `search-response-received`, `search-results-view`, `search-product-click`   | `searchRequestId`, `sku`, `parentSku` |
| Conversion rate       |`page-view`, `search-request-sent`, `search-response-received`, `search-results-view`, `search-product-click`, `product-view`, `add-to-cart`, `place-order`| `searchRequestId`, `sku`, `parentSku` |

#### Required contexts

All events require the `Page` and `Storefront` contexts. This should happen at the page level/storefront application layer rather than when generating individual events. For example, in a PHP storefront, the PHP application container is responsible for setting them at runtime.

#### Usage

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

#### Caveats

- Ad blockers and privacy settings can prevent events from being captured and might cause the engagement and revenue [metrics](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/performance) to be under-reported. Additionally, some events might not be sent due to shoppers leaving the page or network issues.
- Headless implementations must implement eventing to power intelligent merchandising.

<InlineAlert variant="info" slots="text"/>

If [Cookie Restriction Mode](https://experienceleague.adobe.com/docs/commerce-admin/start/compliance/privacy/compliance-cookie-law.html) is enabled, Adobe Commerce does not collect behavioral data until the shopper consents to using cookies. If Cookie Restriction Mode is disabled, Adobe Commerce collects behavioral data by default.

### Data Connection

The Data Connection module collects behavioral data from the following categories of events:

#### General

- [addToCart](./reference/storefront-events.md#addtocart)
- [openCart](./reference/storefront-events.md#opencart)
- [removeFromCart](./reference/storefront-events.md#removefromcart)
- [shoppingCartView](./reference/storefront-events.md#shoppingcartview)
- [pageView](./reference/storefront-events.md#pageview)
- [productPageView](./reference/storefront-events.md#productpageview)
- [startCheckout](./reference/storefront-events.md#startcheckout)
- [completeCheckout](./reference/storefront-events.md#completecheckout)

#### Profile

- [signIn](./reference/storefront-events.md#signin)
- [signOut](./reference/storefront-events.md#signout)
- [createAccount](./reference/storefront-events.md#createaccount)
- [editAccount](./reference/storefront-events.md#editaccount)

#### Search

These events are also part of the [Live Search](#live-search) collection of events.

- [searchRequestSent](./reference/storefront-events.md#searchrequestsent)
- [searchResponseReceived](./reference/storefront-events.md#searchresponsereceived)

#### B2B

- [createRequisitionList](./reference/storefront-events.md#createrequisitionlist)
- [addToRequisitionList](./reference/storefront-events.md#addtorequisitionlist)
- [removeFromRequisitionList](./reference/storefront-events.md#removefromrequisitionlist)
- [deleteRequisitionList](./reference/storefront-events.md#deleterequisitionlist)

[Learn more](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data#data-collection) about how Data Connection uses behavioral data.
