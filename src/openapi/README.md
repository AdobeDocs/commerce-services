# Data Ingestion REST API Reference documentation

The Data Ingestion API Reference is embedded in the [Data Ingestion API reference topic](https://github.com/AdobeDocs/commerce-services/edit/ccdm-early-access/src/pages/optimizer/data-ingestion/api-reference.md)  using the `RedoclyAPIBlock` component from the Adobe I/O theme. The component configuration includes:

  - **Schema path**—The `src` variable provides the path to the schema file used to generate the API reference. The schema, `data-ingestion-schema-v1.yaml` is maintained by engineering in this documentation repository. If the schema is moved, update the path value.

  - **Redocly options**—Configuration options that control the functionality of the generated API reference. For details, see [RedoclyAPIBlock](https://github.com/adobe/aio-theme?tab=readme-ov-file#redoclyapiblock).

**NOTE:** If you generate the schema locally, configuration options are provided in the `.redocly.yaml` file. For details, see *[Configure Redoc](https://redocly.com/docs/redoc/config)* in the Redoc documentation.

## Update schema and regenerate documentation

1. Create a branch from the `ccdm-early-access` branch.

1. Update the `openapi/data-ingestion-schema-v1.yaml`.

1. Regenerate the API reference locally to test changes:

   ```shell
   npx @redocly/cli build-docs src/openapi/data-ingestion-schema-v1.yaml --config src/openapi/.redocly.yaml --output tmp/redoc-static.html
   ```

   Review the updates by opening the `tmp/redoc-static.html` file in your browser.

   **NOTE:** The @redocly/cli tool has limited functionality compared to the toolkit integrated in the website's infrastructure via RedoclyAPIBlock.

1. After finalizing changes, commit and push the updates.

1. Open a PR against the `ccdm-early-access` branch and request review from the Commerce Documentation team.

1. After updates are approved, a documentation team member merges the PR and publishes the updates to [developer-stage site](https://developer-stage.adobe.com/commerce/services/optimizer/) for Early Access customers.

   You can review the currently published version in the [Data Ingestion API reference topic](https://developer-stage.adobe.com/commerce/services/optimizer/reference/rest/data-ingestion-api/).
