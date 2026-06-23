---
title: Instrument checkout analytics for a Luma storefront | Commerce Services
description: Implement a custom Adobe Commerce module that publishes the placeOrder storefront event on the checkout success page for Luma-based storefronts.
keywords:
  - Events
  - Services
  - Storefront
---

# Instrument checkout analytics for a Luma storefront

This guide shows how to build a custom Adobe Commerce module that publishes the `placeOrder` event on the checkout success page for a Luma-based storefront. After you complete this guide, Adobe Commerce can receive the `place-order` event that [Product Recommendations](../storefront-events/index.md#product-recommendations) and [Live Search](../storefront-events/index.md#live-search) use for revenue and conversion metrics.

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
| `view/frontend/web/js/action/place-order-mixin.js` | Persists cart data before order placement |
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

## Step 2: Define the module {#define-module}

Create `app/code/Vendor/CheckoutAnalytics/etc/module.xml`:

```xml
<?xml version="1.0"?>
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

Create `app/code/Vendor/CheckoutAnalytics/registration.php`:

```php
<?php
use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Vendor_CheckoutAnalytics',
    __DIR__
);
```

## Step 4: Create fallback modules {#create-fallback}

RequireJS uses these empty modules when CDN assets fail to load. Create each file with the same content.

`app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/noopSdk.js`:

```js
define(function () {
    'use strict';

    return {};
});
```

`app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/noopCollector.js`:

```js
define(function () {
    'use strict';

    return {};
});
```

## Step 5: Create the place-order mixin {#create-mixin}

Create `app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/action/place-order-mixin.js`. This mixin runs before the standard place-order action and stores cart line items in `localStorage`.

```js
define([
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function (wrapper, quote) {
    'use strict';

    var STORAGE_KEY = 'mse_checkout_cart_data';

    function persistCartData() {
        var items = (quote.getItems() || []).map(function (item) {
            return {
                sku: item.sku,
                name: item.name,
                qty: item.qty,
                price: parseFloat(item.price)
            };
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: items }));
    }

    return function (originalAction) {
        return wrapper.wrap(originalAction, function (originalFn, paymentData, messageContainer) {
            persistCartData();
            return originalFn(paymentData, messageContainer);
        });
    };
});
```

## Step 6: Create the success-page component {#create-success-page}

Create `app/code/Vendor/CheckoutAnalytics/view/frontend/web/js/view/checkout-success.js`. This component sets [storefront context](../storefront-events/sdk/context.md) and restores cart data before it publishes the event.

```js
define([
    'magentoStorefrontEvents',
    'magentoStorefrontEventCollector'
], function () {
    'use strict';

    var STORAGE_KEY = 'mse_checkout_cart_data';

    return function (config) {
        var mse = window.magentoStorefrontEvents;
        var storedData = localStorage.getItem(STORAGE_KEY);
        var cartData = storedData ? JSON.parse(storedData) : null;

        if (!mse) {
            return;
        }

        mse.context.setStorefrontInstance({
            environment: config.environment || 'Production',
            environmentId: config.environmentId,
            viewId: config.viewId
        });

        if (cartData && cartData.items) {
            mse.context.setShoppingCart({
                items: cartData.items.map(function (item) {
                    return {
                        sku: item.sku,
                        name: item.name,
                        quantity: item.qty,
                        price: item.price
                    };
                })
            });
        }

        mse.publish.placeOrder();
        localStorage.removeItem(STORAGE_KEY);
    };
});
```

## Step 7: Register RequireJS configuration {#register-requirejs}

Create `app/code/Vendor/CheckoutAnalytics/view/frontend/requirejs-config.js`:

```js
var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/action/place-order': {
                'Vendor_CheckoutAnalytics/js/action/place-order-mixin': true
            }
        }
    },
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
};
```

## Step 8: Add the layout update {#add-layout}

Create `app/code/Vendor/CheckoutAnalytics/view/frontend/layout/checkout_onepage_success.xml`:

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      layout="1column"
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Magento\Framework\View\Element\Template"
                   name="checkout.analytics.success"
                   template="Vendor_CheckoutAnalytics::checkout-success.phtml"/>
        </referenceContainer>
    </body>
</page>
```

## Step 9: Add the template {#add-template}

Create `app/code/Vendor/CheckoutAnalytics/view/frontend/templates/checkout-success.phtml`. Replace the placeholder values with your `environmentId` and `viewId`.

```html
<script type="text/x-magento-init">
{
    "*": {
        "Vendor_CheckoutAnalytics/js/view/checkout-success": {
            "environmentId": "YOUR_ENV_ID",
            "viewId": "YOUR_VIEW_ID"
        }
    }
}
</script>
```

## Step 10: Enable the module {#enable-module}

Run the following commands from your Adobe Commerce root:

```bash
bin/magento module:enable Vendor_CheckoutAnalytics
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

## Verify the implementation

Complete a test order and confirm the following:

1. **Cart snapshot** — Before redirect, the browser stores cart data under the `mse_checkout_cart_data` key in `localStorage`.
2. **SDK and collector** — On the success page, the browser loads the SDK and collector assets from the CDN (or the noop fallback if the CDN is blocked).
3. **Event published** — In the browser console, `window.magentoStorefrontEvents` is defined and the `placeOrder` handler runs without errors.
4. **Event delivery** — Follow [Verify event collection](../storefront-events/collector/verify.md) to confirm the collector sends the event to Adobe Commerce.

After verification, check the [Product Recommendations](https://experienceleague.adobe.com/en/docs/commerce/product-recommendations/admin/workspace) or [Live Search](https://experienceleague.adobe.com/en/docs/commerce/live-search/live-search-admin/performance) dashboard for `place-order` metrics.

## Troubleshooting

### Mixin does not run

Confirm that `requirejs-config.js` is deployed and that static content is up to date. In the browser console, inspect registered mixins:

```js
require.s.contexts._.config.config.mixins
```

You should see an entry for `Magento_Checkout/js/action/place-order`.

### Cart data is missing on the success page

Custom payment methods or checkout customizations may bypass `Magento_Checkout/js/action/place-order`. Add the cart snapshot logic to the action your checkout flow uses before redirect.

### SDK or collector does not load

Check the browser Network tab for failed requests to `cdn.jsdelivr.net`. If the CDN is blocked, RequireJS loads the noop fallback and events are not sent to Adobe Commerce.

### Events publish but do not appear in dashboards

Confirm that `environmentId` and `viewId` in `checkout-success.phtml` match your SaaS configuration. Then follow [Verify event collection](../storefront-events/collector/verify.md).

## Next steps

- [Context for storefront events](../storefront-events/sdk/context.md) — Add page, shopper, or order context as needed.
- [Publish storefront events](../storefront-events/sdk/publish.md) — Reference for `mse.publish.placeOrder`.
- [completeCheckout event](../storefront-events/reference/storefront-events.md#completecheckout) — Data collected from checkout events.

## Related documentation

- [Adobe Commerce Storefront Events SDK](../storefront-events/sdk/index.md)
- [Install the Event Collector](../storefront-events/collector/index.md)
- [Adobe Commerce storefront events](../storefront-events/index.md)
- [JavaScript mixins](https://developer.adobe.com/commerce/frontend-core/guide/themes/js-mixins/)
- [RequireJS](https://requirejs.org/docs/api.html)
