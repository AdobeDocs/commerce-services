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

The Merchandising GraphQL API reference is generated using [SpectaQL](https://github.com/anvilco/spectaql). It fetches the live schema via introspection, injects custom descriptions from a metadata overlay, and filters the schema down to the include only the queries and types supported by Adobe Commerce Optimizer catalog service operations.

### Quick start

1. Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

2. Build the API reference:

   ```bash
   yarn build:merchandising-api
   ```

The generated output is written to `static/graphql-api/merchandising-api/index.html` and embedded in the documentation site using the Adobe I/O theme's `frameSrc` feature. After rebuilding, verify the output in your browser before committing changes.

To generate a live preview during local development, run: `yarn dev:merchandising-api`.

### Prerequisites

- Node.js matching the version in [.nvmrc](https://github.com/AdobeDocs/commerce-services/blob/main/.nvmrc)
- Yarn

### Update the API reference

If the schema or metadata descriptions change, rebuild and test the API reference locally:

1. Create a branch from `main`.
2. Regenerate the API reference:

   ```bash
   yarn build:merchandising-api
   ```

3. Verify the output in your browser.
4. Commit the updated `index.html` and `enhanced-schema.json` files.
5. After updates are approved, a documentation team member merges the PR and publishes the updates to the [developer site](https://developer.adobe.com/commerce/services/merchandising-services/).

See [`spectaql/README.md`](spectaql/README.md) for detailed configuration, build commands, offline builds, and script documentation.

## REST API Reference Generator

See [Generate the Data Ingestion API Reference](src/static/rest/README.md).
