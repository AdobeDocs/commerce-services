---
title: Context for storefront events | Commerce Services 
description: Learn how to programmatically get and set context for Adobe Commerce storefront events.
keywords:
  - Events
  - Services
  - Storefront
---

# Context for storefront events

## Storefront instance context requirements

The fields needed to scope storefront events depend on your Adobe Commerce setup. Include the scope fields for your platform in the `StorefrontInstance` context before you publish events. A field being optional in the shared SDK type does not mean you can omit it for every platform.

| Storefront setup | Scope fields to include | How events are scoped |
|---|---|---|
| PaaS / Adobe Commerce as a Cloud Service  | `websiteCode`, `storeCode`, and `storeViewCode` | Adobe website, store, and store view |
| Adobe Commerce Optimizer | `viewId` and `locale` | Adobe Commerce Optimizer catalog view and locale |
| Adobe Commerce Optimizer + PaaS | `viewId` for Adobe Commerce Optimizer catalog scoping; Adobe scope codes where needed for PaaS transaction routing | Use the fields appropriate to each event path. Do not treat `storeViewCode` and `viewId` as interchangeable |

### PaaS / Adobe Commerce as a Cloud Service (SaaS)

For Adobe Commerce on cloud infrastructure (PaaS) and Adobe Commerce as a Cloud Service (SaaS) storefronts, provide the Adobe scope codes, including `storeViewCode`. This field identifies the store view used to scope the event. Do not rely on `storeViewId` alone as a substitute for `storeViewCode`.

```javascript
const storefrontCtx = {
    // Include the other required StorefrontInstance fields for your setup.
    websiteCode: 'website',
    storeCode: 'store',
    storeViewCode: 'default'
};
mse.context.setStorefrontInstance(storefrontCtx);
```

### Adobe Commerce Optimizer

For Adobe Commerce Optimizer storefront events, include `viewId` and `locale` in the storefront context. Use the catalog view ID for `viewId`. Do not use `storeViewCode` in its place.

```javascript
const storefrontCtx = {
    // Include the other required StorefrontInstance fields for your setup.
    viewId: '12345678-1234-1234-1234-123456789abc',
    locale: 'en-US'
};
mse.context.setStorefrontInstance(storefrontCtx);
```

### If a scope field is missing

A missing scope field might not produce a clear error when an event is published. The event can fail to associate with the intended store view or catalog view, and downstream aggregations might omit it or attribute it to the wrong scope.

For PaaS and Adobe Commerce as a Cloud Service (SaaS), a missing `storeViewCode` can prevent the event from appearing in catalog aggregations. For Adobe Commerce Optimizer, a missing `viewId` can cause events to fall back to an incorrect scope.

<InlineAlert variant="important" slots="text"/>

Do not assume that an event is correctly scoped just because publishing did not report an error.

### Verify the context

Before you rely on event data, inspect a published event's `StorefrontInstance` context and confirm that it contains the scope fields required for your storefront setup:

- **PaaS / Adobe Commerce as a Cloud Service (SaaS)**: `websiteCode`, `storeCode`, and `storeViewCode`
- **Adobe Commerce Optimizer**: `viewId` and `locale`
- **Adobe Commerce Optimizer + PaaS**: Confirm that the appropriate fields are present for the event's catalog or transaction path

The shared `StorefrontInstance` type can mark platform-specific fields as optional because it supports multiple storefront setups. Follow the platform-specific requirements in this section when you implement the context.

## Functions

The following functions get and set context data.

### mse.context.getCategory

Gets the `Category` context.

Syntax:

```javascript
mse.context.getCategory();
```

### mse.context.getCustomUrl

Gets the `CustomUrl` context.

Syntax:

```javascript
mse.context.getCustomUrl();
```

### mse.context.getMagentoExtension

Gets the `MagentoExtension` context.

Syntax:

```javascript
mse.context.getMagentoExtension();
```

### mse.context.getOrder

Gets the `Order` context.

Syntax:

```javascript
mse.context.getOrder();
```

