<- [Back to overview page](commerce-data-export-overview.md)

# Commands and options

### Feeds commands and options
Feeds list:
- products: product data feed
- productAttributes: product attributes data feed
- categories: categories data feed
- variants: configurable product variations data feed
- prices: product prices data feed
- categoryPermissions: category permissions data feed
- productOverrides: product permissions data feed
- inventoryStockStatus: inventory stock status data feed
- scopesWebsite: websites with stores and store views data feed
- scopesCustomerGroup: customer groups data feed
- orders: sales orders data feed

### Commands:
- `bin/magento saas:resync --help` - get list of all available commands and options with their description.
- `bin/magento saas:resync --feed='FEED_NAME'` - run full resync for products feed, feeds which already were in the exporter table with success code in the status field (for immediate export only) will not be resynchronized.
- `bin/magento saas:resync --feed='FEED_NAME' --cleanup-feed` - **NOTE: this option shouldn't be used for regular export operations. Initial idea of this command is to resend all records to Adobe Commerce Services, for example: after environment was cleaned up** run full resync for products feed and cleanup all existing data in the feed table.
