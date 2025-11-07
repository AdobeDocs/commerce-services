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

To rebuild the GraphQL API references after any updates, use the following build scripts:

#### Standard Build Commands

Command | Description
------- |------------
`build:merchandising-api` | Regenerates the Merchandising API reference using live introspection
`dev:merchandising-api` | Regenerates the Merchandising API reference with a live preview of updated output
`build:graphql` | Regenerates both references

#### Enhanced Build with Description Injection

For the Merchandising API, you can use the enhanced build process that injects custom descriptions:

```shell
node scripts/build-with-enhanced-schema.js
```

This enhanced build process:

1. Fetches the live GraphQL schema via introspection
2. Injects custom descriptions from `spectaql/metadata-merchandising.json`
3. Generates documentation with enhanced descriptions for queries, types, and fields

**Use the enhanced build when:**

- You've added new documentation to `spectaql/metadata-merchandising.json`
- You want descriptions to appear for queries like `categoryTree` and `navigation`
- You need custom field and argument descriptions that aren't in the live schema

**Use the standard build when:**

- You only need basic schema documentation without custom descriptions
- You're working with schemas that already have complete descriptions

### Managing Custom Descriptions

The enhanced build process uses custom descriptions stored in `spectaql/metadata-merchandising.json`. This file contains documentation for:

- **Queries**: Descriptions for GraphQL queries like `categoryTree` and `navigation`
- **Types**: Descriptions for GraphQL types like `CategoryTreeView` and `CategoryNavigationView`
- **Fields**: Descriptions for individual fields within types
- **Arguments**: Descriptions for query and field arguments

#### Adding New Documentation

To add documentation for new queries, types, or fields:

1. **Edit the metadata file**: Add entries to `spectaql/metadata-merchandising.json` following the existing structure:

   **For Query Documentation:**

   ```json
   {
     "OBJECT": {
       "Query": {
         "fields": {
           "yourQueryName": {
             "documentation": {
               "description": "Description of what your query does and when to use it",
               "undocumented": false
             }
           }
         }
       }
     },
     "FIELD_ARGUMENT": {
       "Query": {
         "yourQueryName": {
           "argumentName": {
             "documentation": {
               "description": "Description of what this argument does",
               "undocumented": false
             }
           }
         }
       }
     }
   }
   ```

   **For Type Documentation:**

   ```json
   {
     "OBJECT": {
       "YourTypeName": {
         "documentation": {
           "description": "Description of your type and its purpose",
           "undocumented": false
         },
         "fields": {
           "fieldName": {
             "documentation": {
               "description": "Description of the field and its usage",
               "undocumented": false
             }
           }
         }
       }
     }
   }
   ```

   **Complete Example (categoryTree and navigation queries):**

   ```json
   {
     "OBJECT": {
       "Query": {
         "fields": {
           "categoryTree": {
             "documentation": {
               "description": "Retrieve hierarchical category data in a tree structure. This query allows you to fetch category information with parent-child relationships, useful for building category navigation menus and breadcrumbs.",
               "undocumented": false
             }
           },
           "navigation": {
             "documentation": {
               "description": "Retrieve category navigation data optimized for building storefront navigation menus. Returns a flattened structure of categories with their immediate children, ideal for creating responsive navigation components.",
               "undocumented": false
             }
           }
         }
       },
       "CategoryTreeView": {
         "documentation": {
           "description": "Represents a category in a hierarchical tree structure with parent-child relationships and level information.",
           "undocumented": false
         },
         "fields": {
           "slug": {
             "documentation": {
               "description": "The unique URL-friendly identifier for the category, used in routing and navigation.",
               "undocumented": false
             }
           },
           "name": {
             "documentation": {
               "description": "The display name of the category as shown to customers in the storefront.",
               "undocumented": false
             }
           },
           "level": {
             "documentation": {
               "description": "The hierarchical level of the category in the tree structure, where root categories have level 0.",
               "undocumented": false
             }
           },
           "parentSlug": {
             "documentation": {
               "description": "The slug of the parent category. Null for root-level categories.",
               "undocumented": false
             }
           },
           "childrenSlugs": {
             "documentation": {
               "description": "Array of slugs for all direct child categories. Empty array if the category has no children.",
               "undocumented": false
             }
           }
         }
       },
       "CategoryNavigationView": {
         "documentation": {
           "description": "Represents a category optimized for navigation purposes with recursive child category structure.",
           "undocumented": false
         },
         "fields": {
           "slug": {
             "documentation": {
               "description": "The unique URL-friendly identifier for the category, used in routing and navigation.",
               "undocumented": false
             }
           },
           "name": {
             "documentation": {
               "description": "The display name of the category as shown to customers in the storefront navigation.",
               "undocumented": false
             }
           },
           "children": {
             "documentation": {
               "description": "Array of direct child categories, each containing their own children in a recursive structure. Used to build multi-level navigation menus.",
               "undocumented": false
             }
           }
         }
       }
     },
     "FIELD_ARGUMENT": {
       "Query": {
         "categoryTree": {
           "family": {
             "documentation": {
               "description": "The catalog family identifier that determines which catalog's categories to retrieve. This is typically your store's catalog ID.",
               "undocumented": false
             }
           },
           "slugs": {
             "documentation": {
               "description": "Optional array of specific category slugs to retrieve. If provided, only these categories and their hierarchical relationships will be returned. If omitted, all categories in the family are returned.",
               "undocumented": false
             }
           },
           "depth": {
             "documentation": {
               "description": "Optional maximum depth level to retrieve in the category tree. Use this to limit how deep the hierarchy goes. If omitted, all levels are returned.",
               "undocumented": false
             }
           }
         },
         "navigation": {
           "family": {
             "documentation": {
               "description": "The catalog family identifier that determines which catalog's navigation structure to retrieve. This is typically your store's catalog ID.",
               "undocumented": false
             }
           }
         }
       }
     }
   }
   ```

