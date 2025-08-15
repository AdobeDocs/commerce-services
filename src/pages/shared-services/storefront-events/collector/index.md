---
title: Adobe Commerce Event Collector | Commerce Services
description: Learn how to listen for (and handle) Adobe Commerce storefront events emitted by the events SDK.
keywords:
  - Events
  - Services
  - Storefront
---

# Adobe Commerce Event Collector

This package listens for and handles events sent from the [Adobe Commerce Events SDK](../sdk/index.md). It runs as a side effect and is meant to be a convenience for users who want to send events to Adobe Commerce for processing.

## Installation

The collector can be used as a hosted script, or bundled in a JavaScript application. The script version is hosted on [cdn](https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-event-collector@1/dist/index.js), and the bundled version is hosted on [npm](https://www.npmjs.com/package/@adobe/magento-storefront-event-collector).

To load the SDK as a script, use the following snippet.

```html
<script src="https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-event-collector@1/dist/index.js"></script>
```

To install the script as a dependency, run this command.

```bash
npm install @adobe/magento-storefront-event-collector
```

>[!NOTE]
>
>To avoid any issues, make sure you keep the script or bundled version up to date with the latest release.

## Quick Start

After loading the collector script, or importing the package as shown below, there is nothing else to configure.

```bash
import "@adobe/magento-storefront-event-collector";
```

The collector then begins listening for events. When these events are fired, the collector runs the associated handler and sends the event along with any relevant information to Adobe Commerce for further processing.

## Supported events

The list of supported events can differ between eventing frameworks. The following tables describe the events supported on each framework and the equivalent event names.

### Event names by framework

| Event| Storefront Events SDK (adobeDataLayer) | Commerce (Snowplow)| Adobe Experience Platform   |
| --- | --- | --- | --- |
| add to requisition list      | addToRequisitionList    | ❌    | xdm namespace: commerce<br/>xdm type: requisitionListAdds     |
| cart open     | openCart  | ❌    | xdm namespace: commerce<br/>xdm type: productListOpens        |
| cart view     | shoppingCartView        | category: shopping-cart<br/>action: view| xdm namespace: commerce<br/>xdm type: productListViews        |
| complete checkout   | placeOrder| category: checkout<br/>action: place-order       | xdm namespace: commerce<br/>xdm type: purchases|
| create account| createAccount  | ❌    | xdm namespace: userAccount<br/>xdm type: createProfile        |
| create requisition list      | createRequisitionList   | ❌    | xdm namespace: commerce<br/>xdm type: requisitionListOpens    |
| edit account  | editAccount    | ❌    | xdm namespace: userAccount<br/>xdm type: updateProfile        |
| page view     | pageView  | category: ---<br/>action: Pageview | xdm namespace: web.webpagedetails<br/>xdm type: pageViews     |
| product adds to cart | addToCart | category: product<br/>action: add-to-cart        | xdm namespace: commerce<br/>xdm type: productListAdds|
| product remove from cart     | removeFromCart | ❌    | xdm namespace: commerce<br/>xdm type: productListRemovals     |
| product view  | productPageView| category: product<br/>action: view | xdm namespace: commerce<br/>xdm type: productViews   |
| recommendation item add to cart        | recsItemAddToCartClick  | category: recommendation-unit<br/>action: rec-add-to-cart-click | ❌  |
| recommendation item click     | recsItemClick  | category: recommendation-unit<br/>action: rec-click    | ❌  |
| recommendation request sent   | recsRequestSent| category: recommendation-unit<br/>action: api-request-sent      | ❌  |
| recommendation response received       | recsResponseReceived    | category: recommendation-unit<br/>action: api-response-received | ❌  |
| recommendation unit render    | recsUnitRender | category: recommendation-unit<br/>action: impression-render     | ❌  |
| recommendation unit view| recsUnitView   | category: recommendation-unit<br/>action: view   | ❌  |
| remove from requisition list | removeFromRequisitionList     | ❌    | xdm namespace: commerce<br/>xdm type: requisitionListRemovals |
| search category click        | searchCategoryClick     | category: search<br/>action: category-click      | ❌  |
| search product click| searchProductClick      | category: search<br/>action: product-click       | ❌  |
| search request sent | searchRequestSent       | category: search<br/>action: api-request-sent    | xdm namespace: ---<br/>xdm type: searchRequest |
| search response received     | searchResponseReceived  | category: search<br/>action: api-response-received     | xdm namespace: ---<br/>xdm type: searchResponse|
| search results view | searchResultsView       | category: search<br/>action: results-view        | ❌  |
| sign in       | signIn    | ❌    | xdm namespace: userAccount<br/>xdm type: login |
| sign out      | signOut   | ❌    | xdm namespace: userAccount<br/>xdm type: logout|
| start checkout| initiateCheckout        | category: shopping-cart<br/>action: initiate-checkout  | xdm namespace: commerce<br/>xdm type: checkouts|

### Event support by framework

| Event | Luma/PHP  ("Snowplow")  | Luma/PHP Adobe Experience Platform  | PWA Commerce ("Snowplow")| PWA Adobe Experience Platform  |
| --- | --- | --- | --- | --- |
| add to requisition list  | ❌ | PDP<br/>PLP<br/>Cart<br/>Account | ❌ | ❌ |
| cart open  | ❌ | PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart  | ❌ | ❌ |
| cart view  | Cart   | Cart   | Cart   | Cart<br/>Mini cart|
| complete checkout   | Checkout   | Checkout   | Checkout   | Checkout   |
| create account  | ❌ | Account| ❌ | Account|
| create requisition list  | ❌ | PDP<br/>PLP<br/>Cart<br/>Account | ❌ | ❌ |
| edit account| ❌ | Account| ❌ | Account|
| page view  | Landing page<br/>PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart<br/>Checkout | Landing page<br/>PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart<br/>Checkout | Landing page<br/>PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart<br/>Checkout | Landing page<br/>PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart<br/>Checkout |
| product add to cart | PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart  | PDP<br/>PLP (Browse)<br/>PLP (Search results)<br/>Cart  | PDP| PDP|
| product remove from cart | ❌ | Cart   | ❌ | ❌ |
| product view| PDP| PDP| PDP| PDP|
| recs item add to cart| Recs carousel | ❌ | Recs carousel | ❌ |
| recs item click | Recs carousel | ❌ | Recs carousel | ❌ |
| recs request sent   | Recs carousel | ❌ | Recs carousel | ❌ |
| recs response received   | Recs carousel | ❌ | Recs carousel | ❌ |
| recs unit render| Recs carousel | ❌ | Recs carousel | ❌ |
| recs unit view  | Recs carousel | ❌ | Recs carousel | ❌ |
| remove from requisition list | ❌ | Account| ❌ | ❌ |
| search category click| Search popover  | ❌ | ❌ | ❌ |
| search product click| Search popover  | ❌ | ❌ | ❌ |
| search request sent | Search popover<br/>PLP (Browse)<br/>PLP (Search results)   | Search popover<br/>PLP (Browse)<br/>PLP (Search results)   | ❌ | ❌ |
| search response received<br/> | Search popover<br/>PLP (Browse)<br/>PLP (Search results)   | Search popover<br/>PLP (Browse)<br/>PLP (Search results)   | ❌ | ❌ |
| search results view | Search popover<br/>PLP (Browse)<br/>PLP (Search results)   | ❌ | ❌ | ❌ |
| sign in| ❌ | Account| ❌ | Account|
| sign out   | ❌ | Account| ❌ | ❌ |
| start checkout  | Cart   | Cart   | Cart   | Cart<br/>Mini cart|

## Support

If you have any questions or encounter any issues, reach out here:

- [GitHub](https://github.com/adobe/commerce-events)
- [Zendesk](https://account.magento.com/customer/account/login/referer/aHR0cHM6Ly9hY2NvdW50Lm1hZ2VudG8uY29tL3plbmRlc2svbG9naW4vaW5kZXgv/)
