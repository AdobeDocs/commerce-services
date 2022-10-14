---
title: Product Recommendations SDK
description: Learn how to use the Product Recommendations SDK with Adobe Commerce to fetch recommendations programmatically in the browser.
---

# Product Recommendations SDK

If you need to programmatically access product recommendations for your storefront, use the [Product Recommendations JavaScript SDK](https://www.npmjs.com/package/@magento/recommendations-js-sdk). The SDK is a web services API wrapper that allows you to fetch recommendations programmatically in the browser. With the SDK, you do not need to manage the full lifecycle or understand the complexity of the web services API.

## Installing

### Dependencies

Before installing the Product Recommendations JavaScript SDK, make sure you have installed the [DataServices Module](https://github.com/magento/data-services-eap/tree/master/DataServices/docs/README.md#how-to-enroll) and the [Catalog SaaS Export module](https://gist.github.com/erikmarr/36a9f293dc78fefa2ec567c4b48bddee).

### Product Recommendations JavaScript SDK

This SDK can be pulled down from a CDN or installed as a module from NPM.

#### CDN

The SDK is published on a CDN in versioned directories.

```html
<script src="https://magento-recs-sdk.adobe.net/v1/index.js"></script>
```

#### NPM

```bash
npm install @magento/recommendations-js-sdk
```

## Initializing the client

To programmatically fetch and render recommendations on your web site, you must first initialize your client by calling `new RecommendationsClient()`.

### Example usage

```javascript
const client = new RecommendationsClient()
```

When you initialize the client, your store's `environmentId`, `instanceId`, `storeCode`, `storeViewCode`, and `websiteCode` values are automatically retrieved by the SDK.

## Registering recommendations

With the client initialized, register the recommendations you want by calling the `client.register()` function and specifying the recommendation type.

### Example usage

The following example registers a recommendation with a type of `most-viewed`.

```javascript
client.register({
    name: "Most Viewed Products",
    type: "most-viewed",
})
```

The following example shows how to filter a recommendation that has a base price of less than \$200.

```javascript
client.register({
    name: "Most Viewed, Under $200",
    type: "most-viewed",
    filter: "prices.maximum.regular: <200",
})
```

### Attributes

The `client.register()` function contains the following inputs.

| Input    | Description|
| -------- | ---------------------------------------------------------------------- |
| `name`   | The user-specified name of the recommendation unit  |
| `type`   | Options: `most-viewed`, `most-purchased`, `most-added-to-cart`, `trending`, `just-for-you`, `viewed-viewed`, `viewed-bought`, `bought-bought`, and `more-like-this`|
| `filter` | String used to filter the results. If you are setting a filter based on price, you must use the base currency specified for your store. Currency conversion is currently not supported when filtering|
| `search` | Defines the search criteria for your custom recommendation. This input contains the `signal` attribute. In non-custom recommendations, the values specified in this attribute are the types defined above. However, in a custom recommendation, the value is `"query"`. `search` might also contain a `key` attribute, such as `"categories:(159 OR 377)"`. The `key` attribute is not required by all custom recommendations. Some types require you to be on a product page, which would mean you know the current SKU. Other types are more broad, and do not require you to have any specific filter data as they are site wide. Site wide types do not require the `key` attribute. Possible `key` values are: `user_purchase_history`, `cart`, `current_pdp`, `user_view_history`, and `<custom query>` |
| `boost`  | User-specified value that indicates the rank of a specific recommendation|

#### Filtering

Currently, you can filter on categories and prices.

**Category**

To include specific categories:

`categories: (<url-key-1> OR <url-key-2> OR ...)`

To exclude specific categories (note the `-` at the beginning):

`-categories: (<url-key-1> OR <url-key-2> OR ...)`

**Prices**

To filter based on a specific price point (note that these filters use `$50` as the price point):

`prices.maximum.final: <50`
`prices.maximum.regular: <=50`
`prices.minimum.final: >50`
`prices.minimum.regular: >=50`

### Registering custom recommendations

Instead of using one of the built-in types, the SDK provides a way to define a custom type by calling the `client.register()` function and passing in specific search criteria. For example, you can pass in a search query, such as `"categories:(159 OR 377)"` to register a recommendation that has a category ID of either `159` or `377`.

## Fetching recommendations

You can fetch the registered recommendations by calling the `client.fetch()` function.

### Example usage

```javascript
const {status, data} = await client.fetch()
```

The following shows an example of the fetched recommendations. This example is intentionally truncated.

```json
{
    "units": [
        {
            "unitId": "45687",
            "unitName": "test-recs",
            "searchTime": 10,
            "totalResults": 3,
            "results": [
                {
                    "rank": 1,
                    "score": 0.38299224,
                    "sku": "35123",
                    "name": "Pursuit Lumaflex&trade; Tone Band",
                    "shortDescription": null,
                    "type": "simple",
                    "categories": [
                        "gear",
                        "gear/fitness-equipment"
                    ],
                    "weight": 0.0,
                    "weightType": null,
                    "currency": "USD",
                    "image": {
                        "label": "",
                        "url": "http://magento2sc.local/pub/media/catalog/product/cache/fbb00452bcc1f45faf89264b683c708f/u/g/ug02-bk-0.jpg"
                    },
                    "smallImage": {
                        "label": "",
                        "url": "http://magento2sc.local/pub/media/catalog/product/cache/fbb00452bcc1f45faf89264b683c708f/u/g/ug02-bk-0.jpg"
                    },
                    "thumbnailImage": null,
                    "swatchImage": null,
                    "parents": [],
                    "url": "http://magento2sc.local/pursuit-lumaflex-trade-tone-band.html",
                    "prices": {
                        "maximum": {
                            "finalAdjustments": [],
                            "final": 16.0,
                            "regular": 16.0,
                            "regularAdjustments": []
                        },
                        "minimum": {
                            "finalAdjustments": [],
                            "final": 16.0,
                            "regular": 16.0,
                            "regularAdjustments": []
                        }
                    }
                }
...
```

### Attributes

The `client.fetch()` function contains the following inputs.

| Input | Description |
| --------------------- | -------------------------------------------------------- |
| `ids`| Specifies the IDs of the recommendations. If unspecified, all recommendations are fetched; otherwise, only those recommendations you specify are fetched |
| `limit`| (Optional) Specifies the number of recommendations to fetch. The maximum is 25|
| `offset`| (Optional) Specifies where in the recommendations array to begin fetching the recommendations|
| `currentSku`| The SKU of the product on the current product page|
| `cartSkus`| The SKUs of the products within the cart|
| `userViewHistorySkus` | List of SKUs the user recently viewed|
| `userViewHistory`| List of recent user views|
| `userPurchaseHistory` | List of recent user purchases|

## Injecting recommendations on your web site

To display recommendations on your web site, you need to define a template for the recommendation then render the recommendation on the web site.

### Defining a template

The SDK works with the `mustache.js` template.

### Rendering a recommendation on your web site

The `client.render()` function creates a string of HTML you can then place on your web site.

### Attributes

The `client.render()` function contains the following inputs.

| Input      | Description|
| ---------- | ----------------------------------------- |
| `template` | A [mustache.js](https://github.com/janl/mustache.js) HTML template string. Uses reserved variable names such as `{{#rec-items}} : {{url}}, {{image}}, {{title}}, {{price}}`, which are `keys` returned in the `unit` object |
| `unit`| An object returned by the `client.fetch` method that contains the `results`|

## Using the SDK from start to finish

The following example shows a sample workflow beginning with importing the SDK to rendering the recommendation.

```javascript
import RecommendationsClient from "@magento/recommendations-js-sdk"

// create the client
const client = new RecommendationsClient()

// register pre-built recommendation unit
client.register({
    name: "Most Viewed Products",
    type: "most-viewed",
})

// retrieve recommendations for all units
const {status, data} = await client.fetch()

// render the markup
const markup = client.render({
    unit: data.units[0],
})

// insert the markup
document.body.insertAdjacentHTML("beforeend", markup)
```
