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
There are two ways to disable the module: one is to disable the data exporter module and another is to disable module responsible for running indexers and sending data to Adobe Commerce Services (saas-export module).
Disabling saas-export module is easier and do not require any additional modules to turn off. Disabled feed will disappear from the list of feeds available for resync also no cron jobs will be executed for this feed. But all plugins from dependent Commerce Data Exporter extension will remain active. To disable saas-export module, execute the following command:
Example for disabling the SaaS Category module:
```shell script
bin/magento module:disable Magento_SaaSCategory
```
Disabling of specific data exporter module can be useful in case if you want to turn off all logic related to this exporter. In that case disable all feed related modules.
For example, to disable the Adobe Commerce Services Product Price Data Exporter module, you need to turn off the following modules:
```shell script
bin/magento module:disable Magento_SaaSPrice Magento_ProductPriceDataExporter 
```