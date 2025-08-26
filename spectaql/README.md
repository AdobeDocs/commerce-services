# SpectaQL configuration with environment variables

This directory contains SpectaQL configuration files for generating GraphQL API documentation.

## Configuration files

- `config-admin.yml` - Configuration for the Admin API
- `config-merchandising.yml` - Configuration for the Merchandising API (uses environment variables)

## Using environment variables

The merchandising API configuration uses a `TENANT_ID` environment variable to dynamically set the GraphQL endpoint URL.

**Security Note:** Only use `.env` files to avoid exposing sensitive information in CLI history.

### Recommended: Use .env file

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your tenant ID
TENANT_ID=your_tenant_id_here
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

# Run the build
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
