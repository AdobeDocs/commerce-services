---
title: Use cases for the Merchandising API
edition: saas
description: Learn about the limitations and considerations when using the Merchandising API to retrieve catalog data from Adobe Commerce Optimizer.
keywords:
  - GraphQL
  - Services
  - Backend Development
  - Performance
---

# Use cases for the Merchandising API

The Merchandising API supports various e-commerce scenarios. The catalog data delivered by the API is filtered based on the request headers and the catalog view, catalog source, policy, and price book configuration in Adobe Commerce Optimizer. This allows you to create tailored storefront experiences for different customer segments, channels, and regions.

### E-commerce Storefronts

* **Product Catalogs**: Display product listings with filtering and sorting
* **Search Functionality**: Implement product search with autocomplete
* **Product Details**: Show comprehensive product information and variants

### Multi-channel Commerce

* **B2B Portals**: Customize catalogs for business customers
* **Marketplace Integration**: Power third-party marketplace listings
* **Mobile Apps**: Provide consistent data across mobile platforms
* **Headless Commerce**: Support decoupled frontend architectures

### Personalization

* **Customer Segmentation**: Deliver targeted product recommendations
* **Regional Pricing**: Display locale-specific pricing and availability
* **Dynamic Content**: Adapt product displays based on user behavior
* **A/B Testing**: Support experimentation with different product presentations

## Available Queries

The Merchandising API provides several GraphQL queries designed for different use cases.

| Query | Description | Use Case |
|-------|-------------|----------|
| `products` | Retrieve detailed information about specific products by SKU | Product detail pages, product comparison |
| `productSearch` | Search products with filters, sorting, and pagination | Search results, category pages, product listings |
| `refineProduct` | Get variant-specific information for configurable products | Product option selection, variant switching |
| `variants` | Retrieve all variants of a configurable product | Product detail pages, variant galleries |
| `recommendations` | Retrieve personalized product recommendations | Related products, cross-sells, and upsells |

## Query Examples

The following examples show how to retrieve product information using the product and productSearch queries.

<InlineAlert variant="info" slots="text" />

For details about query input and output fields with additional examples, see the <a href="https://developer.adobe.com/commerce/services/reference/graphql/" target="_blank" rel="noopener noreferrer">Merchandising API Reference</a>.

### Return product details

