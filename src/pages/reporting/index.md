---
title: Adobe Commerce Reporting API | Commerce Services
description: Learn how to import data into your Adobe Commerce data warehouse and export raw data from your Adobe Commerce Reporting dashboards.
keywords:
  - Reporting
  - REST
  - Services
---

# Adobe Commerce Reporting API

You can use the Adobe Commerce Reporting API to [import](import-api.md) data into your data warehouse and [export](export-api.md) raw data from your Adobe Commerce Reporting dashboards.

The API is entirely HTTP-based. Methods are defined by an HTTP verb (GET, POST, PUT, DELETE), a URL, and a set of arguments. The response HTTP status code will be `200-Success` for all successful requests, unless otherwise specified. This API accepts and returns valid JSON for all its methods.

To make integrating with the API easier, you can use one of the following [libraries](libraries.md).

## Authentication

Adobe Commerce Reporting API calls require an authorization token. The token must be passed in the HTTP header of every request, which allows Adobe Commerce to verify that the caller is authorized to access a system resource. You must use two different tokens depending on if you are using the import API or the export API.

### Generating authentication token for the import API

Authentication with the Data Import API is done with a single API key and your RJMetrics client ID.

To create an import API key:

1. Log into Adobe Commerce Reporting and select **Manage Data** > **Integrations**.
1. Click **Add an Integration**.
1. Select the **Data Import API** data source.

With the API key you can now authenticate, but first check the status of the Data Import API by calling:

```bash
curl -v https://connect.rjmetrics.com
```

This will return a `200-Success` response if the API is operational.

Next, authenticate to the API by passing in your client ID and API key:

```bash
curl -v https://connect.rjmetrics.com/v2/client/:cid/authenticate?apikey=:apikey
```

<InlineAlert variant="warning" slots="text" />

This key has write access to your Adobe Commerce Reporting data warehouse. Do not distribute this key to untrusted third parties.

### Generating authentication token for the export API

​To create an export API authentication token:

1. Log into Adobe Commerce Reporting and select **Manage Data** > **Export Data** > **Export API**.
1. Click **Create a new Export API Key**.

You must specify this key in the `X-RJM-API-Key` header of every export request.
​
All keys must be associated with a single client and a set of IP addresses that are allowed to make requests. IP addresses can be specified either as a specific address, or as a range of addresses in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). For example, the CIDR notation to allow ALL IP addresses would be: `0.0.0.0/0`.

![CIDR notation to allow all IP addresses](../_images/reporting/mbi-valid-ip-address.png)
