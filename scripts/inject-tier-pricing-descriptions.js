#!/usr/bin/env node

/**
 * Post-build script to inject enhanced tier pricing descriptions into SpectaQL generated HTML
 * This script adds improved type and field descriptions that emphasize the read-only nature of the API
 */

const fs = require('fs');
const path = require('path');

// Define the descriptions for tier pricing related types
const TYPE_DESCRIPTIONS = {
  'ProductViewTierPrice': {
    description: 'Represents a single tier in a product\'s volume-based pricing structure. Each tier defines a specific price that applies when certain quantity conditions are met.',
    fields: {
      'tier': 'The discounted price that applies when the quantity conditions are satisfied',
      'quantity': 'Array of conditions that determine when this tier price becomes active (for example, quantity ranges or exact quantities)'
    }
  },
  'ProductViewPrice': {
    description: 'Complete pricing information for a simple product, including base prices and all available volume-based tier pricing options.',
    fields: {
      'final': 'Final calculated price after applying discounts and promotions, but excluding personalized offers',
      'regular': 'Base price set by the merchant before any discounts or tier pricing',
      'tiers': 'Array of volume-based pricing tiers available for this product. Empty array indicates no tier pricing is available',
      'roles': 'Price visibility roles that determine which customer groups can see this pricing information'
    }
  },
  'Price': {
    description: 'Monetary value with currency information and any applied price adjustments. Can represent base prices, final calculated prices, or tier-specific prices.',
    fields: {
      'adjustments': 'List of price modifications applied to the base amount (for example, discounts, surcharges, taxes)',
      'amount': 'The monetary value including currency code'
    }
  },
  'ProductViewMoney': {
    description: 'Represents a monetary amount with its associated currency. Used throughout the pricing system to ensure currency information is always included with price values.',
    fields: {
      'currency': 'Three-letter ISO currency code (for example, USD, EUR, GBP)',
      'value': 'Numeric price value in the specified currency (for example, 99.99 for $99.99)'
    }
  },
  'ProductViewTierRangeCondition': {
    description: 'Defines a quantity range condition for tier pricing. Used when a tier price applies to a continuous range of quantities (for example, bulk discounts that start at 10 items and go up to 49 items).',
    fields: {
      'gte': 'Minimum quantity required for this tier (greater than or equal to). Example: 10 means this tier applies starting at 10 items',
      'lt': 'Maximum quantity for this tier, exclusive (less than). Example: 50 means this tier applies up to but not including 50 items. Null value indicates no upper limit'
    }
  },
  'ProductViewTierExactMatchCondition': {
    description: 'Defines exact quantity conditions for tier pricing. Used when special pricing applies only to specific quantities (for example, case pricing for exactly 12 items, or bulk packages of exactly 100 items).',
    fields: {
      'in': 'Array of exact quantities where this tier price applies. Example: [12, 24, 36] means the tier price only applies when purchasing exactly 12, 24, or 36 items'
    }
  },
  'ProductViewTierCondition': {
    description: 'Union type that defines the conditions under which a tier price applies. Supports both quantity ranges (for example, 10-49 items) and exact quantity matches (for example, exactly 12, 24, or 36 items).',
    isUnion: true
  }
};

/**
 * Inject type description into HTML
 */
function injectTypeDescription(html, typeName, description) {
  const sectionId = `definition-${typeName}`;
  const sectionPattern = new RegExp(
    `(<section id="${sectionId}"[^>]*>.*?<div class="doc-copy">)`,
    'gs'
  );

  const descriptionHtml = `
              <div class="definition-description doc-copy-section">
                <h5>Description</h5>
                <p>${description}</p>
              </div>`;

  return html.replace(sectionPattern, (match) => {
    return match + descriptionHtml;
  });
}

/**
 * Inject field description into HTML
 */
function injectFieldDescription(html, typeName, fieldName, description) {
  // Find the field row and update its description
  // Pattern: <td data-property-name=""><span class="property-name"><code>fieldName</code></span>...
  //          </td>
  //          <td> existing description </td>
  const fieldPattern = new RegExp(
    `(<td data-property-name="[^"]*"><span class="property-name"><code>${fieldName}</code></span>[\\s\\S]*?</td>\\s*<td>)([\\s\\S]*?)(</td>)`,
    'g'
  );

  return html.replace(fieldPattern, (match, openTd, currentDesc, closeTd) => {
    return `${openTd} ${description} ${closeTd}`;
  });
}

/**
 * Main function to process the HTML file
 */
function injectDescriptions(filePath) {
  console.log(`\n🔧 Injecting tier pricing descriptions into: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  let html = fs.readFileSync(filePath, 'utf8');
  let modificationsCount = 0;

  // Process each type
  Object.entries(TYPE_DESCRIPTIONS).forEach(([typeName, typeInfo]) => {
    console.log(`  📝 Processing ${typeName}...`);

    // Check if this type exists in the HTML
    const sectionExists = html.includes(`id="definition-${typeName}"`);
    if (!sectionExists) {
      console.log(`    ⚠️  Type ${typeName} not found in HTML, skipping...`);
      return;
    }

    // Inject type description
    const originalHtml = html;
    html = injectTypeDescription(html, typeName, typeInfo.description);
    if (html !== originalHtml) {
      console.log(`    ✅ Added type description for ${typeName}`);
      modificationsCount++;
    } else {
      console.log(`    ⚠️  Could not inject type description for ${typeName}`);
    }

    // Inject field descriptions (skip for union types)
    if (!typeInfo.isUnion && typeInfo.fields) {
      Object.entries(typeInfo.fields).forEach(([fieldName, fieldDescription]) => {
        const beforeFieldUpdate = html;
        html = injectFieldDescription(html, typeName, fieldName, fieldDescription);
        if (html !== beforeFieldUpdate) {
          console.log(`    ✅ Updated field description: ${typeName}.${fieldName}`);
          modificationsCount++;
        } else {
          console.log(`    ⚠️  Could not update field: ${typeName}.${fieldName}`);
        }
      });
    }
  });

  // Write the modified HTML back to file
  if (modificationsCount > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`\n✅ Successfully injected ${modificationsCount} descriptions into ${path.basename(filePath)}`);
  } else {
    console.log(`\n⚠️  No modifications were made to ${path.basename(filePath)}`);
  }
}

// Get file path from command line arguments or use default
const filePath = process.argv[2] || 'static/graphql-api/merchandising-api/index.html';
const fullPath = path.resolve(filePath);

injectDescriptions(fullPath);
