---
title: REST API overview
description: Learn how to use the REST API for Adobe Commerce as a Cloud Service.
keywords:
  - REST
  - Services
noIndex: true
---

# Rest overview

The Adobe Commerce as a Cloud Service REST API serves as a critical tool for extending and integrating commerce functionalities, but the endpoints available differ significantly from the REST APIs for Adobe Commerce on Cloud and on-premises deployments.

The following key differences are important to consider when planning your REST API integrations with Adobe Commerce as a Cloud Service:

## Endpoints

Primarily the Cloud Service REST API differs in that it includes a smaller subset of endpoints. Specifically, the Guest and Customer REST APIs that are available in Adobe Commerce on Cloud and on-premises deployments are not available in Adobe Commerce as a Cloud Service. However, access to similar functionality remains available in the [GraphQL API](/reference/cloud/graphql.md).

For more information on what endpoints are available, refer to the [API reference](/reference/cloud/rest.md).

## Authentication

In previous versions of Adobe Commerce, you would use authentication tokens to authorize your requests to the REST API. In Adobe Commerce as a Cloud Service, you must use Adobe Identity Management Service (IMS) to authenticate your requests.

The authentication system supports both [interactive user-based workflows](./authentication/user.md) and automated [server-to-server integrations](./authentication/server-to-server.md), ensuring secure and appropriate access for different use cases. Both of these authentication methods require every request to be signed with an IMS Access Token. For a practical implementation guide with code examples for server-to-server integration, see our [Server-to-Server Integration Guide](./integration/index.md).

## URL structure

The URL structure for your REST endpoints will be slightly different in Adobe Commerce as a Cloud Service. In addition to your base URL changing, `/rest` is no longer needed.

Cloud Service URLs use the following format:

`https://<server>.api.commerce.adobe.com/<tenant-id>/<endpoint>`

## Extensibility

Adobe Commerce as a Cloud Service is highly extensible and is designed to be used with the following extensibility tools. Additionally, because the Cloud Service is preconfigured, you do not need to install any additional composer packages.

### Starter kits

* [Checkout starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/checkout/)
* [Integration starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/integration/)

Integrations with Adobe Commerce as a Cloud Service rely on IMS integration, which means in your `.env` file, you need to use **Option 2** for authentication as described in [`env.dist`](https://github.com/adobe/commerce-checkout-starter-kit/blob/main/env.dist):

```yaml
# Option 2: Authenticate with IMS
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRETS=[""]
OAUTH_TECHNICAL_ACCOUNT_ID=
OAUTH_TECHNICAL_ACCOUNT_EMAIL=
OAUTH_IMS_ORG_ID=
```

### Events and webhooks

Events and webhooks work slightly differently compared to other versions of Adobe Commerce.

<InlineAlert variant="info" slots="text"/>

For other extensibility ideas, review our topics on [webhooks](../rest/webhooks.md) and [custom attributes](../custom-attributes.md).

Addtionally, because Adobe Commerce as a Cloud Service is preconfigured with extensibility in mind, you do not need to add or configure the integration in the Adobe Commerce Admin.

#### Events

* [Events](https://developer.adobe.com/commerce/extensibility/events/) - Adobe Commerce as a Cloud Service is currently limited to the following events:
  * observer.catalog_product_save_after
  * observer.catalog_product_save_commit_after
  * observer.catalog_product_delete_commit_after
  * observer.cataloginventory_stock_item_save_commit_after
  * observer.checkout_submit_all_after
  * observer.customer_login
  * observer.customer_register_success
  * observer.customer_save_after
  * observer.customer_save_commit_after
  * observer.customer_delete_commit_after
  * observer.customer_group_save_commit_after
  * observer.customer_group_delete_commit_after
  * observer.rma_save_after
  * observer.rma_save_commit_after
  * observer.sales_order_save_after
  * observer.sales_order_save_commit_after
  * observer.sales_order_shipment_save_after
  * observer.sales_order_shipment_track_save_after
  * observer.sales_order_creditmemo_save_after
  * observer.sales_order_status_history_save_after
  * plugin.sales.api.order_management.place
  * plugin.sales.api.order_repository.save
  * plugin.sales_rule.api.rule_repository.save

#### Webhooks

Registering webhooks works differently between platforms. Instead of using the `webhooks.xml` file, you can register webhooks in the Commerce Admin or by using the REST API.

Adobe Commerce as a Cloud Service is limited to the following webhooks:

* observer.sales_quote_add_item
* observer.checkout_cart_product_add_before
* observer.catalog_product_save_after
* observer.catalog_product_save_before
* observer.sales_order_place_before
* plugin.customer.api.address_repository.save
* plugin.sales.api.order_management.place
* plugin.quote.api.guest_coupon_management.set
* plugin.tax.api.tax_calculation.calculate_tax
* plugin.quote.api.shipment_estimation.estimate_by_extended_address
* plugin.gift_card_account.api.gift_card_account_management.check_gift_card
* plugin.out_of_process_payment_methods.api.payment_method_filter.get_list
* plugin.out_of_process_shipping_methods.api.shipping_rate_repository.get_rates
