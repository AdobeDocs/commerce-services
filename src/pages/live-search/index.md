---
title: Live Search Events | Commerce Services
description: Lists events in the Adobe Commerce Event SDK that are applicable to Live Search.
keywords:
  - Search
  - Services
---

# Live Search events

The [_Adobe Commerce Event SDK_](../shared-services/storefront-events/sdk/) provides access to a common data layer, with event publishing and subscription services.  The [_Adobe Commerce Event Collector_](../shared-services/storefront-events/collector/) package listens for events and includes the following search-related functions:

|Function|Description|
|---|---|
|`searchProductClick`|Triggered when a shopper clicks a product in the "search as you type" popover or on the search results page. |
|`searchRequestSent`|Triggered by the following events in the "search as you type" popover:<br />- Type or press Enter<br />- Click _View All_<br /><br />Triggered by the following events on search results pages:<br />- Select a filter<br />- Change the sort order (_Sort By_)<br />- Change the sort direction (ascending or descending)<br />- Change the number of results per page (_Show # per page_)<br />- Navigate to the next page<br />- Navigate to the previous page<br />- Navigate to a different page|
|`searchResponseReceived`|Triggered when Live Search returns results for the "search as you type" popover or search results page.|
|`searchResultsView`|Triggered when results appear in the "search as you type" popover or search results page.|
|`searchSuggestionClick`|Triggered when a shopper clicks a product suggestion in the "search as you type" popover.|

## Related information

* [Introduction to Live Search](https://experienceleague.adobe.com/en/docs/commerce/live-search/overview)
* [GraphQL queries](https://developer.adobe.com/commerce/webapi/graphql/schema/live-search/)
