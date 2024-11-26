# Data Ingestion REST API Reference documenation

The Data Ingestion API Reference is embedded in the Composable Catalog Data Model documentation using the `RedoclyAPIBlock` component from the Adobe I/O theme. 

- The OpenAPI schema source file, `data-ingestion-schema-v1.yaml` file is maintained by engineering in the Commerce Services documentation repository.

- The API reference generated from the schema is embedded in the [Data Ingestion API reference topic](https://github.com/AdobeDocs/commerce-services/edit/ccdm-early-access/src/pages/composable-catalog/data-ingestion/api-reference.md) using the `RedoclyAPIBlock` component. The component configuration includes:

- **Schema pathe**—The `src` variable points to the schema file on the `ccdm-early-access branch`: `https://raw.githubusercontent.com/AdobeDocs/commerce-services/refs/heads/ccdm-early-access/src/openapi/data-ingestion-schema-v1.yaml`. If the schema is moved, update the `src` variable to point to the new location.
  
- **Redocly options**—These configuration options are used when generating the API reference on the documentation server. For details, see [RedoclyAPIBlock](https://github.com/adobe/aio-theme?tab=readme-ov-file#redoclyapiblock).

**NOTE:** If you generate the schema locally, option settings are provided in the `.redocly.yaml` file. For details, see *[Configure Redoc] in the Redoc documentation.
  
## Update schema and regenerate documentation

1. Create a branch from the `ccdm-early-access` branch.

1. Update the `openapi/data-ingestion-schema-v1.yaml` as needed.

1. To regenerate API reference locally and test changes you can use the following command.

   ```shell
   npx @redocly/cli build-docs src/openapi/data-ingestion-schema-v1.yaml --config src/openapi/.redocly.yaml --output tmp/redoc-static.html
   ```

   The generated API reference is output to `tmp/redoc-static.html`. Open the file in your browser to review the updates.

   **NOTE:** The @redocly/cli tool has limited functionality compared to the toolkit integrated in the website's infrastructure via RedoclyAPIBlock.

1. After reviewing and testing changes, commit and push your changes.

1. Open a PR against the `ccdm-early-access` branch and request review from the Commerce Documentation team.

1. After updates are approved, a documentation team member merges the PR and publishes the updates to [developer-stage site](https://developer-stage.adobe.com/commerce/services/composable-catalog/) for Early Access customers.

   You can review the currently published version in the [Data Ingestion API reference topic](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/).
