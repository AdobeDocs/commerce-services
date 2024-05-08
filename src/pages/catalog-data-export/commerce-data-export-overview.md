# Commerce Data Export extension overview

The Commerce Data Export extension is a tool designed to facilitate the synchronization of data between Adobe Commerce and SaaS Commerce Service. It collects and exports various types of data, referred to as "feeds", which aggregate specific pieces of data. Depending on which Adobe Commerce Services are used following data exporter feeds will be available:  
Catalog: This includes data of product attributes, products, product prices, product variations, categories, category permissions, and product permissions.
Scopes: This covers customer groups, websites, stores and store views.
Sales Order: This area is responsible for orders and their related entities such as invoices, shipments, credit memos, etc.
Multi-Source Inventory: This area handles inventory stock status items.

### Features
- The extension provides two interfaces for data synchronization: a [UI-based interface](https://experienceleague.adobe.com/en/docs/commerce-admin/systems/data-transfer/data-dashboard) and a CLI-interface. The UI-based interface performs a full resync for all available feeds, while the CLI command can be used to sync a specific feed.  The Commerce Data Exporter also supports partial sync, which is triggered by crons when an admin user updates an entity. The extension then sends these updates to SaaS. This process is based on the MView mechanism and requires no actions from the admin user or system integrator.
- Commerce data export also has a mechanism to retry failed items in case of errors during the data synchronization process. This is also based on cron jobs. Extension operates in two modes: Immediate export mode and Legacy export mode. In the Immediate export mode, data is collected and sent immediately to SaaS during one iteration. In the Legacy export mode, data is collected in one process and later sent to SaaS by a cron job.
- CDE logs events such as entity updates or full resync triggers in the var/log/commerce-data-export.log file. Each log record has a specific structure and provides information about the feed, operation, status, elapsed time, process id, and the caller. In case of error happening during the data synchronization process, the extension logs the error message and the stack trace in the var/log/commerce-data-export-errors.log file. To see which entities were sent to SaaS, check the var/log/saas-export.log file. And similar to the exporter logs - to check if there were any errors during the data synchronization process, check the var/log/saas-export-errors.log file.
- There is possibility to run data collection and synchronization in the multiple threads with custom batch size (by default feeds are working in single thread mode and with feeds specific batch size - it's usually 100 records per batch, but for prices feed this value is set to 500 records).

### Commerce Data Exporter info (TODO: find better title):
- #### [Workflow](workflow.md)
- #### [Commands and options](commands-and-options.md)
- #### [Multi thread mode](multi-thread.md)
- #### [Troubleshooting and logging](troubleshooting-and-logging.md)
- #### [Pricing Index](pricing-index.md)