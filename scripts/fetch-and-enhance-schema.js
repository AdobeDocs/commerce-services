#!/usr/bin/env node
/*
 *  Copyright 2025 Adobe All Rights Reserved.
 *  NOTICE:  All information contained herein is, and remains the property of Adobe and its suppliers, if any.
 *  The intellectual and technical concepts contained herein are proprietary to Adobe and its suppliers and are protected by all applicable intellectual property laws, including trade secret and copyright laws.
 *  Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained from Adobe.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config();

// Load our documentation metadata
const metadataPath = path.join(__dirname, '../spectaql/metadata-merchandising.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

/**
 * Fetch GraphQL introspection result from the API
 */
async function fetchIntrospection() {
  const tenantId = process.env.TENANT_ID;
  const catalogViewId = process.env.CATALOG_VIEW_ID;
  const environmentId = process.env.ENVIRONMENT_ID;
  
  if (!tenantId || !catalogViewId || !environmentId) {
    throw new Error('Missing required environment variables: TENANT_ID, CATALOG_VIEW_ID, ENVIRONMENT_ID');
  }
  
  const url = `https://na1-sandbox.api.commerce.adobe.com/${tenantId}/graphql`;
  const introspectionQuery = {
    query: `
      query IntrospectionQuery {
        __schema {
          queryType { name fields { name description args { name description type { name kind ofType { name kind } } } type { name kind ofType { name kind } } } }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
          directives {
            name
            description
            locations
            args {
              ...InputValue
            }
          }
        }
      }
      
      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }
      
      fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
      }
      
      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  };
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(introspectionQuery);
    
    const options = {
      hostname: 'na1-sandbox.api.commerce.adobe.com',
      port: 443,
      path: `/${tenantId}/graphql`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'AC-Catalog-View-ID': catalogViewId,
        'AC-Environment-ID': environmentId
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.errors) {
            reject(new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`));
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

/**
 * Inject descriptions into the introspection result
 */
function injectDescriptions(introspectionResult) {
  console.log('🔧 Injecting descriptions into schema...');
  
  // Clone to avoid mutations
  const result = JSON.parse(JSON.stringify(introspectionResult));
  
  // Inject query descriptions
  if (result.data && result.data.__schema && result.data.__schema.queryType) {
    injectQueryDescriptions(result.data.__schema.queryType);
  }
  
  // Inject type descriptions
  if (result.data && result.data.__schema && result.data.__schema.types) {
    injectTypeDescriptions(result.data.__schema.types);
  }
  
  // Also search for and inject descriptions in all Query types throughout the schema
  if (result.data && result.data.__schema && result.data.__schema.types) {
    result.data.__schema.types.forEach(type => {
      if (type.name === 'Query' && type.fields) {
        injectQueryDescriptions(type);
      }
    });
  }
  
  return result;
}

/**
 * Inject descriptions into query fields
 */
function injectQueryDescriptions(queryType) {
  if (!queryType.fields || !metadata.OBJECT || !metadata.OBJECT.Query || !metadata.OBJECT.Query.fields) {
    return;
  }
  
  queryType.fields.forEach(field => {
    const fieldMetadata = metadata.OBJECT.Query.fields[field.name];
    if (fieldMetadata && fieldMetadata.documentation && fieldMetadata.documentation.description) {
      // Always inject description, even if it already exists
      field.description = fieldMetadata.documentation.description;
      console.log(`📝 Injected description for query: ${field.name}`);
      
      // Also inject argument descriptions
      if (field.args && metadata.FIELD_ARGUMENT && metadata.FIELD_ARGUMENT.Query && metadata.FIELD_ARGUMENT.Query[field.name]) {
        field.args.forEach(arg => {
          const argMetadata = metadata.FIELD_ARGUMENT.Query[field.name][arg.name];
          if (argMetadata && argMetadata.documentation && argMetadata.documentation.description) {
            // Always inject argument description, even if it already exists
            arg.description = argMetadata.documentation.description;
            console.log(`📝 Injected description for argument: ${field.name}.${arg.name}`);
          }
        });
      }
    }
  });
}

/**
 * Inject descriptions into types and their fields
 */
function injectTypeDescriptions(types) {
  if (!metadata.OBJECT) return;
  
  types.forEach(type => {
    // Inject type description
    const typeMetadata = metadata.OBJECT[type.name];
    if (typeMetadata && typeMetadata.documentation && typeMetadata.documentation.description) {
      type.description = typeMetadata.documentation.description;
      console.log(`📝 Injected description for type: ${type.name}`);
    }
    
    // Inject field descriptions
    if (type.fields && typeMetadata && typeMetadata.fields) {
      type.fields.forEach(field => {
        const fieldMetadata = typeMetadata.fields[field.name];
        if (fieldMetadata && fieldMetadata.documentation && fieldMetadata.documentation.description) {
          field.description = fieldMetadata.documentation.description;
          console.log(`📝 Injected description for field: ${type.name}.${field.name}`);
          
          // Also inject argument descriptions for field arguments
          if (field.args && metadata.FIELD_ARGUMENT && metadata.FIELD_ARGUMENT[type.name] && metadata.FIELD_ARGUMENT[type.name][field.name]) {
            field.args.forEach(arg => {
              const argMetadata = metadata.FIELD_ARGUMENT[type.name][field.name][arg.name];
              if (argMetadata && argMetadata.documentation && argMetadata.documentation.description) {
                arg.description = argMetadata.documentation.description;
                console.log(`📝 Injected description for field argument: ${type.name}.${field.name}.${arg.name}`);
              }
            });
          }
        }
      });
    }
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Fetching GraphQL schema...');
    const introspectionResult = await fetchIntrospection();
    
    console.log('✅ Schema fetched successfully');
    
    // Inject our descriptions
    const enhancedResult = injectDescriptions(introspectionResult);
    
    // Save the enhanced schema
    const outputPath = path.join(__dirname, '../spectaql/enhanced-schema.json');
    fs.writeFileSync(outputPath, JSON.stringify(enhancedResult, null, 2));
    
    console.log(`✅ Enhanced schema saved to: ${outputPath}`);
    console.log('🎉 Schema enhancement completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, injectDescriptions };
