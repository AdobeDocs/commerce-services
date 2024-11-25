# Data Ingestion REST API Reference documenation

The Data Ingestion API auto-generated API Reference is embedded into the Composable Catalog Data Model documentation using the RedoclyAPIBlock
DevSite feature. 

The OpenAPI schema source file (`data-ingestion-schema-v1.yaml`) is maintained by development and currently resides in developer documentation source repository
for Commerce Services.

## Update schema and regenerate documentation

1. Create anbranch from the `ccdm-early-access` branch.
   
1. Update the `openapi/data-ingestion-schema-v1.yaml` as needed.
   
1. Regenerate API reference locally and test changes:
   
   ```shell
   npx @redocly/cli build-docs src/openapi/data-ingestion-schema-v1.yaml --config src/openapi/.redocly.yaml
   ```
6. Push changes to remote.

7. Request devdocs review.

8. After updates are approved, docs team member merges the PR and published the updates to
   [developer-stage site](https://developer-stage.adobe.com/commerce/services/composable-catalog/) for Early Access customers.
