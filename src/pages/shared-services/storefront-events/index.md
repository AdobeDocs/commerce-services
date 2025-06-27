---
title: Storefront events | Commerce Services
description: Learn how to use the storefront events SDK and collector package to programmatically access Adobe Commerce storefront events.
keywords:
  - Events
  - Services
  - Storefront
---

# Adobe Commerce storefront events

When you install Adobe Commerce, storefront events are deployed to your site automatically. These events capture data from shoppers' interactions on your site. If you enable SaaS-based Adobe Commerce features such as [Product Recommendations](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/getting-started/install-configure), [Live Search](https://experienceleague.adobe.com/en/docs/commerce/live-search/install), or [Data Connection](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/install) additional modules are installed to collect behavioral data for specific events. This anonymized data powers Product Recommendations and Live Search, or in the case of Data Connection, is sent to Adobe Experience Platform for further analysis.

In this topic you learn:

- What storefront events are available through the Product Recommendations, Live Search, and Data Connection modules?
- What events are supported across different frameworks, such as Commerce Storefront on Edge Delivery Services, Luma/PHP, PWA, and Adobe Experience Platform?
- How can you publish, subscribe to , and handle storefront events for Live Search and Product Recommendations?
- What is the complete list of storefront events that are available?

## Available events based on module

The following section lists the events from which each module collects behavioral data.

<InlineAlert variant="info" slots="text"/>

Product Recommendations and Live Search also use other non-module specific events to populate dashboards, inform ranking strategies, and help Adobe Sensei interpret shopper data correctly.

### Product Recommendations

The Product Recommendations module collects behavioral data from the following events:

