---
title: Adobe Commerce Data Ingestion REST endpoints
description: Reference information for Adobe Commerce Data Ingestion REST endpoints.
---

# Data ingestion REST endpoints

The Adobe Commerce Data Ingestion service allows you to sync your catalog data straight to the Adobe Commerce services platform, bypassing the need to go through your Commerce instance, saving time and processing power.

The Data Ingestion Service allows customers with large and/or complex catalogs to send data to Adobe Commerce services directly.

The Data Ingestion Service decreases the time that it takes to process product changes by bypassing the Adobe Commerce instance and moving catalog data from a third-party Enterprise Resource Planning (ERP) directly to Adobe Commerce services.

Read more about the [Data Ingestion Service](https://experienceleague.adobe.com/docs/commerce-merchant-services/catalog-service/data-ingestion.html).

The Data Ingestion endpoint is `https://commerce.adobe.io/feeds`.

## Required headers

Header name| Description
--- | ---
`Magento-Environment-Id` | This value is displayed at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment** or can be obtained by running the `bin/magento config:show services_connector/services_id/environment_id` command.
`-X-Gw-Signaturee` | [JWT](https://jwt.io/) generated token. The only required payload parameter is `exp`: the expiration time.
`X-Api-Key` | Your [Commerce API](https://developer.adobe.com/commerce/marketplace/guides/eqp/v1/access-keys/) key.

### Sample JWT code

This code generates a token with the JWT library:

```php
<?php

require __DIR__ . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

$privateKey = file_get_contents($argv[1]);

echo "\n================= JWT TOKEN =================\n";
$payload = array(
    'exp' => time()+300, // valid for the next 5 minutes
);
$jwt = JWT::encode($payload, $privateKey, 'RS256');
echo "JWT:\n" . print_r($jwt, true) . "\n";
```