The Catalog Service for Adobe Commerce products query returns details about the SKUs specified as input. Although this query has the same name as the [products query](https://developer.adobe.com/commerce/webapi/graphql/schema/products/queries/products/) that is provided with Adobe Commerce, there are some differences.

The Catalog Service query requires one or more SKU values as input. The query is primarily designed to retrieve information to render the following types of content:

* Product detail pages - You can provide full details about the product identified by the specified SKU.
* Product compare pages - You can retrieve selected information about multiple products, such as the name, price and image.

<InlineAlert variant="info" slots="text"/>

Use the [`productSearch` query](#product-search) to return product listing page content.

The query returns a `ProductView` output object with the product content values.

#### Return details about a simple product

The following query returns details about simple product with sku `cru-sus-prm-2014`. `

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request**

```graphql
query {
	products(skus: ["cru-sus-prm-2014"]) {
        __typename
        id
        sku
        name
        description
        shortDescription
        addToCartAllowed
        url
        images(roles: []) {
            url
            label
            roles
        }
        attributes(roles: []) {
            name
            label
            value
            roles
        }
        inputOptions {
            id
            title
            required
            type
            markupAmount
            suffix
            sortOrder
            range {
                from
                to
            }
            imageSize {
                width
                height
            }
            fileExtensions
        }
        ... on SimpleProductView {
            price {
                final {
                    amount {
                        value
                        currency
                    }
                }
                regular {
                    amount {
                        value
                        currency
                    }
                }
                roles
            }
        }
        links {
            product {
                sku

            }
            linkTypes
        }
    }
}
```

**Response**

```json
{
	"data": {
		"products": [
			{
				"__typename": "SimpleProductView",
				"id": "Y3J1LXN1cy1wcm0tMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
				"sku": "cru-sus-prm-2014",
				"name": "Cruz Verde Suspension Premium (2014)",
				"description": "Premium suspension for the Cruz Verde, delivering top-tier comfort and handling for eco-conscious drivers.",
				"shortDescription": "Cruz Verde part",
				"images": [
					{
						"url": "https://i.imgur.com/PvrH35S.jpg",
						"label": "Cruz Verde Suspension Premium (2014)",
						"roles": [
							"thumbnail",
							"image",
							"small_image"
						]
					}
				],
				"attributes": [
					{
						"name": "brand",
						"label": "Brand",
						"value": "Cruz",
						"roles": [
							"visible_in_pdp",
							"visible_in_compare_list",
							"visible_in_plp",
							"visible_in_search"
						]
					},
					{
						"name": "model",
						"label": "Vehicle Model",
						"value": "Verde",
						"roles": [
							"visible_in_pdp",
							"visible_in_compare_list",
							"visible_in_plp",
							"visible_in_search"
						]
					},
					{
						"name": "model_year",
						"label": "Vehicle Model Year",
						"value": "2014",
						"roles": [
							"visible_in_pdp",
							"visible_in_compare_list",
							"visible_in_plp",
							"visible_in_search"
						]
					},
					{
						"name": "country",
						"label": "Dealer Country",
						"value": "USA",
						"roles": [
							"visible_in_pdp",
							"visible_in_compare_list",
							"visible_in_plp",
							"visible_in_search"
						]
					},
					{
						"name": "part_category",
						"label": "Part Category",
						"value": "suspension",
						"roles": [
							"visible_in_pdp",
							"visible_in_compare_list",
							"visible_in_plp",
							"visible_in_search"
						]
					}
				],
				"price": null,
				"links": [
					{
						"product": {
							"sku": "cru-sus-std-2014"
						},
						"linkTypes": [
							"related"
						]
					}
				]
			}
		]
	},
	"extensions": {
		"request-id": "a95140e9-47f5-4f51-9386-8b6bbf50fd48"
	}
}

#### Return details about a complex product

The following query returns details about a complex bundled product with sku `cru-2014-parts`. This bundle provides the optional selections to configure the quality level (standard, midrange, premium) for Cruz Verde 2014 product parts:

* `tires`
* `brakes`
* `batteries`
* `suspension`
* `motor`
  
For each part type, the default configuration is to use the standard part quality.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request**

```graphql
query GetBundleProductDetails {
  products(skus: "cru-2014-parts") {
    __typename
    id
    sku
    name
    urlKey
    description
    shortDescription
    metaDescription
    metaKeyword
    metaTitle
    lastModifiedAt
    
    attributes(roles: ["PDP", "PLP", "Search"]) {
      name
      label
      value
      roles
    }
    images(roles: ["image", "small_image", "thumbnail"]) {
      url
      label
      roles
    }
    videos {
      url
      title
      description
      preview {
        url
        label
        roles
      }
    }
    links {
      linkTypes
      product {
        sku
        name
      }
    }
    ... on ComplexProductView {    
      options {
        id
        title
        required
        multi
        values {
          id
          title
          inStock
          ... on ProductViewOptionValueProduct {
            quantity
            isDefault
            product {
              __typename
              id
              sku
              name
              description
              shortDescription
              urlKey
              images(roles: ["image", "small_image"]) {
                url
                label
                roles
              }
              attributes(roles: ["PDP"]) {
                name
                label
                value
                roles
              }
            }
          }
          ... on ProductViewOptionValueConfiguration {
            id
            title
            inStock
          }
          ... on ProductViewOptionValueSwatch {
            id
            title
            type
            value
            inStock
          }
        }
      }
    }
  }
}
```

**Response**

```json
{
	"data": {
		"products": [
			{
				"__typename": "ComplexProductView",
				"id": "Y3J1LTIwMTQtcGFydHMAZW4tVVMARnd1czZrZHB2WUNtZUVkY0NYN1BaZwBTVE9SRV9DT0RFAFdFQlNJVEVfQ09ERQ",
				"sku": "cru-2014-parts",
				"name": "Cruz Verde parts build",
				"urlKey": "bundle-cru-verde-parts",
				"description": "",
				"shortDescription": "",
				"metaDescription": "",
				"metaKeyword": "",
				"metaTitle": "",
				"lastModifiedAt": "2025-09-16T03:52:36.957Z",
				"attributes": [],
				"images": [],
				"videos": [],
				"links": [],
				"options": [
					{
						"id": "tires",
						"title": "tires",
						"required": false,
						"multi": false,
						"values": [
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtdGlyLXN0ZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Tires Standard (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": true,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LXRpci1zdGQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-tir-std-2014",
									"name": "Cruz Verde Tires Standard (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-tires-standard-2014",
									"images": [],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtdGlyLW1pZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Tires Midrange (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LXRpci1taWQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-tir-mid-2014",
									"name": "Cruz Verde Tires Midrange (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-tires-midrange-2014",
									"images": [],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtdGlyLXBybS0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Tires Premium (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LXRpci1wcm0tMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-tir-prm-2014",
									"name": "Cruz Verde Tires Premium (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-tires-premium-2014",
									"images": [],
									"attributes": []
								}
							}
						]
					},
					{
						"id": "brakes",
						"title": "brakes",
						"required": false,
						"multi": false,
						"values": [
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtYmF0LXN0ZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Battery Standard (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": true,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LWJhdC1zdGQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-bat-std-2014",
									"name": "Cruz Verde Battery Standard (2014)",
									"description": "Standard battery for the Cruz Verde, providing reliable power for eco-friendly driving.",
									"shortDescription": "Cruz Verde part",
									"urlKey": "cruz-verde-battery-standard-2014",
									"images": [
										{
											"url": "https://i.imgur.com/Juozyen.jpg",
											"label": "Cruz Verde Battery Standard (2014)",
											"roles": [
												"thumbnail",
												"image",
												"small_image"
											]
										}
									],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtYmF0LW1pZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Battery Midrange (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LWJhdC1taWQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-bat-mid-2014",
									"name": "Cruz Verde Battery Midrange (2014)",
									"description": "Mid-range battery for the Cruz Verde, offering improved capacity and longevity.",
									"shortDescription": "Cruz Verde part",
									"urlKey": "cruz-verde-battery-midrange-2014",
									"images": [
										{
											"url": "https://i.imgur.com/UDgjM4g.jpg",
											"label": "Cruz Verde Battery Midrange (2014)",
											"roles": [
												"thumbnail",
												"image",
												"small_image"
											]
										}
									],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtYmF0LXBybS0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Battery Premium (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LWJhdC1wcm0tMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-bat-prm-2014",
									"name": "Cruz Verde Battery Premium (2014)",
									"description": "Premium battery for the Cruz Verde, delivering maximum power and efficiency for eco-conscious drivers.",
									"shortDescription": "Cruz Verde part",
									"urlKey": "cruz-verde-battery-premium-2014",
									"images": [
										{
											"url": "https://i.imgur.com/pD5e160.jpg",
											"label": "Cruz Verde Battery Premium (2014)",
											"roles": [
												"thumbnail",
												"image",
												"small_image"
											]
										}
									],
									"attributes": []
								}
							}
						]
					},
					{
						"id": "suspension",
						"title": "suspension",
						"required": false,
						"multi": false,
						"values": [
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtc3VzLXN0ZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Suspension Standard (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": true,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LXN1cy1zdGQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-sus-std-2014",
									"name": "Cruz Verde Suspension Standard (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-suspension-standard-2014",
									"images": [],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtc3VzLW1pZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Suspension Midrange (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LXN1cy1taWQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-sus-mid-2014",
									"name": "Cruz Verde Suspension Midrange (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-suspension-midrange-2014",
									"images": [],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtc3VzLXBybS0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Suspension Premium (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LXN1cy1wcm0tMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-sus-prm-2014",
									"name": "Cruz Verde Suspension Premium (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-suspension-premium-2014",
									"images": [],
									"attributes": []
								}
							}
						]
					},
					{
						"id": "motor",
						"title": "motor",
						"required": false,
						"multi": false,
						"values": [
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtbW90LXN0ZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Motor Standard (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": true,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LW1vdC1zdGQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-mot-std-2014",
									"name": "Cruz Verde Motor Standard (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-motor-standard-2014",
									"images": [],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtbW90LW1pZC0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Motor Midrange (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LW1vdC1taWQtMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-mot-mid-2014",
									"name": "Cruz Verde Motor Midrange (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-motor-midrange-2014",
									"images": [],
									"attributes": []
								}
							},
							{
								"id": "YnVuZGxlX2l0ZW0veyJza3UiOiJjcnUtbW90LXBybS0yMDE0IiwgInF0eSI6MS4wfQ==",
								"title": "Cruz Verde Motor Premium (2014)",
								"inStock": true,
								"quantity": 1.0,
								"isDefault": false,
								"product": {
									"__typename": "SimpleProductView",
									"id": "Y3J1LW1vdC1wcm0tMjAxNABlbi1VUwBGd3VzNmtkcHZZQ21lRWRjQ1g3UFpnAFNUT1JFX0NPREUAV0VCU0lURV9DT0RF",
									"sku": "cru-mot-prm-2014",
									"name": "Cruz Verde Motor Premium (2014)",
									"description": "",
									"shortDescription": "",
									"urlKey": "cruz-verde-motor-premium-2014",
									"images": [],
									"attributes": []
								}
							}
						]
					}
				]
			}
		]
	},
	"extensions": {
		"request-id": "e804166e-d456-430a-9c65-00409d6ef326"
	}
}
```

### Product Search

Return information about simple products. This examples uses the productSearch query to return information about battery products for Cruz Verde 2014 models.

<CodeBlock slots="heading, code" repeat="2" languages="JSON" />

**Request**

```graphql
query {
  productSearch(phrase: "Verde battery 2014" page_size: 10) {
    items {
      productView {
        sku
        name
        description
        shortDescription
        images {
          url
        }
        ... on SimpleProductView {
          attributes {
            label
            name
            value
          }
        }
      }
    }
  }
}
```

**Response**

```json
{
	"data": {
		"productSearch": {
			"items": [
				{
					"productView": {
						"sku": "cru-bat-std-2014",
						"name": "Cruz Verde Battery Standard (2014)",
						"description": "Standard battery for the Cruz Verde, providing reliable power for eco-friendly driving.",
						"shortDescription": "Cruz Verde part",
						"images": [
							{
								"url": "https://i.imgur.com/Juozyen.jpg"
							}
						],
						"attributes": [
							{
								"label": "Brand",
								"name": "brand",
								"value": "Cruz"
							},
							{
								"label": "Vehicle Model",
								"name": "model",
								"value": "Verde"
							},
							{
								"label": "Vehicle Model Year",
								"name": "model_year",
								"value": "2014"
							},
							{
								"label": "Dealer Country",
								"name": "country",
								"value": "USA"
							},
							{
								"label": "Part Category",
								"name": "part_category",
								"value": "battery"
							}
						]
					}
				},
				{
					"productView": {
						"sku": "cru-bat-mid-2014",
						"name": "Cruz Verde Battery Midrange (2014)",
						"description": "Mid-range battery for the Cruz Verde, offering improved capacity and longevity.",
						"shortDescription": "Cruz Verde part",
						"images": [
							{
								"url": "https://i.imgur.com/UDgjM4g.jpg"
							}
						],
						"attributes": [
							{
								"label": "Brand",
								"name": "brand",
								"value": "Cruz"
							},
							{
								"label": "Vehicle Model",
								"name": "model",
								"value": "Verde"
							},
							{
								"label": "Vehicle Model Year",
								"name": "model_year",
								"value": "2014"
							},
							{
								"label": "Dealer Country",
								"name": "country",
								"value": "USA"
							},
							{
								"label": "Part Category",
								"name": "part_category",
								"value": "battery"
							}
						]
					}
				},
				{
					"productView": {
						"sku": "cru-bat-prm-2014",
						"name": "Cruz Verde Battery Premium (2014)",
						"description": "Premium battery for the Cruz Verde, delivering maximum power and efficiency for eco-conscious drivers.",
						"shortDescription": "Cruz Verde part",
						"images": [
							{
								"url": "https://i.imgur.com/pD5e160.jpg"
							}
						],
						"attributes": [
							{
								"label": "Brand",
								"name": "brand",
								"value": "Cruz"
							},
							{
								"label": "Vehicle Model",
								"name": "model",
								"value": "Verde"
							},
							{
								"label": "Vehicle Model Year",
								"name": "model_year",
								"value": "2014"
							},
							{
								"label": "Dealer Country",
								"name": "country",
								"value": "USA"
							},
							{
								"label": "Part Category",
								"name": "part_category",
								"value": "battery"
							}
						]
					}
				}
			]
		}
	},
	"extensions": {
		"request-id": "e16c1e38-bd1f-4c06-ad72-8a1166087d2a"
	}
}
```
