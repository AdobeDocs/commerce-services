---
title: Product Recommendations Events | Commerce Services
description: Lists events in the Adobe Commerce Event SDK that are applicable to Product Recommendations. 
keywords:
  - Product Recommendations
  - Services
---

# Product Recommendations Events

The [storefront events](../index.md#complete-list-of-storefront-events) topic lists all the events deployed to your storefront. In that list, there is a subset of events specific to [!DNL Product Recommendations]. These events collect data when shoppers interact with recommendation units on the storefront and power the metrics to analyze how well your recommendations are performing.

See the [list of events](../index.md#product-recommendations) specific to [!DNL Product Recommendations].

<InlineAlert variant="info" slots="text"/>

Product Recommendation metrics are optimized for Luma storefronts. If your storefront is implemented with PWA Studio, refer to the [PWA documentation](https://developer.adobe.com/commerce/pwa-studio/integrations/product-recommendations/). If you use a custom frontend technology such as React or Vue JS, learn how to integrate [Product Recommendations in a headless](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/getting-started/headless) environment.

## Required dashboard events

The following events are required to populate the [[!DNL Product Recommendations] dashboard](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/admin/workspace).

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

## Recommendation Type

This table describes the events used by each recommendation type.

| Recommendation Type | Events | Page |
| --- | --- | --- |
| Most Viewed | `page-view`<br>`product-view` | Product detail page |
| Most Purchased | `page-view`<br>`place-order` | Cart/Checkout |
| Most added to cart | `page-view`<br>`add-to-cart` | Product detail page<br>Product listing page<br>Cart<br>Wish List |
| Viewed this, viewed that | `page-view`<br>`product-view` | Product detail page |
| Viewed this, bought that | Product Recs | `page-view`<br>`product-view` | Product detail page<br>Cart/Checkout |
| Bought this, bought that | Product Recs | `page-view`<br>`product-view` | Product detail page |
| Trending | `page-view`<br>`product-view` | Product detail page |
| Conversion: View to purchase | Product Recs | `page-view`<br>`product-view` | Product detail page |
| Conversion: View to purchase | Product Recs | `page-view`<br>`place-order` | Cart/Checkout |
| Conversion: View to cart | Product Recs | `page-view`<br>`product-view` | Product detail page |
| Conversion: View to cart | Product Recs | `page-view`<br>`add-to-cart` | Product detail page<br>Product listing page<br>Cart<br>Wishlist |
