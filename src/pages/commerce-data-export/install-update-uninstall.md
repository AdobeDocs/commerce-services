---
title: Install, update, and uninstall Commerce Data Export extension
edition: ce
description: Learn how to install, update, and uninstall the Commerce Data Export extension.
keywords:
  - Commerce Data Export
  - Install
  - Update
  - Uninstall
---
# Install, update, and uninstall Commerce Data Export extension

### Installation
There is no separate installation required for the Commerce Data Export extension. Specific modules from Commerce Data Export extensions are included in Adobe Commerce Service extensions (e.g. [Live Search](commerce-services/src/pages/live-search/index.md, [Product Recommendations](commerce-services/src/pages/product-recommendations/index.md), etc.)

### Update
If you want to update any of the commerce data export module, you can do it by execution following command:

_Example for updating the Adobe Commerce Services Product Price Data Exporter module:
```shell script
composer require magento/module-saas-price:103.3.1 --with-all-dependencies 
```
It will update the module to the specified version and also update specific dependencies if needed.

### Uninstallation
In case if you don't need any of installed commerce data export modules, you can disable it by executing `magento:module:disable` command.
Unnecessary functionality can be turned off by disabling modules that collects information and stores it in the feed tables (data-exporter) and module responsible for running indexers and sending data to Adobe Commerce Services (saas-export) related modules. Disabled feed will disappear from the list of feeds available for resync, no cron jobs will be executed for this feed. As well as all plugins from dependent Commerce Data Exporter extension will be turned off.

For example, there is a [Categories API](https://developer.adobe.com/commerce/services/graphql/catalog-service/categories/) that using categories permission feed data internally. If you don’t use this API it may be a good idea to do not export this data at all. You can do it by disabling data feed responsible for exporting category permissions
```shell script
bin/magento module:disable Magento_CategoryPermissionDataExporter Magento_SaaSCategoryPermissions
```