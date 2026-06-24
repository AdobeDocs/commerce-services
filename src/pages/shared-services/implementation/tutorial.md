---
title: Instrument checkout analytics for a Luma storefront | Commerce Services
description: Implement a custom Adobe Commerce module that publishes the placeOrder storefront event on the checkout success page for Luma-based storefronts.
keywords:
  - Events
  - Services
  - Storefront
---

# Instrument checkout analytics for a Luma storefront

This guide shows how to build a custom Adobe Commerce module that publishes the `placeOrder` event on the checkout success page for a Luma-based storefront. After you complete this guide, Adobe Commerce can receive the `placeOrder` event that [Product Recommendations](../storefront-events/index.md#product-recommendations) and [Live Search](../storefront-events/index.md#live-search) use for revenue and conversion metrics.

Adobe Commerce empties the cart server-side before the success page renders, so cart line items are unavailable when the page loads. This module uses a two-part approach:

1. A mixin snapshots cart data to `localStorage` immediately before checkout redirect.
2. A success-page component restores that data into SDK context, then publishes the event.

<InlineAlert variant="warning" slots="text"/>

The directory structure and code samples illustrate one implementation. Adjust module names, paths, and context values for your environment.

## Overview

You create a `Vendor_CheckoutAnalytics` module with these files:

| File | Purpose |
|---|---|
| `registration.php` | Registers the module with Adobe Commerce |
| `etc/module.xml` | Declares module dependencies |
| `view/frontend/requirejs-config.js` | Registers the mixin and SDK/collector CDN paths |
| `view/frontend/layout/checkout_onepage_success.xml` | Loads the success-page component |
| `view/frontend/templates/checkout-success.phtml` | Initializes the success-page component |
| `view/frontend/web/js/action/placeOrder-mixin.js` | Persists cart data before order placement |
| `view/frontend/web/js/view/checkout-success.js` | Restores context and publishes `placeOrder` |
| `view/frontend/web/js/noopSdk.js`, `noopCollector.js` | Fallback modules when CDN assets fail to load |

## Prerequisites

Before you begin, confirm the following:

- Adobe Commerce 2.4.x with a Luma-based or Luma-derived frontend (RequireJS/AMD).
- PHP 8.1+ and Adobe Commerce CLI access.
- Browser access to CDN resources on `cdn.jsdelivr.net`.
- Your `environmentId` and `viewId` from your Adobe Commerce SaaS configuration.
- The [Storefront Events SDK](../storefront-events/sdk/install.md) and [Event Collector](../storefront-events/collector/index.md) are available from the CDN (this guide loads them via RequireJS).

## Step 1: Create the module structure {#create-structure}

Run the following commands from your Adobe Commerce root:

```bash
mkdir -p app/code/Vendor/CheckoutAnalytics/etc
mkdir -p app/code/Vendor/CheckoutAnalytics/view/frontend/layout
mkdir -p app/code/Vendor/CheckoutAnalytics/view/frontend/templates
mkdir -p app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/action
mkdir -p app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/view
```

Confirm the following files are present before continuing:

- app/code/Vendor/CheckoutAnalytics/registration.php
- etc/module.xml
- view/frontend/requirejs-config.js
- view/frontend/layout/checkout_onepage_success.xml
- view/frontend/templates/checkout-success.phtml
- view/frontend/web/js/action/placeOrder-mixin.js
- view/frontend/web/js/view/checkout-success.js

## Step 2: Define the module {#define-module}

Create `app/code/Vendor/CheckoutAnalytics/etc/module.xml`. This declares the module and specifies a soft load-order dependency on `Magento_Checkout`, ensuring the mixin targets already-registered AMD modules.

```xml
<?xml version="1.0"?>
<!--
    Vendor_CheckoutAnalytics module declaration.
    Declares a soft dependency on Magento_Checkout so this module loads after it,
    ensuring our mixins target already-registered AMD modules.
-->
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="Vendor_CheckoutAnalytics">
        <sequence>
            <module name="Magento_Checkout"/>
        </sequence>
    </module>
</config>
```

## Step 3: Register the module {#register-module}

Create `app/code/Vendor/CheckoutAnalytics/registration.php` at the module root. This registers the module with the Magento component registry.

```php
<?php
/**
 * Vendor_CheckoutAnalytics
 *
 * Registers the module with the Magento component registry.
 */

use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Vendor_CheckoutAnalytics',
    __DIR__
);
```

## Step 4: Create fallback modules {#create-fallback}

Create three empty AMD modules that serve as local fallbacks when the CDN is unreachable. RequireJS will automatically fall back to these if any CDN URL in `requirejs-config.js` fails to load, ensuring the checkout flow is never blocked.

**File**: `app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/noopSdk.js`:

```js
/**
 * Copyright &copy; Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable */
define(function () { });
```

**File**: `app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/noopCollector.js`:

```js
/**
 * Copyright &copy; Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable */
define(function () { });
```

**File**: app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/noopDs.js

```js
/**
 * Copyright &copy; Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable */
define(function () { });
```

## Step 5: Create the placeOrder mixin {#create-mixin}

Create the placeOrder mixin. This intercepts `Magento_Checkout/js/action/placeOrder` before the redirect so cart and storefront data can be snapshotted to `localStorage`. Magento clears the cart server-side before the success page loads, making this the only opportunity to capture that data.

For background on the mixin pattern, see [JavaScript Mixins](https://developer.adobe.com/commerce/frontend-core/javascript/mixins).

**File**: app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/action/placeOrder-mixin.js

```js
/**
 * placeOrder-mixin.js — Vendor_CheckoutAnalytics
 *
 * Intercepts the placeOrder action before the redirect so we can snapshot
 * cart + storefront data to localStorage. Magento clears the cart server-side
 * before the success page loads, so this is the only opportunity to capture it.
 */
define([
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function (wrapper, quote) {
    'use strict';

    var STORAGE_KEY = 'mse_checkout_cart_data';

    function getImageUrl(item) {
        if (item.thumbnail) { return item.thumbnail; }
        if (item.product && item.product.thumbnail_url) { return item.product.thumbnail_url; }
        return '';
    }

    function persistCartData() {
        try {
            var quoteItems = quote.getItems();
            var totals     = quote.getTotals()();  // KO observable — call it to get value
            var cartId     = quote.getQuoteId ? quote.getQuoteId() : '';
            var cc         = window.checkoutConfig || {};

            var items = (quoteItems || []).map(function (item) {
                return {
                    productSku:      item.sku  || '',
                    productName:     item.name || '',
                    qty:             item.qty  || 1,
                    offerPrice:      parseFloat(item.price) || 0,
                    currencyCode:    (totals && totals.quote_currency_code) || '',
                    productImageUrl: getImageUrl(item)
                };
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                cartId: cartId,
                items:  items,
                grandTotal:     totals ? parseFloat(totals.grand_total)      || 0 : 0,
                subTotal:       totals ? parseFloat(totals.subtotal)          || 0 : 0,
                taxTotal:       totals ? parseFloat(totals.tax_amount)        || 0 : 0,
                discountAmount: totals ? parseFloat(totals.discount_amount)   || 0 : 0,
                currencyCode:   totals ? (totals.quote_currency_code || '')       : '',
                storefrontInstance: {
                    storeCode:     cc.storeCode                    || '',
                    storeViewCode: cc.activeStore || cc.storeViewCode || '',
                    websiteCode:   cc.websiteCode                  || '',
                    environmentId: cc.environmentId                || '',
                    storeId:       cc.storeId      || null,
                    websiteId:     cc.websiteId    || null,
                    storeGroupId:  cc.storeGroupId || null
                }
            }));
        } catch (e) {
            console.error('[CheckoutAnalytics] Failed to persist cart data:', e);
        }
    }

    return function (originalAction) {
        console.log('[CheckoutAnalytics] placeOrder mixin initialized');
        return wrapper.wrap(originalAction, function (originalFn, paymentData, messageContainer) {
            console.log('[CheckoutAnalytics] placeOrder mixin invoked, persisting cart data');
            persistCartData();
            return originalFn(paymentData, messageContainer);
        });
    };
});
```

## Step 6: Create the checkout success component {#create-success-page}

Create the success-page JavaScript component. This is initialized using the `x-magento-init` on the checkout success page. It restores the cart snapshot saved by the mixin, sets MSE contexts, and fires `mse.publish.placeOrder()`. The MSE SDK and Collector are declared as AMD dependencies so they are guaranteed to have executed before this callback runs.

**File**: app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/view/checkout-success.js

```js
/**
 * checkout-success.js — Vendor_CheckoutAnalytics
 *
 * Initialized via x-magento-init on the checkout_onepage_success page.
 * Restores the cart snapshot saved by placeOrder-mixin.js, sets MSE contexts,
 * and fires mse.publish.placeOrder().
 *
 * The SDK and Collector are loaded as AMD dependencies via requirejs-config.js paths.
 * By the time this callback runs they have already executed and attached to
 * window.magentoStorefrontEvents.
 */
define([
    'magentoStorefrontEvents',
    'magentoStorefrontEventCollector'
], function () {
    'use strict';

    var STORAGE_KEY = 'mse_checkout_cart_data';

    function getPersistedCartData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('[CheckoutAnalytics] Could not parse persisted cart data:', e);
            return null;
        }
    }

    function getOrderId() {
        var orderId = (window.checkoutConfig || {}).orderId;
        if (orderId) {
            return String(orderId);
        }
        // Fallback: Luma renders the increment ID inside .order-number > strong
        var el = document.querySelector('.order-number strong');
        return (el && el.textContent) ? el.textContent.trim() : '';
    }

    function publishPlaceOrder(mse, cartData) {
        var cc    = window.checkoutConfig || {};
        var items = (cartData && cartData.items) || [];

        mse.context.setStorefrontInstance({
            environment:           'Testing',
            environmentId:         'YOUR_ENV_ID',
            baseCurrencyCode:      'USD',
            storeViewCurrencyCode: 'USD',
            viewId:                'YOUR_VIEW_ID',
            storefrontTemplate:    'LUMA_BRIDGE',
            storeUrl:              ''
        });

        mse.context.setShoppingCart({
            cartId: (cartData && cartData.cartId) || '',
            items: items.map(function (item, ix) {
                return {
                    id:      String(ix),
                    product: {
                        name:         item.productName     || '',
                        sku:          item.productSku      || '',
                        mainImageUrl: item.productImageUrl || ''
                    },
                    quantity: item.qty || 1,
                    prices:   { price: { value: item.offerPrice || 0 } }
                };
            }),
            totalQuantity: items.length,
            prices: {
                subtotalExcludingTax: { value: cartData ? cartData.subTotal : 0 },
                subtotalIncludingTax: { value: cartData ? cartData.subTotal + cartData.taxTotal : 0 },
            }
        });

        mse.context.setOrder({
            orderId:        getOrderId(),
            grandTotal:     (cartData && cartData.grandTotal)     || 0,
            subTotal:       (cartData && cartData.subTotal)       || 0,
            taxTotal:       (cartData && cartData.taxTotal)       || 0,
            discountAmount: (cartData && cartData.discountAmount) || 0,
            currencyCode:   (cartData && cartData.currencyCode)   || ''
        });

        mse.context.setPage({
            pageType:    'checkout',
            eventType:   'visibilityHidden',
            maxXOffset:  0,
            maxYOffset:  0,
            minHeight:   0,
            minWidth:    0,
            referrerUrl: document.referrer || '',
            ping:        { pageInfos: [] }
        });

        var shopperId = 'guest';
        if (cc.customerData && cc.customerData.id) {
            shopperId = String(cc.customerData.id);
        }
        mse.context.setShopper({ shopperId: shopperId });

        mse.publish.pageView();
        mse.publish.placeOrder();

        
        //Set purchaseHistory in localStorgage for use in recommendations requests
        //Catalog view matches the viewId set in setStorefrontInstance above
        const key = `CatalogView1:purchaseHistory`;
        const purchasedProducts = shoppingCartContext.items.map((item) => item.product.sku);
        const purchaseHistory = JSON.parse(window.localStorage.getItem(key) || '[]');
        purchaseHistory.push({ date: new Date().toISOString(), items: purchasedProducts });
        window.localStorage.setItem(key, JSON.stringify(purchaseHistory.slice(-20)));
        localStorage.removeItem(STORAGE_KEY);
    }

    return function () {
        console.log('[CheckoutAnalytics] checkout-success component initialized');

        var cartData = getPersistedCartData();
        if (!cartData) {
            console.warn('[CheckoutAnalytics] No cart snapshot in localStorage — ' +
                'placeOrder event will fire without item-level detail.');
        }

        var mse = window.magentoStorefrontEvents;
        if (!mse) {
            console.error('[CheckoutAnalytics] MSE SDK not available on window — cannot fire placeOrder event.');
            return;
        }

        console.log('[CheckoutAnalytics] cartData:', cartData);
        publishPlaceOrder(mse, cartData);
    };
});
```

## Step 7: Register RequireJS configuration {#register-requirejs}

Create `requirejs-config.js`. This registers the placeOrder mixin and defines RequireJS paths for the MSE SDK, Collector, and data services base. Each path entry is an array — if the first CDN URL fails to load, RequireJS automatically falls back to the local noop module, so the checkout flow is never blocked.

**File**: app/code/Vendor/CheckoutAnalytics/view/frontend/requirejs-config.js

```js
/**
 * RequireJS configuration for Vendor_CheckoutAnalytics.
 *
 * - placeOrder-mixin: snapshots cart to localStorage before the order redirect.
 * - paths: loads the MSE SDK and Collector as AMD deps with CDN + noop fallbacks.
 *   The success-page component (checkout-success.js) declares these as deps so
 *   they are guaranteed to execute before its callback runs.
 */
var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/action/placeOrder': {
                'Vendor_CheckoutAnalytics/js/action/placeOrder-mixin': true
            }
        }
    },
    paths: {
        magentoStorefrontEvents: [
            'https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-events-sdk@qa/dist/index',
            'Vendor_CheckoutAnalytics/js/noopSdk'
        ],
        magentoStorefrontEventCollector: [
            'https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-event-collector@qa/dist/index',
            'Vendor_CheckoutAnalytics/js/noopCollector'
        ],
        dataServicesBase: [
            'https://acds-events.adobe.io/v7/ds.min',
            'Magento_DataServices/js/noopDs'
        ]
    }
};
```

<InlineAlert variant="note" slots="text"/>

The `@qa` tag loads the latest pre-release build of the SDK and Collector. For production deployments, pin to a stable release version. See [Step 12](#update-cdn) for details.

## Step 8: Add the success page layout update {#add-layout}

Create the layout XML file that injects the analytics block into the checkout success page. The `checkout_onepage_success` handle is dispatched by `Magento_Checkout` only on that page, ensuring this update is scoped correctly.

**File**: app/code/Vendor/CheckoutAnalytics/view/frontend/layout/checkout_onepage_success.xml

```xml
<?xml version="1.0"?>
<!--
    Injects our analytics block into the checkout success page.

    The handle `checkout_onepage_success` is dispatched by
    Magento_Checkout/Controller/Onepage/Success::execute() before rendering,
    so this layout update is guaranteed to run only on that page.

    We append a block inside `checkout.success` (the main success container)
    so it renders after the order confirmation content. The block is
    display-less — it only outputs a <script> initialisation tag.
-->
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Magento\Framework\View\Element\Template"
                   name="vendor.checkout_analytics.success"
                   template="Vendor_CheckoutAnalytics::checkout-success.phtml"
                   after="-"/>
        </referenceContainer>
    </body>
</page>
```

## Step 9: Add the success page template {#add-template}

Create the `.phtml` template. This file has no visible HTML — its sole purpose is to bootstrap the JavaScript component via the `x-magento-init` pattern so RequireJS loads and runs it after the page DOM is ready. The `*` selector initializes the component against the document body.

**File**: app/code/Vendor/CheckoutAnalytics/view/frontend/templates/checkout-success.phtml

```php
<?php
/**
 * Vendor_CheckoutAnalytics — checkout success analytics initialisation.
 *
 * This template is injected on the checkout_onepage_success layout handle.
 * It contains no visible HTML — its sole purpose is to bootstrap our JS
 * component via the x-magento-init pattern so RequireJS loads and runs it
 * after the page DOM is ready.
 *
 * The `*` selector tells Magento to initialise the component against the
 * document body (no specific DOM element required).
 *
 * @var \Magento\Framework\View\Element\Template $block
 */
?>
<script type="text/x-magento-init">
{
    "*": {
        "Vendor_CheckoutAnalytics/js/view/checkout-success": {}
    }
}
</script>
```

## Step 10: Enable the module {#enable-module}

Run the following commands from your Adobe Commerce root:

```bash
bin/magento module:enable Vendor_CheckoutAnalytics
```

Run setup upgrade to register the module in `app/etc/config.php` and run any required schema or data upgrades:

```bash
bin/magento setup:upgrade
```

Compile dependency injection:

```bash
bin/magento setup:di:compile
```

<InlineAlert variant="note" slots="text"/>

This module contains no PHP classes beyond `registration.php`, so this step completes quickly. It is still required to rebuild the global DI map so Magento picks up the new module correctly.

Deploy static content (the `-f` flag forces deployment in any application mode):

```bash
bin/magento setup:static-content:deploy -f
```

For production mode, specify your locale explicitly:

```bash
bin/magento setup:static-content:deploy en_US -f
```

Flush the cache:

```bash
bin/magento cache:flush
```

## Step 11: Configure the storefront instance context {#config-context}

Open `view/frontend/web/js/view/checkout-success.js` and update the `setStorefrontInstance` call with your environment values:

```js
mse.context.setStorefrontInstance({
    environment:           'Production',   // 'Testing' or 'Production'
    environmentId:         'YOUR_ENV_ID',  // Tenant ID associated with ACO/EDS storefront
    baseCurrencyCode:      'USD',
    storeViewCurrencyCode: 'USD',
    viewId:                'YOUR_VIEW_ID', // Catalog View ID associated with ACO/EDS storefront
    storefrontTemplate:    'LUMA_BRIDGE',
    storeUrl:              'https://your-store.example.com'
});
```

<InlineAlert variant="important" slots="text"/>

The `environmentId` value and `viewId` values need to align with the configuration of your EDS storefront. Using a placeholder value will cause events to be routed to the wrong data stream or dropped entirely.

After editing the file, redeploy static content and flush the cache:

```bash
bin/magento setup:static-content:deploy -f && bin/magento cache:flush
```

## Step 12: Update CDN Package Versions (Optional) {#update-cdn}

By default, `requirejs-config.js` loads the `@qa` tag of the SDK and Collector. To pin to a stable release, update the paths entries in `requirejs-config.js`:

```js
paths: {
    magentoStorefrontEvents: [
        'https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-events-sdk@1/dist/index',
        'Vendor_CheckoutAnalytics/js/noopSdk'
    ],
    magentoStorefrontEventCollector: [
        'https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-event-collector@1/dist/index',
        'Vendor_CheckoutAnalytics/js/noopCollector'
    ]
}
```

After editing, redeploy static content and flush the cache.

## Step 13: Verify the implementation {#verify-implementation}

### Cart snapshot on the checkout page

Confirm the mixin is capturing cart data before the redirect:

1. Open your store in a browser with the DevTools console open.
1. Add one or more products to the cart and proceed to checkout.
1. In the console, confirm the mixin initialized: `[CheckoutAnalytics] placeOrder mixin initialized`.
1. Place the order. Before the page redirects, confirm: `[CheckoutAnalytics] placeOrder mixin invoked, persisting cart data`.
1. In DevTools, open *Application > Local Storage* and confirm a key named `mse_checkout_cart_data` exists with a JSON payload containing cart items, totals, and storefront instance fields.

### Event published on the success page

Confirm the `placeOrder` event fires correctly after the redirect:

1.    After the redirect to the success page, open the console and confirm the following log messages appear:

```bash
[CheckoutAnalytics] checkout-success component initialized
[CheckoutAnalytics] cartData: { cartId: "...", items: [...], ... }
[CheckoutAnalytics] Publishing placeOrder event
```

1. Confirm the `mse_checkout_cart_data` key has been removed from Local Storage after the event fires.
1. To confirm the event was received by the MSE SDK, run the following in the console before placing a test order:

```bash
window.magentoStorefrontEvents.subscribe.placeOrder(function (event) {
    console.log('placeOrder event received:', event);
});
```

<InlineAlert variant="note" slots="text"/>

If `window.magentoStorefrontEvents` is undefined on the success page, the CDN scripts failed to load. Check the **Network** tab in DevTools for failed requests to `cdn.jsdelivr.net`. The noop fallback modules prevent JavaScript errors but do not set `window.magentoStorefrontEvents`, so no event will fire.

## Troubleshooting

### The placeOrder mixin is not running

Confirm the mixin is registered by checking the compiled RequireJS config in the browser:

```js
require.s.contexts._.config.config.mixins
// Should contain an entry for 'Magento_Checkout/js/action/placeOrder'
```

If the entry is missing, re-run static content deployment and flush the cache.

### mse_checkout_cart_data is empty or missing on the success page

This means `persistCartData()` ran but the quote returned no items. This can happen if the active payment method bypasses the standard placeOrder action. Check whether your payment method uses a custom placeOrder action — if so, add a second mixin targeting that module.

### The placeOrder event fires but contexts are missing or incorrect

Inspect the context state directly in the console:

```bash
var mse = window.magentoStorefrontEvents;
console.log(mse.context.getShoppingCart());
console.log(mse.context.getOrder());
console.log(mse.context.getStorefrontInstance());
```

Cross-reference each field against the [MSE context reference](https://developer.adobe.com/commerce/services/shared-services/storefront-events/sdk/context).

### Static content is not updating after editing JS files

In developer mode, RequireJS serves files directly from `app/code` so edits are reflected immediately. In production mode, redeploy static content and flush the cache after every JS change:

```bash
bin/magento setup:static-content:deploy -f && bin/magento cache:flush
```

## Related documentation

- [Adobe Commerce Storefront Events SDK](../storefront-events/sdk/index.md)
- [Install the Event Collector](../storefront-events/collector/index.md)
- [Adobe Commerce storefront events](../storefront-events/index.md)
- [JavaScript mixins](https://developer.adobe.com/commerce/frontend-core/guide/themes/js-mixins/)
- [RequireJS](https://requirejs.org/docs/api.html)
