const fs = require('fs');
const path = require('path');

// ─── Paths ────────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, '..');
const SCHEMA_PATH = path.join(ROOT, 'spectaql/enhanced-schema.json');
const META_PATH = path.join(ROOT, 'spectaql/metadata-merchandising.json');
const OUTPUT_PATH = path.join(ROOT, 'src/pages/reference/graphql/index.md');

// ─── Load data ────────────────────────────────────────────────────────────────
const schemaData = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
const allTypes = schemaData.data.__schema.types;

const typeMap = {};
allTypes.forEach(t => { typeMap[t.name] = t; });

// ─── Type ref utilities ───────────────────────────────────────────────────────

function getTypeName(typeRef) {
  if (!typeRef) return null;
  return typeRef.name || getTypeName(typeRef.ofType);
}

function getTypeSignature(typeRef) {
  if (!typeRef) return '';
  if (typeRef.kind === 'NON_NULL') return getTypeSignature(typeRef.ofType) + '!';
  if (typeRef.kind === 'LIST') return `[${getTypeSignature(typeRef.ofType)}]`;
  return typeRef.name || '';
}

function isListType(typeRef) {
  if (!typeRef) return false;
  if (typeRef.kind === 'LIST') return true;
  if (typeRef.kind === 'NON_NULL') return isListType(typeRef.ofType);
  return false;
}

