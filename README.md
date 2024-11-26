# Services for Adobe Commerce Documentation

Welcome! This site contains the latest Services for Adobe Commerce developer documentation for ongoing releases.

## Local development

This is a [Gatsby](https://www.gatsbyjs.com/) project that uses the [Adobe I/O Theme](https://github.com/adobe/aio-theme).

To build the site locally:

1. Clone this repo.
1. Install project dependencies.

   ```bash
   yarn install
   ```

1. Launch the project in development mode.

   ```bash
   yarn dev
   ```

**Tip:** If you encounter unexpected failures or delays, try to clean up the gatsby and yarn caches with the command: `yarn clean && yarn cache clean` for troubleshooting.

## Resources

See the following resources to learn more about using the theme:

- [Arranging content structure](https://github.com/adobe/aio-theme#content-structure)
- [Linking to pages](https://github.com/adobe/aio-theme#links)
- [Using assets](https://github.com/adobe/aio-theme#assets)
- [Configuring global navigation](https://github.com/adobe/aio-theme#global-navigation)
- [Configuring side navigation](https://github.com/adobe/aio-theme#side-navigation)
- [Using content blocks](https://github.com/adobe/aio-theme#jsx-blocks)
- [Writing enhanced Markdown](https://github.com/adobe/aio-theme#writing-enhanced-markdown)
- [Deploying the site](https://github.com/adobe/aio-theme#deploy-to-azure-storage-static-websites) _(Adobe employees only)_

If you have questions, open an issue and ask us. We look forward to hearing from you!

## GraphQL API reference generator

The GraphQL API reference is generated using [SpectaQL](https://github.com/anvilco/spectaql), an open source tool. The data required for the generator is located in the `spectaql` directory:

- `config-admin.yml`: [configuration file to generate the CCDM Catalog management and rules API Reference](spectaql/config-admin.yml).
- `config-storefront.yml`: [configuration file to generate the CCDM Storefront API Reference](spectaql/config-admin.yml).

These configuration files include the endpoint for each API service.

When you build the API reference, the build script uses live introspection to retrieve the GraphQL schemas and generate the API references. The configuration file also provides the introductory text for the Welcome topic, the API reference title, and other settings used when generating the references.

The resulting GraphQL API references are output to the `static/graphql-api/` directory.

- `static/graphql/admin-api/index.html`
- `static/graphql/storefront-api/index.html`

The references are embedded in the API Reference page using the `frameSrc` feature supported by the Adobe I/O theme.

- [Catalog management and rules API Reference](src/pages/composable-catalog/admin/api-reference.md) `frameSrc: /graphql-api/admin-api/index.html`

- [Storefront API reference](src/pages/composable-catalog/storefront-services/api-reference.md) `frameSrc: /graphql-api/storefront-api/index.html`

### Build commands

To rebuild the GraphQL API references after any updates, use yarn locally to run the following build scripts as needed:

Command | Description
------- |------------
`build:admin-api` | Regenerates the Catalog management and rules API reference
`dev:admin-api` | Regenerates the Catalog management and rules API reference with a live preview of updated output
`build:storefront-api` | Regenerates the Storefront API reference
`dev:storefront-api` | Regenerates the Catalog management and rules API reference with a live preview of updated output
`build:graphql` | Regenerates both references

For example, to rebuild the Catalog management and rules API, run the command:

```shell
yarn build:admin-api
```

### How to get the schema

The Spectaql configuration files for the CCDM GraphQL API references use the following endpoints to retrieve the schemas and generate the API references:

- Catalog management and rules API: https://commerce-admin-router-qa.corp.ethos501-stage-va6.ethos.adobe.net/graphql

- Storefront API: https://catalog-service-qa.adobe.io/graphql

If either of these endpoints change, update the live introspection URL in the corresponding config file in the `spectaql` directory with the new endpoint.

### Update the API References

If a schema changes, rebuild and test the API reference locally.  Then, submit a PR with updates against the `ccdm-early-access` branch. After the PR is merged, someone from the documentation team will publish the changes to the documentation server.

## Update schema and regenerate documentation

1. Create a branch from the `ccdm-early-access` branch.

1. To regenerate an API reference locally and test changes in live preview, use either of the following commands:

   ```shell
   yarn `dev:admin-api`
   ```

   ```shell
   yarn `dev:storefront-api`
   ```

1. Commit changes and push them to your remote branch.

1. Create and submit a PR against the `ccdm-early-access` branch, and request review from the Commerce Documentation team.

1. After updates are approved, a documentation team member merges the PR and publishes the updates to [developer-stage site](https://developer-stage.adobe.com/commerce/services/composable-catalog/) for Early Access customers.

   View the published API references:

   - [Catalog management and rules API Reference](https://developer-stage.adobe.com/commerce/services/composable-catalog/admin/api-reference/)
   - [Storefront API Reference](https://developer-stage.adobe.com/commerce/services/composable-catalog/storefront-services/api-reference/)

### Resources

For more information about SpectaQL, refer to <https://github.com/anvilco/spectaql>.

## REST API Reference Generator

See [Generate the Data Ingestion API Reference](src/openapi/README.md).
