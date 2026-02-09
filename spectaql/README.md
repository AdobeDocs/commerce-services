# SpectaQL configuration with environment variables

This directory contains SpectaQL configuration files for generating GraphQL API documentation.

## Configuration files

- `config-admin.yml` - Configuration for the Admin API
- `config-merchandising.yml` - Configuration for the Merchandising API (uses environment variables)
- `metadata-merchandising.json` - Documentation overlay that filters which queries, types, and fields appear in the API reference
- `enhanced-schema.json` - Generated schema file with injected descriptions (created during build)

## Using environment variables

The merchandising API configuration uses environment variables to dynamically set the GraphQL endpoint URL and headers.

**Security Note:** Only use `.env` files to avoid exposing sensitive information in CLI history.

### Recommended: Use .env file

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your credentials
TENANT_ID=your_tenant_id_here
CATALOG_VIEW_ID=your_catalog_view_id
```

Then run the npm scripts:

```bash
# Build the documentation
yarn build:merchandising-api

# Or run in development mode
yarn dev:merchandising-api
```

## Environment variables

- `TENANT_ID` - Your Adobe Commerce tenant ID (required)
- `CATALOG_VIEW_ID` - Your catalog view ID (required for schema introspection)

## Generating the documentation overlay

The documentation overlay (`metadata-merchandising.json`) filters which parts of the GraphQL API appear in the generated reference documentation. This is useful when the gateway endpoint exposes a superset of the API and you want to document only specific queries, types, and fields.

### How the overlay works

The overlay uses a structured JSON format to mark items as documented or undocumented:

- `"undocumented": true` - Hides the item from the API reference
- `"undocumented": false` - Includes the item with an optional custom description

### Overlay structure

```json
{
  "OBJECT": {
    "TypeName": {
      "documentation": {
        "undocumented": true
      }
    },
    "DocumentedType": {
      "documentation": {
        "description": "Custom description for this type.",
        "undocumented": false
      },
      "fields": {
        "fieldName": {
          "documentation": {
            "description": "Custom field description.",
            "undocumented": false
          }
        }
      }
    },
    "Query": {
      "fields": {
        "queryName": {
          "documentation": {
            "description": "Query description.",
            "undocumented": false
          }
        },
        "hiddenQuery": {
          "documentation": {
            "undocumented": true
          }
        }
      }
    }
  },
  "INPUT_OBJECT": {
    "InputTypeName": {
      "documentation": {
        "undocumented": true
      }
    }
  },
  "ENUM": {
    "EnumName": {
      "documentation": {
        "undocumented": true
      }
    }
  },
  "FIELD_ARGUMENT": {
    "Query": {
      "queryName": {
        "argumentName": {
          "documentation": {
            "description": "Argument description.",
            "undocumented": false
          }
        }
      }
    }
  }
}
```

### Steps to generate an overlay

1. **Fetch the full schema from the gateway endpoint:**

   ```bash
   node scripts/fetch-and-enhance-schema.js
   ```

   This creates `spectaql/enhanced-schema.json` with the complete schema.

2. **Identify items to filter:**

   Review the generated schema and identify queries, types, and fields that should be hidden from the documentation.

3. **Update the metadata file:**

   Edit `spectaql/metadata-merchandising.json` to add entries for items you want to hide or document with custom descriptions.

4. **Build the documentation:**

   ```bash
   yarn build:merchandising-api
   ```

### Enhanced build process

For documentation with full description injection:

```bash
node scripts/build-with-enhanced-schema.js
```

This process:

1. Fetches the live GraphQL schema via introspection
2. Injects custom descriptions from `spectaql/metadata-merchandising.json`
3. Saves enhanced schema to `spectaql/enhanced-schema.json`
4. Runs SpectaQL using the enhanced schema file
5. Generates `static/graphql-api/merchandising-api/index.html` with descriptions

## Generated files

When using the tenant-specific scripts, a temporary configuration file `config-merchandising-temp.yml` is created with the actual tenant ID substituted. This file is automatically cleaned up after SpectaQL finishes running.

### Automatic cleanup

The temporary configuration files are automatically deleted after use to keep your workspace clean. This happens:

- When SpectaQL completes successfully
- When SpectaQL encounters an error
- When the process is interrupted (Ctrl+C)
- When the process is terminated

## Example

```bash
# Set in .env file
TENANT_ID=abc123
CATALOG_VIEW_ID=cde0ab4c-1f7b-4e12-91f6-9c7840ab6523
ENVIRONMENT_ID=Fwus6kdpvYCmeEdcCX7PZg

# Run the build with enhanced descriptions
node scripts/build-with-enhanced-schema.js

# Or run the standard build
yarn build:merchandising-api

# This will generate documentation for:
# https://na1-sandbox.api.commerce.adobe.com/abc123/graphql
```

## Notes

- The `${TENANT_ID}` placeholder in the YAML file is not processed by SpectaQL directly
- The Node.js script `scripts/generate-spectaql-config.js` handles the substitution
- Temporary configuration files are automatically cleaned up after use
- A `.env.example` file is provided as a template - copy it to `.env` and customize
- The `.env` file is already in `.gitignore` to prevent committing sensitive information
- **Security**: Only use `.env` files to avoid exposing tenant IDs in CLI history
