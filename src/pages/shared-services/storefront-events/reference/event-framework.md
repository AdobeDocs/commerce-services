---
title: Storefront Events by Framework | Commerce Services
description: Learn which storefront events are supported on each framework.
keywords:
  - Events
  - Services
  - Storefront
---

# Storefront events by framework

The list of supported events can differ between eventing frameworks. The following tables describe the events supported on each framework and the equivalent event names.

## Event names by framework

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

## Event support by framework

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