// Generates a markdown link like [`[String!]`](#string)
function typeToLink(typeRef) {
  const sig = getTypeSignature(typeRef);
  const name = getTypeName(typeRef);
  if (!name) return `\`${sig}\``;
  const anchor = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `[\`${sig}\`](#${anchor})`;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

const UNDOCUMENTED_QUERIES = new Set(
  Object.entries(meta.OBJECT?.Query?.fields || {})
    .filter(([, v]) => v.documentation?.undocumented)
    .map(([k]) => k)
);

function isUndocumentedType(name) {
  if (name.startsWith('__')) return true;
  const sections = ['OBJECT', 'INPUT_OBJECT', 'ENUM', 'UNION', 'INTERFACE', 'SCALAR'];
  for (const s of sections) {
    if (meta[s]?.[name]?.documentation?.undocumented) return true;
  }
  return false;
}

// ─── Collect reachable types from documented queries ──────────────────────────

function collectReachable(typeName, visited = new Set()) {
  if (!typeName || visited.has(typeName) || typeName.startsWith('__')) return visited;
  visited.add(typeName);
  const t = typeMap[typeName];
  if (!t) return visited;
  [...(t.fields || []), ...(t.inputFields || [])].forEach(f => {
    collectReachable(getTypeName(f.type), visited);
    (f.args || []).forEach(a => collectReachable(getTypeName(a.type), visited));
  });
  (t.possibleTypes || []).forEach(pt => collectReachable(pt.name, visited));
  (t.interfaces || []).forEach(i => collectReachable(i.name, visited));
  return visited;
}

const queryType = typeMap['Query'];

// Use ASCII sort (case-sensitive) to match the original SpectaQL output order,
// where uppercase letters sort before lowercase (e.g. productSearch before products).
const asciiSort = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const documentedQueries = queryType.fields
  .filter(f => !UNDOCUMENTED_QUERIES.has(f.name))
  .sort((a, b) => asciiSort(a.name, b.name));

const reachableNames = new Set();
documentedQueries.forEach(f => {
  collectReachable(getTypeName(f.type), reachableNames);
  f.args.forEach(a => collectReachable(getTypeName(a.type), reachableNames));
});

const documentedTypeNames = [...reachableNames]
  .filter(name => !isUndocumentedType(name))
  .sort(asciiSort);

// ─── Example value generation ─────────────────────────────────────────────────

// Returns a counter-based example generator that alternates between two values
function makeExampleCounter() {
  let stringIdx = 0;
  let intIdx = 0;
  const STRINGS = ['abc123', 'xyz789'];
  const INTS = [123, 987];
  const FLOATS = [123.4, 987.6];
  return {
    str: () => `"${STRINGS[stringIdx++ % 2]}"`,
    int: () => String(INTS[intIdx++ % 2]),
    float: () => String(FLOATS[intIdx++ % 2]),
    bool: () => (stringIdx++ % 2 === 0 ? 'true' : 'false'),
  };
}

function scalarExample(scalarName, c) {
  switch (scalarName) {
    case 'String':   return c.str();
    case 'Int':      return c.int();
    case 'Float':    return c.float();
    case 'Boolean':  return c.bool();
    case 'ID':       return '"4"';
    case 'DateTime': return '"2007-12-03T10:15:30Z"';
    case 'JSON':     return '{}';
    default:         return null;
  }
}

// Returns an example value for a typeRef in a variables JSON block
function variableValue(typeRef, c) {
  if (!typeRef) return 'null';
  if (typeRef.kind === 'NON_NULL') return variableValue(typeRef.ofType, c);
  if (typeRef.kind === 'LIST') return `[${variableValue(typeRef.ofType, c)}]`;
  const scalar = scalarExample(typeRef.name, c);
  if (scalar !== null) return scalar;
  return typeRef.name; // complex type: use name as placeholder
}

// Returns an example value for a field in a response JSON block
function responseValue(typeRef, c) {
  if (!typeRef) return 'null';
  if (typeRef.kind === 'NON_NULL') return responseValue(typeRef.ofType, c);
  if (typeRef.kind === 'LIST') return `[${responseValue(typeRef.ofType, c)}]`;
  const scalar = scalarExample(typeRef.name, c);
  if (scalar !== null) return scalar;
  const t = typeMap[typeRef.name];
  if (t?.kind === 'ENUM' && t.enumValues?.length) {
    c.str(); // advance counter to keep parity with SpectaQL
    return `"${t.enumValues[0].name}"`;
  }
  // Object/interface/union: use the type name as an unquoted placeholder (matches SpectaQL output)
  return typeRef.name;
}

// ─── Query example generation ─────────────────────────────────────────────────

// Returns true when a field should use `{ ...TypeFragment }` notation in a query example
function needsFragment(typeRef) {
  const name = getTypeName(typeRef);
  if (!name) return false;
  const t = typeMap[name];
  if (!t) return false;
  return t.kind !== 'SCALAR' && t.kind !== 'ENUM';
}

function buildFieldSelection(fields, indent) {
  return fields.map(f => {
    if (needsFragment(f.type)) {
      const typeName = getTypeName(f.type);
      return `${indent}${f.name} {\n${indent}  ...${typeName}Fragment\n${indent}}`;
    }
    return `${indent}${f.name}`;
  }).join('\n');
}

function generateQueryExample(query) {
  const returnTypeName = getTypeName(query.type);
  const returnType = typeMap[returnTypeName];
  const hasArgs = query.args.length > 0;
  const singleArg = query.args.length === 1;

  const fields = returnType?.fields || [];
  const selection = buildFieldSelection(fields, '    ');

  let queryOpen, callOpen;
  if (!hasArgs) {
    queryOpen = `query ${query.name}`;
    callOpen = `  ${query.name}`;
  } else if (singleArg) {
    // Compact single-line format for single-arg queries (matches SpectaQL output)
    const decl = `$${query.args[0].name}: ${getTypeSignature(query.args[0].type)}`;
    const pass = `${query.args[0].name}: $${query.args[0].name}`;
    queryOpen = `query ${query.name}(${decl})`;
    callOpen = `  ${query.name}(${pass})`;
  } else {
    const argDecls = `\n${query.args.map(a => `  $${a.name}: ${getTypeSignature(a.type)}`).join(',\n')}\n`;
    const argPasses = `\n${query.args.map(a => `    ${a.name}: $${a.name}`).join(',\n')}\n  `;
    queryOpen = `query ${query.name}(${argDecls})`;
    callOpen = `  ${query.name}(${argPasses})`;
  }

  return `${queryOpen} {\n${callOpen} {\n${selection}\n  }\n}`;
}

function generateVariablesExample(query) {
  if (query.args.length === 0) return null;
  const c = makeExampleCounter();
  const entries = query.args.map(a => {
    // Use the schema's defaultValue when present (e.g. current_page: 1, page_size: 20)
    const val = a.defaultValue != null ? a.defaultValue : variableValue(a.type, c);
    return `  "${a.name}": ${val}`;
  });
  // Compact single-line format for single-arg queries (matches SpectaQL output)
  if (query.args.length === 1) {
    return `{${entries[0].trim()}}`;
  }
  return `{\n${entries.join(',\n')}\n}`;
}

function generateResponseExample(query) {
  const returnTypeName = getTypeName(query.type);
  const returnType = typeMap[returnTypeName];
  const c = makeExampleCounter();

  if (!returnType?.fields) {
    return `{\n  "data": {\n    "${query.name}": null\n  }\n}`;
  }

  const buildFields = (fields, indent) =>
    fields.map(f => `${indent}"${f.name}": ${responseValue(f.type, c)}`).join(',\n');

  let value;
  if (isListType(query.type)) {
    const inner = buildFields(returnType.fields, '        ');
    value = `[\n      {\n${inner}\n      }\n    ]`;
  } else {
    const inner = buildFields(returnType.fields, '      ');
    value = `{\n${inner}\n    }`;
  }

  return `{\n  "data": {\n    "${query.name}": ${value}\n  }\n}`;
}

// ─── Markdown section generators ─────────────────────────────────────────────

function generateQuerySection(query) {
  const parts = [];
  parts.push(`### ${query.name}\n`);

  if (query.description) {
    parts.push(`${normalizePeriod(query.description)}\n`);
  }

  const returnSig = typeToLink(query.type);
  parts.push(`**Response:** ${returnSig}\n`);

  if (query.args.length > 0) {
    parts.push('**Arguments:**\n');
    parts.push('| Name | Description |');
    parts.push('| --- | --- |');
    query.args.forEach(a => {
      const typeLink = typeToLink(a.type);
      const desc = sanitizeForTable(argDesc(a));
      parts.push(`| \`${a.name}\` - ${typeLink} | ${desc} |`);
    });
    parts.push('');
  }

  parts.push('#### Example\n');

  const queryText = generateQueryExample(query);
  parts.push('##### Query\n');
  parts.push('```graphql');
  parts.push(queryText);
  parts.push('```\n');

  const vars = generateVariablesExample(query);
  if (vars) {
    parts.push('##### Variables\n');
    parts.push('```json');
    parts.push(vars);
    parts.push('```\n');
  }

  const resp = generateResponseExample(query);
  parts.push('##### Response\n');
  parts.push('```json');
  parts.push(resp);
  parts.push('```\n');

  return parts.join('\n');
}

function generateFieldLevelArgs(fields) {
  const fieldsWithArgs = fields.filter(f => f.args?.length > 0);
  if (fieldsWithArgs.length === 0) return null;

  const lines = ['Field-level arguments for filtering:\n'];
  fieldsWithArgs.forEach(f => {
    const argsSig = f.args.map(a => `${a.name}: ${getTypeSignature(a.type)}`).join(', ');
    const desc = f.description ? `: ${f.description}` : '';
    lines.push(`- \`${f.name}(${argsSig})\`${desc}`);
  });
  return lines.join('\n');
}

// Add a trailing period to a description if it doesn't end with sentence-ending punctuation.
function normalizePeriod(text) {
  if (!text) return text;
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : trimmed + '.';
}

// Sanitize a description for use inside a markdown table cell:
// collapse newlines, escape pipe characters, and escape brackets that could
// be misread as markdown links.
function sanitizeForTable(text) {
  if (!text) return '';
  return text
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .replace(/\[([^\]]*)\]/g, (_, inner) => `\\[${inner}\\]`)
    .trim();
}

