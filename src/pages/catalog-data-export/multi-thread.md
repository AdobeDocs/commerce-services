<- [Back to overview page](commerce-data-export-overview.md)

# Multi-thread data export mode:
The purpose of this mode is to speed up the export process by splitting the data into batches and processing them in parallel. **_The performance of data export should be aligned with the limit that is defined for a client at consumer side._**

Available options that affect multithreading:

- `threadCount` : how many threads will be activated to process entities
- `batchSize` : how many entities will be processed in one iteration


_By default, all threads operate in single-thread mode, meaning there is no parallelization in the feed submission process.
Additionally, due to the default limits set by the Feed Ingestion Service, all clients are restricted to using only one thread._

### How to modify threadCount and batchSize?
Multithreading is supported for all 3 ways (see details) to sync data to SaaS:

- full sync
- partial sync
- failed items sync

#### There are two ways to configure it:

###### Runtime changes
Temporary you can change # of threads and batch size only for full sync  command via CLI, for example:

`bin/magento saas:resync --feed=products --threadCount=2 --batchSize=200`

**Note: runtime changes override permanent configuration**

###### Permanent changes via config.php
To apply permanent changes System Integrator have to modify threads and batch size per feed in Adobe Commerce configuration.

It can be done by providing custom values in app/etc/config.php  in the system  section https://experienceleague.adobe.com/docs/commerce-operations/configuration-guide/files/config-reference-configphp.html?lang=en#system

Example of configuring multithreading for products and prices
```php
<?php
return [
    'system' => [
        'default' => [
            'commerce_data_export' => [
                'feeds' => [
                    'products' => [
                        'batch_size' => 200,
                        'thread_count' => 4,
                    ],
                    'prices' => [
                        'batch_size' => 400,
                        'thread_count' => 2,
                    ]
                ]
            ],
//   ...
```


#### How to select the proper configuration:
There are no strict guidelines however there are several things you may consider picking up # of threads and batch size per item.

Assume that the average speed to send products to SaaS is 200 products/s. 

How long can you tolerate initial data synchronization time? 
After going live, do you plan to add new Store Views/Websites with the same amount of products? If yes, how long can you tolerate data synchronization time?
Do you anticipate regular imports with huge # of products? E.g. Price updates or Stock Status updates from 3rd-party system? If yes, how fast you should bring theses changes to SaaS?
Are your products lightweight or heavy? (e.g. size of description, # of product attributes within 1 product may blowup product size - in this case you may consider reduce batch size from default value)