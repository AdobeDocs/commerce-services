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

## Components

To achieve specific user experience goals for Commerce documentation, this repo overrides the original [`Edition`](https://github.com/adobe/aio-theme/blob/main/packages/gatsby-theme-aio/src/components/Edition/index.js) component from the upstream [`aio-theme`](https://github.com/adobe/aio-theme/) repo that we use as a dependency.

### Edition

The custom `Edition` component in this repo displays a badge indicating whether a feature or functionality is available in specific Adobe Commerce environments. It has been customized to align with the badges that we use in Experience League docs.

#### Usage

```yaml
# Page-level (metadata)
edition: saas # For SaaS-only features
edition: paas # For PaaS-only features
```

```md
<!-- Section-level (inline) -->
<Edition name="paas" />  <!-- For PaaS-only features -->
<Edition name="saas" />  <!-- For SaaS-only features -->
```

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

- `config-admin.yml`: [configuration file to generate the Channels and Policies API Reference](spectaql/config-admin.yml). (Not used in the current implementation, but included for future use.)
- `config-merchandising.yml`: [configuration file to generate the Merchandising Services API Reference](spectaql/config-admin.yml).

These configuration files include the endpoint for each API service.

When you build the API reference, the build script uses live introspection to retrieve the GraphQL schemas and generate the API references. The configuration file also provides the introductory text for the Welcome topic, the API reference title, and other settings used when generating the references.

The resulting GraphQL API references are output to the `static/graphql-api/` directory.

- `static/graphql/admin-api/index.html`
- `static/graphql/merchandising-api/index.html`

The references are embedded in the API Reference page using the `frameSrc` feature supported by the Adobe I/O theme.

- [Channels and Policies API Reference](src/pages/optimizer/reference/graphql/merchandising-api/) `frameSrc: /graphql-api/merchandising-api/index.html`

### Build commands

To rebuild the GraphQL API references after any updates, use yarn locally to run the following build scripts as needed:

Command | Description
------- |------------
`build:merchandising-api` | Regenerates the Merchandising API reference
`dev:merchandising-api` | Regenerates the Merchandising API reference with a live preview of updated output
`build:graphql` | Regenerates both references

For example, to rebuild the Catalog management and rules API, run the command:

```shell
yarn build:admin-api
```

### How to get the schema

The Spectaql configuration files for the Merchandising Services GraphQL API references use the following endpoints to retrieve the schemas and generate the API references:

- Channels and Policies API: https://commerce-admin-router-qa.corp.ethos501-stage-va6.ethos.adobe.net/graphql

- Storefront API: https://catalog-service-qa.adobe.io/graphql

If either of these endpoints change, update the live introspection URL in the corresponding config file in the `spectaql` directory with the new endpoint.

### Update the API References

If a schema changes, rebuild and test the API reference locally.  Then, submit a PR with updates against the `ccdm-early-access` branch. After the PR is merged, someone from the documentation team will publish the changes to the documentation server.

For local builds, ensure that your environment has the following installed:

- Node.js that matches the version set in the [.nvmrc](https://github.com/AdobeDocs/commerce-services/blob/main/.nvmrc) ([nvm](https://github.com/nvm-sh/nvm) configuration file).
- Yarn

## Update schema and regenerate documentation

1. Create a branch from the `ccdm-early-access` branch.

1. To regenerate an API reference locally and test changes in live preview, use either of the following commands:

   ```shell
   yarn `dev:merchandising-api`
   ```

1. Commit changes and push them to your remote branch.

1. Create and submit a PR against the `ccdm-early-access` branch, and request review from the Commerce Documentation team.

1. After updates are approved, a documentation team member merges the PR and publishes the updates to [developer site](https://developer.adobe.com/commerce/services/merchandising-services/) for Early Access customers.

   View the published API references:

   - [Storefront API Reference](https://developer.adobe.com/commerce/services/optimizer/reference/graphql/merchandising-api/)

### Resources

For more information about SpectaQL, refer to <https://github.com/anvilco/spectaql>.

## REST API Reference Generator

See [Generate the Data Ingestion API Reference](src/openapi/README.md).
