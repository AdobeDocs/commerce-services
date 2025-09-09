const fs = require('fs');

// Read the generated HTML file
const htmlContent = fs.readFileSync('static/graphql-api/merchandising-api/index.html', 'utf8');

// Extract all type definitions with their kinds
const typeDefinitions = [];
const definitionRegex = /id="definition-([^"]+)"[^>]*class="definition definition-([^"]+)"/g;

let match;
while ((match = definitionRegex.exec(htmlContent)) !== null) {
  const typeName = match[1];
  const typeKind = match[2];
  typeDefinitions.push({ name: typeName, kind: typeKind });
}

// Group by kind
const typesByKind = {
  'scalar': [],
  'object': [],
  'interface': [],
  'enum': [],
  'union': [],
  'input': []
};

typeDefinitions.forEach(type => {
  const kind = type.kind.toLowerCase();
  if (typesByKind[kind]) {
    typesByKind[kind].push(type.name);
  } else {
    console.log(`Unknown kind: ${type.kind} for ${type.name}`);
  }
});

// Sort each category
Object.keys(typesByKind).forEach(kind => {
  typesByKind[kind].sort();
});

console.log('=== INCLUDED TYPES SUMMARY ===');
console.log(`Total Types: ${typeDefinitions.length}`);
console.log('');

Object.keys(typesByKind).forEach(kind => {
  if (typesByKind[kind].length > 0) {
    console.log(`${kind.toUpperCase()}: ${typesByKind[kind].length} types`);
    typesByKind[kind].forEach(typeName => {
      console.log(`  - ${typeName}`);
    });
    console.log('');
  }
});

// Save to JSON for markdown generation
fs.writeFileSync('included_types_summary.json', JSON.stringify(typesByKind, null, 2));
console.log('Saved type summary to included_types_summary.json');

