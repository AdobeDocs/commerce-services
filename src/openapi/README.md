# Data Ingestion REST API Reference documenation

The Data Ingestion API auto-generated API Reference is embedded into the Composable Catalog Data Model documentation using the [RedoclyAPIBlock](https://github.com/adobe/aio-theme?tab=readme-ov-file#redoclyapiblock)
supported by the Adobe I/O theme.

The OpenAPI schema source file (`data-ingestion-schema-v1.yaml`) is maintained by engineering and currently resides in developer documentation source repository for Commerce Services.

The generated schema is embedded in the [Data Ingestion API reference topic](https://github.com/AdobeDocs/commerce-services/edit/ccdm-early-access/src/pages/composable-catalog/data-ingestion/api-reference.md) in a `RedoclyAPIBlock` component.

## Update schema and regenerate documentation

1. Create a branch from the `ccdm-early-access` branch.

1. Update the `openapi/data-ingestion-schema-v1.yaml` as needed.

1. To regenerate API reference locally and test changes you can use the following command:

   ```shell
   npx @redocly/cli build-docs src/openapi/data-ingestion-schema-v1.yaml --config src/openapi/.redocly.yaml
   ```

   **NOTE:** The @redocly/cli tool has limited functionality comparing to the toolkit integrated in the website's infrastructure via RedoclyAPIBlock.

6. Push changes to remote.

7. Request review from the Commerce Documentation team.

8. After updates are approved, a documentation team member merges the PR and publishes the updates to [developer-stage site](https://developer-stage.adobe.com/commerce/services/composable-catalog/) for Early Access customers.

   You can review the currently published version in the [Data Ingestion API reference topic](https://developer-stage.adobe.com/commerce/services/composable-catalog/data-ingestion/api-reference/).
