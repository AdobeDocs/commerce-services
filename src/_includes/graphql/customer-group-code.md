The `customerGroupCode` is the encrypted value of the `Customer Group Id` which determines discounts and tax class for pricing context. For B2B implementations, the `Customer Group Id` also determines the Shared Catalog context.

Use one of the following values for a default customer group based on your requirements.

Customer Group | customerGroupCode
---------------| -----------------
**NOT LOGGED IN** | `b6589fc6ab0dc82cf12099d1c2d40ab994e8410c`
**General** | `356a192b7913b04c54574d18c28d46e6395428ab`
**Wholesale** | `da4b9237bacccdf19c0760cab7aec4a8359010b0`
**Retailer** |`77de68daecd823babbb58edb1c8e14d7106e83bb`

For custom groups, use the encrypted value of the Id, `sha1(<customer_group_id>)`

For B2B implementations, use the encrypted value of the `Customer Group Id` associated with the Shared Catalog, `sha1(<customer_group_id>)`.

<InlineAlert variant="info" slots="text"/>

Find a list of available Customer Group Ids from the Admin (**Customers** > **Customer Groups**). For details, see [Customer Groups](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customer-groups) and [Shared Catalogs](https://experienceleague.adobe.com/en/docs/commerce-admin/b2b/shared-catalogs/catalog-shared) in the _Merchant Guide_.
