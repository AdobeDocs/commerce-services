Header | Description
--- | ---
`Magento-Customer-Group` | Specify the `customerGroupCode` for the API request. This code is the encrypted value of the `Customer Group Id` which determines discounts and tax class for pricing context. For B2B implementations, the `Customer Group ID` also determines the Shared Catalog context. For details, see [Determine value for `Magento-Customer-Group`](#determine-value-for-the-customer-group-header).
`Magento-Environment-Id` | This value is displayed at **System** > **Commerce Services Connector** > **SaaS Identifier** > **Data Space ID** or can be obtained by running the `bin/magento config:show services_connector/services_id/environment_id` command.
`Magento-Store-Code`| The code assigned to the store associated with the active store view. For example, `main_website_store`.
`Magento-Store-View-Code`| The code assigned to the active store view. For example, `default`.
`Magento-Website-Code`| The code assigned to the website associated with the active store view. For example, `base`.
`X-Api-Key` | Set this value to the [unique API key](https://experienceleague.adobe.com/en/docs/commerce-merchant-services/user-guides/integration-services/saas#genapikey) generated for your Commerce environment.

###  Determine value for the Customer Group header

For the `Magento-Customer-Group` header use one of the following values for a default Commerce implementation based on your requirements:

| Customer Group | Default ID | customerGroupCode value |
|----------------|------------|-------------------|
| NOT LOGGED IN  | 0          | `b6589fc6ab0dc82cf12099d1c2d40ab994e8410c`
| General        | 1          | `356a192b7913b04c54574d18c28d46e6395428ab`
| Wholesale      | 2          | `da4b9237bacccdf19c0760cab7aec4a8359010b0`
| Retailer       | 3          | `customerGroupCode":"77de68daecd823babbb58edb1c8e14d7106e83bb","name":"Retailer"

For B2B implementations, the `customerGroupCode` value is the encrypted `Customer Group ID` associated with the Shared Catalog, `sha1(<customer_group_id>)`.

>[!NOTE]
>
>Find a list of available Customer Group IDs from the Admin (**[!UICONTROL Customers]** > **[!UICONTROL Customer Groups]**). For more information, see [Customer Groups](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customer-groups) and [Shared Catalogs](https://experienceleague.adobe.com/en/docs/commerce-admin/b2b/shared-catalogs/catalog-shared) in the _Merchant Guide_.