// Build the full description for a field, appending deprecation reason when present.
function fieldDesc(f) {
  const parts = [];
  if (f.description) parts.push(normalizePeriod(f.description));
  if (f.isDeprecated && f.deprecationReason) parts.push(f.deprecationReason);
  return parts.join(' ');
}

// Build the description for a query argument, appending default value when present.
function argDesc(a) {
  const parts = [];
  if (a.description) parts.push(normalizePeriod(a.description));
  if (a.defaultValue != null) parts.push(`Default = \`${a.defaultValue}\``);
  return parts.join(' ');
}

function generateFieldsTable(fields, isInput = false) {
  const header = isInput ? 'Input Field' : 'Field Name';
  const rows = ['| ' + header + ' | Description |', '| --- | --- |'];
  fields.forEach(f => {
    const typeLink = typeToLink(f.type);
    const desc = sanitizeForTable(fieldDesc(f));
    rows.push(`| \`${f.name}\` - ${typeLink} | ${desc} |`);
  });
  return rows.join('\n');
}

function generateTypeSection(typeName) {
  const t = typeMap[typeName];
  if (!t) return '';

  const parts = [];
  parts.push(`## ${typeName}\n`);

  if (t.description) {
    parts.push(`${normalizePeriod(t.description)}\n`);
  }

  switch (t.kind) {
    case 'SCALAR': {
      // Special case: add an example line for DateTime
      if (typeName === 'DateTime') {
        parts.push('\n**Example:** `"2007-12-03T10:15:30Z"`\n');
      }
      break;
    }

    case 'ENUM': {
      const values = (t.enumValues || []).map(v => `\`${v.name}\``).join(', ');
      parts.push(`**Values:** ${values}\n`);
      break;
    }

    case 'UNION': {
      const members = (t.possibleTypes || []).map(p => `\`${p.name}\``).join(', ');
      parts.push(`**Union types:** ${members}\n`);
      break;
    }

    case 'INPUT_OBJECT': {
      const inputFields = t.inputFields || [];
      parts.push(generateFieldsTable(inputFields, true) + '\n');
      break;
    }

    case 'OBJECT':
    case 'INTERFACE': {
      const fields = t.fields || [];

      const fieldLevelArgs = generateFieldLevelArgs(fields);
      if (fieldLevelArgs) {
        parts.push(fieldLevelArgs + '\n');
      }

      if (fields.length > 0) {
        parts.push(generateFieldsTable(fields) + '\n');
      }

      if (t.possibleTypes?.length > 0) {
        const links = t.possibleTypes
          .filter(p => !isUndocumentedType(p.name))
          .map(p => {
            const anchor = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return `[\`${p.name}\`](#${anchor})`;
          })
          .join(', ');
        if (links) {
          const label = t.kind === 'UNION' ? 'Union types' : 'Possible types';
          parts.push(`**${label}:** ${links}\n`);
        }
      }
      break;
    }
  }

  return parts.join('\n');
}