### mse.context.getPage

Gets the `Page` context.

Syntax:

```javascript
mse.context.getPage();
```

### mse.context.getProduct

Gets the `Product` context.

Syntax:

```javascript
mse.context.getProduct();
```

### mse.context.getRecommendations

Gets the `Recommendations` context.

Syntax:

```javascript
mse.context.getRecommendations();
```

### mse.context.getReferrerUrl

Gets the `ReferrerUrl` context.

Syntax:

```javascript
mse.context.getReferrerUrl();
```

### mse.context.getSearchInput

Gets the `SearchInput` context.

Syntax:

```javascript
mse.context.getSearchInput();
```

### mse.context.getSearchResults

Gets the `SearchResults` context.

Syntax:

```javascript
mse.context.getSearchResults();
```

### mse.context.getShopper

Gets the `Shopper` context.

Syntax:

```javascript
mse.context.getShopper();
```

### mse.context.getShoppingCart

Gets the `ShoppingCart` context.

Syntax:

```javascript
mse.context.getShoppingCart();
```

### mse.context.getStorefrontInstance

Gets the `StorefrontInstance` context.

Syntax:

```javascript
mse.context.getStorefrontInstance();
```

### mse.context.getContext

Gets a custom `Context`.

|Name|Required|Description|
|---|---|---|
|`name`|Yes|`Context` name|

Syntax:

```javascript
mse.context.getContext(name);
```

### mse.context.setCategory

Sets the `Category` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`Category` context|

Syntax:

```javascript
mse.context.setCategory(categoryCtx);
```

### mse.context.setCustomUrl

Sets the `CustomUrl` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`CustomUrl` context|

Syntax:

```javascript
mse.context.setCustomUrl(customUrlCtx);
```

### mse.context.setMagentoExtension

Sets the `MagentoExtension` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`MagentoExtension` context|

Syntax:

```javascript
mse.context.setMagentoExtension(magentoExtensionCtx);
```

### mse.context.setOrder

Sets the `Order` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`Order` context|

Syntax:

```javascript
mse.context.setOrder(orderCtx);
```

### mse.context.setPage

Sets the `Page` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`Page` context|

Syntax:

```javascript
mse.context.setPage(pageCtx);
```

### mse.context.setProduct

Sets the `Product` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`Product` context|

Syntax:

```javascript
mse.context.setProduct(productCtx);
```

### mse.context.setRecommendations

Sets the `Recommendations` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`Recommendations` context|

Syntax:

```javascript
mse.context.setRecommendations(recommendationsCtx);
```

### mse.context.setReferrerUrl

Sets the `ReferrerUrl` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`ReferrerUrl` context|

Syntax:

```javascript
mse.context.setReferrerUrl(referrerUrlCtx);
```

### mse.context.setSearchInput

Sets the `SearchInput` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`SearchInput` context|

Syntax:

```javascript
mse.context.setSearchInput(searchInputCtx);
```

### mse.context.setSearchResults

Sets the `SearchResults` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`SearchResults` context|

Syntax:

```javascript
mse.context.setSearchResults(searchResultsCtx);
```

### mse.context.setShopper

Sets the `Shopper` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`Shopper` context|

Syntax:

```javascript
mse.context.setShopper(shopperCtx);
```

### mse.context.setShoppingCart

Sets the `ShoppingCart` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`ShoppingCart` context|

Syntax:

```javascript
mse.context.setShoppingCart(shoppingCartCtx);
```

### mse.context.setStorefrontInstance

Sets the `StorefrontInstance` context.

|Name|Required|Description|
|---|---|---|
|`context`|Yes|`StorefrontInstance` context|

Syntax:

```javascript
mse.context.setStorefrontInstance(storefrontCtx);
```

### mse.context.setContext

Sets a custom `Context`.

|Name|Required|Description|
|---|---|---|
|`name`|Yes|Context `name`|
|`context`|Yes|Custom context|

Syntax:

```javascript
mse.context.setContext(ctx);
```
