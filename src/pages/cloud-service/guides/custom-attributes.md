---
title: Custom attributes in Adobe Commerce as a Cloud Service
description: Learn about custom attributes Commerce Cloud Service.
---

# Custom attributes in Adobe Commerce as a Cloud Service

Custom attributes can extend the core data model in Adobe Commerce. Since you cannot modify the Cloud Service data model directly, custom attributes allow you to add additional attributes to entities without requiring code or database schema changes.

Consider a situation where you want to modify specify a `duns_number` or `industry_type` information for a company. Custom attributes make this possible.

The following entities support custom attributes in Adobe Commerce as a Cloud Service:

- `Quote`
- `QuoteItem`
- `Order`
- `OrderItem`
- `Invoice`
- `InvoiceItem`
- `CreditMemo`
- `CreditMemoItem`
- `NegotiableQuote`
- `Company`

<InlineAlert variant="info" slots="text"/>

All custom attribute values are strings.

## Add custom attributes with REST

You can manage custom attributes using existing REST endpoints. ​ For example, you can set custom attributes for credit memos with `POST /V1/creditmemo` and retrieve those attributes with `GET /V1/creditmemo/:id`. ​

### Request

```json
{
  "entity": {
    "order_id": 53,
    "items": [
      {
        "order_item_id": 83,
        "custom_attributes": [
          {
            "attribute_code": "attribute_one",
            "value": "value_one"
          }
        ]
      }
    ],
    "custom_attributes": [
      {
        "attribute_code": "attribute_one",
        "value": "value_one"
      }
    ]
  }
}
```

### Response

```json
{
  "entity_id": 71,
  "order_id": 53,
  "items": [
    {
      "order_item_id": 83,
      "custom_attributes": [
        {
          "attribute_code": "attribute_one",
          "value": "value_one"
        }
      ]
    }
  ],
  "custom_attributes": [
    {
      "attribute_code": "attribute_one",
      "value": "value_one"
    }
  ]
}
```

## Add custom attributes with GraphQL

You can manage custom attributes using new `setCustomAttributesOn` mutations and existing queries. For example, you can add custom attributes to `Cart` and `CartItem` using the `setCustomAttributesOnCart` and `setCustomAttributesOnCartItem` mutations.

The following example adds a custom `Cart` attribute of `code_one`:`value_one`:

```graphql
mutation {
  setCustomAttributesOnCart(
    input: {
      cart_id: "38"
      custom_attributes: [{ attribute_code: "code_one", value: "value_one" }]
    }
  ) {
    cart {
      id
      custom_attributes {
        attribute_code
        value
      }
    }
  }
}
```

### Query

The values are available in the `cart` query, or any query that returns a `Cart` object:

```graphql
{
  cart(cart_id: "38") {
    items {
      id
    }
    custom_attributes {
      attribute_code
      value
    }
  }
}
```

### Response

The response will include the custom attribute:

```json
{
  "data": {
    "cart": {
      "items": [
        {
          "id": "24"
        }
      ],
      "custom_attributes": [
        {
          "attribute_code": "code_one",
          "value": "value_one"
        }
      ]
    }
  }
}
```