- [impression-render](#impression-render)
- [rec-add-to-cart-click](#rec-add-to-cart-click)
- [rec-click](#rec-click)
- [view](#view)

[Learn more](./feature/prex-events.md) about how Product Recommendations uses behavioral data.

### Live Search

The Live Search module collects behavioral data from the following events:

- [searchProductClick](#searchproductclick)
- [searchRequestSent](#searchrequestsent) (also part of the [Data Connection](#data-connection) list.)
- [searchResponseReceived](#searchresponsereceived) (also part of the [Data Connection](#data-connection) list.)
- [searchResultsView](#searchresultsview)
- [searchSuggestionClick](#searchsuggestionclick)

[Learn more](./feature/ls-events.md) about how Live Search uses behavioral data.

### Data Connection

The Data Connection module collects behavioral data from the following categories of events:

#### General

- [addToCart](#addtocart)
- [openCart](#opencart)
- [removeFromCart](#removefromcart)
- [shoppingCartView](#shoppingcartview)
- [pageView](#pageview)
- [productPageView](#productpageview)
- [startCheckout](#startcheckout)
- [completeCheckout](#completecheckout)

#### Profile

- [signIn](#signin)
- [signOut](#signout)
- [createAccount](#createaccount)
- [editAccount](#editaccount)

#### Search

These events are also part of the [Live Search](#live-search) collection of events.

- [searchRequestSent](#searchrequestsent)
- [searchResponseReceived](#searchresponsereceived)

#### B2B

- [createRequisitionList](#createrequisitionlist)
- [addToRequisitionList](#addtorequisitionlist)
- [removeFromRequisitionList](#removefromrequisitionlist)
- [deleteRequisitionList](#deleterequisitionlist)

[Learn more](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data#data-collection) about how Data Connection uses behavioral data.

## Supported events

The list of supported events can differ between eventing frameworks. The following tables describe the events supported on each framework and the equivalent event names.

#### Event names by framework

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

#### Event support by framework

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

## Publish, subscribe, and handle the storefront events

Adobe provides an eventing framework from Adobe Commerce that you can use to programmatically access Adobe Commerce storefront events.

<InlineAlert variant="info" slots="text"/>

If you are using the Data Connection module, the module deploys these SDKs for you. [Learn more](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data#data-collection).

- [**Adobe Commerce Storefront Events SDK**](sdk/index.md)—Provides access to a common data layer and an event publishing/subscription service.
- [**Adobe Commerce Storefront Events Collector**](collector/index.md)—Listens for and handles events sent from the SDK.

## Complete list of storefront events

The following section lists all the events deployed to your storefront.

### addToCart

|Description| XDM event name|
|---|---|
|Triggered when a product is added to the cart or when the quantity of a product in the cart is incremented.|`commerce.productListAdds`|

#### Data collected from addToCart

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.productListAdds`|Indicates if a product was added to a shopping cart. A value of `1` indicates that a product was added.|
|`commerce.cart.cartID`|The unique ID that identifies the customer's cart.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### openCart

|Description| XDM event name|
|---|---|
|Triggered when a new cart is created, which is when a product is added to an empty cart.|`commerce.productListOpens`|

#### Data collected from openCart

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.productListOpens`|Indicates if a cart was created. A value of `1` indicates that a cart was created.|
|`commerce.cart.cartID`|The unique ID that identifies the customer's cart.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### removeFromCart

|Description| XDM event name|
|---|---|
|Triggered every time a product is removed or every time the quantity of a product in the cart is decremented.|`commerce.productListRemovals`|

#### Data collected from removeFromCart

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.productListRemovals`|Indicates if a product was removed from the cart. A value of `1` indicates that a product was removed from the cart.|
|`commerce.cart.cartID`|The unique ID that identifies the customer's cart.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### shoppingCartView

|Description| XDM event name|
|---|---|
|Triggered when any cart page loads.|`commerce.productListViews`|

#### Data collected from shoppingCartView

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.productListViews`|Indicates if a product list was viewed.|
|`commerce.cart.cartID`|The unique ID that identifies the customer's cart.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`commerce.order`|Contains information about the pending order for one or more products.|
|`commerce.order.discountAmount`|Indicates the discount amount applied to the whole order.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### pageView

|Description| XDM event name|
|---|---|
|Triggered when any page loads.|`web.webpagedetails.pageViews`|

#### Data collected from pageView

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`web.webPageDetails.pageViews`|Indicates if a page was loaded. A `value` of `1` indicates that the page was loaded.|
|`web.webPageDetails.URL`|The normative or usual URL of the web page. This can be the actual URL used to reach the page, which would be recorded using `Web Link`.|
|`web.webPageDetails.name`|The normative name of the web page. This name is not necessarily the page title or directly associated with page content, but is used to organize a site's pages for classification purposes.|
|`web.webReferrer.URL`|The URL of the webpage a shopper visited before clicking a link to your site.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### productPageView

|Description| XDM event name|
|---|---|
|Triggered when any product page loads.|`commerce.productViews`|

#### Data collected from productPageView

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.productViews`|Indicates if the product was viewed.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### startCheckout

|Description| XDM event name|
|---|---|
|Triggered when the shopper clicks a checkout button.|`commerce.checkouts`|

#### Data collected from startCheckout

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.checkouts`|Indicates if an action occurred during the checkout process.|
|`commerce.cart.cartID`|The unique ID that identifies the customer's cart.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### completeCheckout

|Description| XDM event name|
|---|---|
|Triggered when the shopper places an order.|`commerce.purchases`|

#### Data collected from completeCheckout

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.purchases`|Indicates if an order has been accepted.|
|`commerce.order`|Contains information about the placed order for one or more products.|
|`commerce.order.purchaseID`|Unique identifier assigned by the seller for this purchase or contract. There is no guarantee that the ID is unique.|
|`commerce.order.payments`|The list of payments for this order.|
|`commerce.order.payments.paymentTransactionID`|Unique identifier for this payment transaction.|
|`commerce.order.payments.paymentAmount`|The value of the payment.|
|`commerce.order.payments.paymentType`|The method of payment for this order. Options are: `cash`, `credit_card`, `debit_card`, `gift_card`, `check`, `paypal`, `wire_transfer`, `credit_card_reference`, `other`.|
|`commerce.order.payments.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`commerce.order.taxAmount`|The tax amount paid by the buyer as part of the final payment.|
|`commerce.order.discountAmount`|Indicates the discount amount applied to the whole order.|
|`commerce.order.createdDate`|The time and date when a new order is created in the commerce system. For example, `2022-10-15T20:20:39+00:00`.|
|`commerce.shipping`|Shipping details for one or more products.|
|`commerce.shipping.shippingMethod`|The method of shipping chosen by the customer, such as standard delivery, expedited delivery, pick up in store, and so on.|
|`commerce.shipping.shippingAmount`|The amount the customer had to pay for shipping.||`shipping`|Shipping details for one or more products.|
|`commerce.shipping.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`personalEmail`|A personal email address.|
|`personalEmail.address`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### signIn

|Description| XDM event name|
|---|---|
|Triggered when a shopper attempts to sign in.|`userAccount.login`|

<InlineAlert variant="info" slots="text"/>

This event is triggered when the specific action is attempted. It does not indicate that the action was successful.

#### Data collected from signIn

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`person`|An individual actor, contact, or owner.|
|`person.accountID`|Captures the user account ID.|
|`person.accountType`|Captures the user account type, such as `Personal` or `Company`, if applicable.|
|`person.personalEmailID`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`personalEmail`|Captures contact details - an e-mail and associated information.|
|`personalEmail.address`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`userAccount`|Indicates any loyalty details, preferences, login processes, and other account preferences.|
|`userAccount.login`|Indicates if a visitor attempted to log in.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### signOut

|Description| XDM event name|
|---|---|
|Triggered when a shopper attempts to sign out.|`userAccount.logout`|

<InlineAlert variant="info" slots="text"/>

This event is triggered when the specific action is attempted. It does not indicate that the action was successful.

#### Data collected from signOut

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`userAccount`|Indicates any loyalty details, preferences, login processes, and other account preferences.|
|`userAccount.logout`|Indicates if a visitor attempted to log out.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### createAccount

|Description| XDM event name|
|---|---|
|Triggered when a shopper attempts to create an account.|`userAccount.createProfile`|

<InlineAlert variant="info" slots="text"/>

This event is triggered when the specific action is attempted. It does not indicate that the action was successful.

#### Data collected from createAccount

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`person`|An individual actor, contact, or owner.|
|`person.accountID`|Captures the user account ID.|
|`person.accountType`|Captures the user account type, such as `Personal` or `Company`, if applicable.|
|`person.personalEmailID`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`personalEmail`|Captures contact details - an e-mail and associated information.|
|`personalEmail.address`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`userAccount`|Indicates any loyalty details, preferences, login processes, and other account preferences.|
|`userAccount.updateProfile`|Indicates if a user has updated their account profile.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### editAccount

|Description| XDM event name|
|---|---|
|Triggered when a shopper attempts to edit an account.|`userAccount.updateProfile`|

<InlineAlert variant="info" slots="text"/>

This event is triggered when the specific action is attempted. It does not indicate that the action was successful.

#### Data collected from editAccount

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`person`|An individual actor, contact, or owner.|
|`person.accountID`|Captures the user account ID.|
|`person.accountType`|Captures the user account type, such as `Personal` or `Company`, if applicable.|
|`person.personalEmailID`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`personalEmail`|Captures contact details - an e-mail and associated information.|
|`personalEmail.address`|The technical address, for example, `name@domain.com` as commonly defined in RFC2822 and subsequent standards.|
|`userAccount`|Indicates any loyalty details, preferences, login processes, and other account preferences.|
|`userAccount.updateProfile`|Indicates if a user has updated their account profile.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### createRequisitionList

|Description| XDM event name|
|---|---|
|Triggered when a shopper creates a requisition list.|`commerce.requisitionListOpens`|

#### Data collected from createRequisitionList

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.requisitionListOpens`|Indicates initialization of a new requisition list.|
|`commerce.requisitionList`|The properties of the requisition list created by the customer.|
|`commerce.requisitionList.ID`|Unique identifier of the requisition list.|
|`commerce.requisitionList.name`|Name of the requisition list specified by the customer.|
|`commerce.requisitionList.description`|Description of the requisition list specified by the customer.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### addToRequisitionList

|Description| XDM event name|
|---|---|
|Triggered when a shopper adds a product to an existing requisition list or while creating a list.|`commerce.requisitionListAdds`|

#### Data collected from addToRequisitionList

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.requisitionListAdds`|Indicates addition of one or more products to a requisition list.|
|`commerce.requisitionList`|The properties of the requisition list created by the customer.|
|`commerce.requisitionList.ID`|Unique identifier of the requisition list.|
|`commerce.requisitionList.name`|Name of the requisition list specified by the customer.|
|`commerce.requisitionList.description`|Description of the requisition list specified by the customer.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the requisition list.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### removeFromRequisitionList

|Description| XDM event name|
|---|---|
|Triggered when a shopper removes a product from a requisition list.|`commerce.requisitionListRemovals`|

#### Data collected from removeFromRequisitionList

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.requsitionListRemovals`|Indicates removal of one or more products from a requisition list.|
|`commerce.requisitionList`|The properties of the requisition list created by the customer.|
|`commerce.requisitionList.ID`|Unique identifier of the requisition list.|
|`commerce.requisitionList.name`|Name of the requisition list specified by the customer.|
|`commerce.requisitionList.description`|Description of the requisition list specified by the customer.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|
|`productListItems`|An array of products that were added to the requisition list.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.priceTotal`|The total price for the product line item.|
|`productListItems.quantity`|The number of product units in the cart.|
|`productListItems.discountAmount`|Indicates the discount amount applied.|
|`productListItems.currencyCode`|The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code used, such as `USD` or `EUR`.|
|`productListItems.selectedOptions`|Field used for a configurable product.|
|`productListItems.selectedOptions.attribute`|Identifies an attribute of the configurable product, such as `size` or `color`.|
|`productListItems.selectedOptions.value`|Identifies the value of the attribute such as `small` or `black`.|

### deleteRequisitionList

|Description| XDM event name|
|---|---|
|Triggered when a shopper deletes a requisition list.|`commerce.requisitionListDeletes`|

#### Data collected from deleteRequisitionList

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`commerce.requisitionListDeletes`|Indicates that a requisition list was deleted.|
|`commerce.requisitionList`|The properties of the requisition list created by the customer.|
|`commerce.requisitionList.ID`|Unique identifier of the requisition list.|
|`commerce.requisitionList.name`|Name of the requisition list specified by the customer.|
|`commerce.requisitionList.description`|Description of the requisition list specified by the customer.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### searchRequestSent

|Description| XDM event name|
|---|---|
|Triggered by the following events in the "search as you type" popover: Press Enter, Click _View All_. Triggered by the following events on search results pages: Select a filter, Change the sort order (_Sort By_), Change the sort direction (ascending or descending), Change the number of results per page (_Show # per page_), Navigate to the next page, Navigate to the previous page, Navigate to a different page|`searchRequest`|

<InlineAlert variant="info" slots="text"/>

Search events are not supported on an Adobe Commerce Enterprise Edition with the B2B extension installed.

#### Data collected from searchRequestSent

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`searchRequest`|Indicates if a search request was sent.|
|`searchRequest.id`|The unique ID for this particular search request.|
|`searchRequest.value`|The quantifiable value of the request.|
|`siteSearch`|Contains information about the search.|
|`siteSearch.filter`|Indicates if any filters were applied to limit search results.|
|`siteSearch.filter.attribute` (filter)|The facet of an item used to determine whether to include it in search results.|
|`siteSearch.filter.isRange`|When true, values indicate endpoints of an acceptable range of values.|
|`siteSearch.filter.value`|Attribute value used to determine which items are included in search results.|
|`siteSearch.sort`|Indicates how search results should be sorted.|
|`siteSearch.sort.attribute` (sort)|An attribute used to sort items in search results.|
|`siteSearch.sort.order`|The order in which to return search results.|
|`siteSearch.query`|The terms searched for.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### searchResponseReceived

|Description| XDM event name|
|---|---|
|Triggered when Live Search returns results for the "search as you type" popover or search results page.|`searchResponse`|

<InlineAlert variant="info" slots="text"/>

Search events are not supported on an Adobe Commerce Enterprise Edition with the B2B extension installed.

#### Data collected from searchResponseReceived

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`channel`|Contains information about the source of the data. Both `_id` and `_type` contain [namespaced values](https://experienceleague.adobe.com/docs/experience-platform/xdm/schema/namespaces.html).|
|`channel._id`|The unique identifier of the channel, such as `"https://ns.adobe.com/xdm/channels/web"`.|
|`channel._type`|Identifies the source of the channel data, such as `"https://ns.adobe.com/xdm/channel-types/web"`.|
|`searchResponse`|Indicates if a search response has been received.|
|`searchResponse.id`|The unique ID for this particular search response.|
|`searchResponse.value`|The quantifiable value of the response.|
|`siteSearch.numberOfResults`|The number of products returned.|
|`siteSearch.suggestions`|An array of strings that include the names of products and categories that exist in the catalog that are similar to the search query.|
|`productListItems`|An array of products that were added to the shopping cart.|
|`productListItems.SKU`|Stock Keeping Unit. The unique identifier for the product.|
|`productListItems.name`|The display name or human-readable name of the product.|
|`productListItems.productImageUrl`|Main image URL of the product.|
|`commerce.commerceScope`|Indicates where an event occurred (store view, store, website, and so on).|
|`commerce.commerceScope.environmentID`|The environment ID. A 32-digit alphanumeric ID separated by hyphens.|
|`commerce.commerceScope.storeCode`|The unique store code. You can have many stores per website.|
|`commerce.commerceScope.storeViewCode`|The unique store view code. You can have many store views per store.|
|`commerce.commerceScope.websiteCode`|The unique website code. You can have many websites in an environment.|

### searchProductClick

|Description| XDM event name|
|---|---|
|Triggered when a shopper clicks a product in the "search as you type" popover or on the search results page.|Not applicable|

<InlineAlert variant="info" slots="text"/>

Search events are not supported on an Adobe Commerce Enterprise Edition with the B2B extension installed.

#### Data collected from searchProductClick

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`searchResults`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/searchResults.ts)|

### searchResultsView

|Description| XDM event name|
|---|---|
|Triggered when results appear in the "search as you type" popover or search results page.|Not applicable|

<InlineAlert variant="info" slots="text"/>

Search events are not supported on an Adobe Commerce Enterprise Edition with the B2B extension installed.

#### Data collected from searchResultsView

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`searchResults`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/searchResults.ts)|

### searchSuggestionClick

|Description| XDM event name|
|---|---|
|Triggered when a shopper clicks a product suggestion in the "search as you type" popover.|Not applicable|

<InlineAlert variant="info" slots="text"/>

Search events are not supported on an Adobe Commerce Enterprise Edition with the B2B extension installed.

#### Data collected from searchSuggestionClick

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`searchResults`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/searchResults.ts)|

### impression-render

|Description| XDM event name|
|---|---|
|Triggered when the recommendation unit is rendered on the page. If a page has two recommendation units (bought-bought, view-view), then two `impression-render` events are sent. This event is used to track the metric for impressions.|Not applicable|

#### Data collected from impression-render

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`recommendations`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/recommendations.ts)|

### rec-add-to-cart-click

|Description| XDM event name|
|---|---|
|Triggered when the shopper clicks the **Add to cart** button for an item in the recommendation unit. |Not applicable|

#### Data collected from rec-add-to-cart-click

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`recommendations`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/recommendations.ts)|

### rec-click

|Description| XDM event name|
|---|---|
|Triggered when the shopper clicks a product in the recommendation unit. |Not applicable|

#### Data collected from rec-click

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`recommendations`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/recommendations.ts)|

### view

|Description| XDM event name|
|---|---|
|Triggered when the recommendation unit becomes at least 50 percent viewable, such as by scrolling down the page. For example, if a recommendation unit has two lines, a `view` event is sent when one line plus one pixel of the second line becomes visible to the shopper. If the shopper scrolls the page up and down several times, the `view` event is sent as many times as the shopper sees the whole recommendation unit again on the page.|Not applicable|

#### Data collected from view

The following table describes the data collected for this event.

|Field|Description|
|---|---|
|`page`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/page.ts)|
|`storefront`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/storefrontInstance.ts)|
|`recommendations`|[schema](https://github.com/adobe/commerce-events/blob/main/packages/storefront-events-sdk/src/types/schemas/recommendations.ts)|