2. **Rebuild with enhanced process**: Run `node scripts/build-with-enhanced-schema.js`

3. **Verify**: Check the generated `static/graphql-api/merchandising-api/index.html` for your descriptions

#### GraphQL Query Examples

Here are practical examples of how the documented queries would be used:

**categoryTree Query:**
```graphql
query GetCategoryTree($family: String!) {
  categoryTree(family: $family, depth: 3) {
    slug
    name
    level
    parentSlug
    childrenSlugs
  }
}
```

**navigation Query:**
```graphql
query GetNavigation($family: String!) {
  navigation(family: $family) {
    slug
    name
    children {
      slug
      name
      children {
        slug
        name
      }
    }
  }
}
```

**Variables:**
```json
{
  "family": "your-catalog-id"
}
```

#### Environment Variables Required

The enhanced build process requires these environment variables in your `.env` file:

```bash
TENANT_ID=your_tenant_id
CATALOG_VIEW_ID=your_catalog_view_id
ENVIRONMENT_ID=your_environment_id
```

#### Troubleshooting Enhanced Build

**Issue: "Missing required environment variables"**
- Solution: Ensure your `.env` file contains `TENANT_ID`, `CATALOG_VIEW_ID`, and `ENVIRONMENT_ID`

**Issue: "Server responded with status code 404"**
- Solution: Verify your environment variables are correct and the API endpoint is accessible

**Issue: Descriptions not appearing in generated HTML**
- Solution: Check that your metadata follows the correct JSON structure and run the enhanced build process

**Issue: Build fails with permission errors**
- Solution: The enhanced build may require network permissions to fetch the live schema

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

1. To regenerate an API reference locally and test changes:

   **For standard schema updates:**

   ```shell
   yarn dev:merchandising-api
   ```

   **For enhanced documentation with custom descriptions:**

   ```shell
   node scripts/build-with-enhanced-schema.js
   ```

   Use the enhanced build if you've added or modified descriptions in `spectaql/metadata-merchandising.json`.

1. Commit changes and push them to your remote branch.

1. Create and submit a PR against the `ccdm-early-access` branch, and request review from the Commerce Documentation team.

1. After updates are approved, a documentation team member merges the PR and publishes the updates to [developer site](https://developer.adobe.com/commerce/services/merchandising-services/) for Early Access customers.

   View the published API references:

   - [Storefront API Reference](https://developer.adobe.com/commerce/services/optimizer/reference/graphql/merchandising-api/)

### Resources

For more information about SpectaQL, refer to <https://github.com/anvilco/spectaql>.

## REST API Reference Generator

See [Generate the Data Ingestion API Reference](src/static/rest/README.md).