// ─── Static page sections ─────────────────────────────────────────────────────

const FRONTMATTER = `---
title: Merchandising API Reference
edition: saas
description: Get information about the merchandising APIs to retrieve product and catalog data to create storefront experiences.
keywords:
  - GraphQL
  - Search
  - Recommendations
  - Services
  - Storefront
  - Merchandising
---`;

const INTRO = `# Merchandising GraphQL API

The Merchandising GraphQL API enables developers to build rich, dynamic storefront experiences by providing efficient access to catalog data from Adobe Commerce Optimizer. This API is designed for frontend applications that need to retrieve product information, pricing, search results, and recommendations in real-time. For more information about the API, see the [developer documentation](../../optimizer/merchandising-services/index.md).

## API endpoint

\`\`\`text
https://na1-sandbox.api.commerce.adobe.com/{TENANT_ID}/graphql
\`\`\`

## Headers

\`\`\`text
# Required. View ID for catalog context.
AC-View-Id: cde0ab4c-1f7b-4e12-91f6-9c7840ab6523
# Required. Content type header.
Content-Type: application/json
# Price book identifier for pricing context.
AC-Price-Book-ID: us
# Trigger name and value that sets data access filters to restrict product access based on request attributes.
AC-Policy-{*}: AC-Policy-Brand
\`\`\`

## Required headers

All API requests must include the following headers:

- \`AC-View-Id\`: View ID for catalog context
- \`Content-Type\`: application/json

These headers ensure proper context for your API requests. See the server configuration above for example values.`;

// ─── Main ─────────────────────────────────────────────────────────────────────

function generate() {
  const sections = [FRONTMATTER, '', INTRO, '', '## Queries', ''];

  documentedQueries.forEach(q => {
    sections.push(generateQuerySection(q));
  });

  sections.push('## Types\n');

  documentedTypeNames.forEach(name => {
    sections.push(generateTypeSection(name));
  });

  return sections.join('\n').trimEnd() + '\n';
}

function main() {
  console.log('   Generating GraphQL API reference markdown...');
  console.log(`   Schema:   ${SCHEMA_PATH}`);
  console.log(`   Metadata: ${META_PATH}`);
  console.log(`   Output:   ${OUTPUT_PATH}`);

  const output = generate();
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');

  console.log(`  Generated ${documentedQueries.length} queries and ${documentedTypeNames.length} types`);
}

if (require.main === module) {
  main();
}

module.exports = { generate };
