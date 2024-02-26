Header name| Description
--- | ---
`Magento-Environment-Id` | This value is displayed at **Stores** > **Configuration** > **Services** > **Magento Services** > **SaaS Environment** or can be obtained by running the `bin/magento config:show services_connector/services_id/environment_id` command.
`Magento-Store-Code` | The code assigned to the store associated with the active store view. For example, `main_website_store`.
`Magento-Store-View-Code` | The code assigned to the active store view. For example, `default`.
`Magento-Website-Code` | The code assigned to the website associated with the active store view. For example, `base`.
`X-Api-Key` | This value must be set to `search_gql`.

Header | Description
--- | ---
`Magento-Customer-Group` | This value is available in the `customer_group_data_exporter` database table.
`Magento-Environment-Id` | This value is displayed at **System** > **Commerce Services Connector** > **SaaS Identifier** > **Data Space ID** or can be obtained by running the `bin/magento config:show services_connector/services_id/environment_id` command.
`Magento-Store-Code`| The code assigned to the store associated with the active store view. For example, `main_website_store`.
`Magento-Store-View-Code`| The code assigned to the active store view. For example, `default`.
`Magento-Website-Code`| The code assigned to the website associated with the active store view. For example, `base`.
`X-Api-Key` |  The Commerce Services Connector public key.
