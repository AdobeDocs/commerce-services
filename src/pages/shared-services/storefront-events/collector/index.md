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

<InlineAlert variant="info" slots="text"/>

If you are using the Data Connection module, you can skip this topic as the module deploys the Adobe Commerce Event Collector for you. [Learn more](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data#data-collection).

## Installation

The collector can be used as a hosted script, or bundled in a JavaScript application. The script version is hosted on [cdn](https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-events-sdk@1/dist/index.js), and the bundled version is hosted on [npm](https://www.npmjs.com/package/@adobe/magento-storefront-event-collector).

To load the SDK as a script, use the following snippet.

```html
<script src="https://cdn.jsdelivr.net/npm/@adobe/magento-storefront-events-sdk@1/dist/index.js"></script>
```

To install the script as a dependency, run this command.

```bash
npm install @adobe/magento-storefront-event-collector
```

<InlineAlert variant="info" slots="text"/>

To avoid any issues, make sure you keep the script or bundled version up to date with the latest release.

## Quick Start

After loading the collector script, or importing the package as shown below, there is nothing else to configure.

```bash
import "@adobe/magento-storefront-event-collector";
```

The collector then begins listening for events. When these events are fired, the collector runs the associated handler and sends the event along with any relevant information to Adobe Commerce for further processing.

## Support

If you have any questions or encounter any issues, reach out here:

- [GitHub](https://github.com/adobe/commerce-events)
- [Zendesk](https://account.magento.com/customer/account/login/referer/aHR0cHM6Ly9hY2NvdW50Lm1hZ2VudG8uY29tL3plbmRlc2svbG9naW4vaW5kZXgv/)
