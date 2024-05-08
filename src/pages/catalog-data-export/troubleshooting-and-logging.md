---
title: Troubleshooting and logging
edition: ce
description: Troubleshooting and logging for the Commerce Data Export extension.
keywords:
  - Commerce Data Export
  - Troubleshooting
  - Logging
---
# Troubleshooting and logging
If you do not see expected data in Commerce Service, check if a problem occurred during the sync from the Adobe Commerce instance to the Commerce Service platform.

There are two log files in the `var/log/` directory:

`commerce-data-export-errors.log` - if an error happened during collecting phase
`saas-export-errors.log` - if an error happened during transmitting phase

Check feed payload
It may be useful to see the feed payload that has been sent to the Commerce Service. This can be done by passing the environment variable EXPORTER_EXTENDED_LOG=1. The no-reindex flag means that only currently collected data is sent.

``` bash
EXPORTER_EXTENDED_LOG=1 bin/magento saas:resync --feed=products
```
The payload is available in var/log/saas-export.log.

### Preserve payload in feed index table
Stating from `magento/module-data-exporter:103.3.0` immediate export feeds: all catalog and inventory stock status feeds, keep only the minimum required data in the index table.

Preserving payload data in the index table is not recommended on production, but it may be useful on a developer instance. This is done by passing the PERSIST_EXPORTED_FEED=1 environment variable:

``` bash
PERSIST_EXPORTED_FEED=1 bin/magento saas:resync --feed=products
```

### Profiling
If the reindex process of specific feed takes an unreasonable amount of time, run the profiler to collect additional data that might be useful for the Support Team. To do so, pass the EXPORTER_PROFILER=1 environment variable:

``` bash
EXPORTER_PROFILER=1 bin/magento indexer:reindex catalog_data_exporter_products
```
Profiler data is stored in var/log/commerce-data-export.log with the format:

``` log 
<Provider class name>, <# of processed entities>, <execution time im ms>, <memory consumption in Mb>
```

Each log record has the following structure (note JSON-based string is beautified for better readability)

```log
[<log record datetime>] report.<log level>:
{
   "feed": "<feed name>",
   "operation": "<executed operation>",
   "status": "<status of operation>",
   "elapsed": "<time elaspsed from script run>",
   "pid": "<proccess id who executed `operation`>",
   "caller": "<who called this `operation`>"
} [] []
```


During full resync, by default, each 30 seconds progress track will be logged, here is example:

```json
{
   "feed": "prices",
   "operation": "full sync",
   "status": "Progress: 2/5, processed: 200, synced: 100",
   "elapsed": "00:00:00 190 ms",
   "pid": "12824",
   "caller": "bin/magento saas:resync --feed=products"
}
```
- "Progress 2/5" - 2 from 5 iterations completed. The number of iterations depends on the number of exported entities.
- "processed: 200" - 200 items have been processed so far
- "synced: 100" - 100 items were sent to SaaS. It's expected that "synced" is not equal to "processed". Here is an example:
    - "synced" < "processed" - feed table didn't detect any changes in the item, compared to the previously synced version. Such items will be ignored during sync.
    - "synced" > "processed"  - the same entity id (e.g. Product ID) can have multiple values in different scopes. For example, 1 product can be assigned to 5 websites. In this case you may have "1 processed" item and "5 synced" items

Out-of-the-box extension provides the following operations you can see in logs file:

| Operation                  | Description                                                                                                                                 | Caller example                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| full sync                  | execute full sync (collect data and send to SaaS) of a given feed                                                                           | bin/magento saas:resync --feed=products                                              |
| partial reindex            | execute sync (collect data and send to SaaS) of updated entities of a given feed. Note: log will be present only if updated entities exist  | bin/magento cron:run --group=index                                                   |
| retry failed items         | resend failed (due to AC application or server error) items of a given feed to SaaS. Note: log will be present only if failed items exist.  | bin/magento cron:run --group=saas_data_exporter  (any "*_data_exporter" cron group)  |
| full sync(legacy)          | execute full sync (collect data and send to SaaS) of a given feed for legacy export mode.                                                   | bin/magento saas:resync --feed=categories                                            |
| partial reindex (legacy)   | sends updated entities to SaaS of a given feed in legacy export mode. Note: log will be present only if updated entities exist              | bin/magento cron:run --group=index                                                   |
| partial sync (legacy)      | sends updated entities to SaaS of a given feed in legacy export mode. Note: log will be present only if updated entities exist              | bin/magento cron:run --group=saas_data_exporter (any "*_data_exporter" cron group)   |

Here is an example of feed logs:
```log
Price feed full resync:

[2024-03-05T21:00:51.754687+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"Initialize","elapsed":"383 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
[2024-03-05T21:00:51.803178+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"Creating batch table `catalog_data_exporter_product_prices_index_batches`. Start position: 30515","elapsed":"434 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
[2024-03-05T21:00:51.851878+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"Batch table `catalog_data_exporter_product_prices_index_batches` created. Total Items: 500, batches: ~1","elapsed":"482 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
[2024-03-05T21:00:51.852548+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"start processing `500` items in `1` threads with `500` batch size","elapsed":"483 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
[2024-03-05T21:00:52.288369+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"Progress 1\/1, processed 500, synced 0","elapsed":"919 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
[2024-03-05T21:00:53.994249+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"Progress 1\/1, processed 500, synced 100","elapsed":"00:00:02 625 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
[2024-03-05T21:00:53.995168+00:00] report.INFO: {"feed":"prices","operation":"full sync","status":"Complete","elapsed":"00:00:02 626 ms","pid":"14469","caller":"bin\/magento saas:resync --feed=prices"} [] []
```

### Troubleshooting and logs view via NewRelic
If you store Adobe Commerce logs in the New Relic, it may be beneficial to add parsing rules to improve readability and query experience

- login to NewRelic
- Go to `Logs => Parsing`
- Click `Create parsing rule`


**Filter logs based on NRQL**
`filePath LIKE '%commerce-data-export%.log'`

**Parsing rule**
`\[%{DATA:timestamp}\] report.%{DATA:logLevel} %{GREEDYDATA:feed:json}`

After adding this rule you will be able to query by specific feed type, operation, etc
For example:
`feed.feed:"products" and feed.status:"Complete"`